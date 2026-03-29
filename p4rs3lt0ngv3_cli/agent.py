from __future__ import annotations

import difflib
import re
from dataclasses import asdict
from typing import Any

from .bridge import auto_decode, inspect_transform, list_transforms, run_transform
from .models import AgentStep, TransformInfo


TEXT_QUOTE_RE = re.compile(r"""['"](?P<text>[^'"]+)['"]""")


def find_transform(query: str) -> TransformInfo | None:
    normalized = query.strip().lower().replace("-", "_")
    transforms = list_transforms()

    exact = {transform.key: transform for transform in transforms}
    if normalized in exact:
        return exact[normalized]

    for transform in transforms:
        if normalized == transform.name.lower():
            return transform
        if normalized in transform.search_tokens:
            return transform

    name_map = {transform.key: transform for transform in transforms}
    matches = difflib.get_close_matches(normalized, list(name_map), n=1, cutoff=0.55)
    if matches:
        return name_map[matches[0]]

    token_matches = []
    query_tokens = set(re.findall(r"[a-z0-9_]+", normalized))
    for transform in transforms:
        score = len(query_tokens & transform.search_tokens)
        if score:
            token_matches.append((score, transform.priority, transform))
    if token_matches:
        token_matches.sort(key=lambda item: (item[0], item[1]), reverse=True)
        return token_matches[0][2]

    return None


def coerce_option_value(raw: str) -> Any:
    lowered = raw.lower()
    if lowered in {"true", "false"}:
        return lowered == "true"
    if re.fullmatch(r"-?\d+", raw):
        return int(raw)
    if re.fullmatch(r"-?\d+\.\d+", raw):
        return float(raw)
    return raw


def extract_text(prompt: str) -> str | None:
    match = TEXT_QUOTE_RE.search(prompt)
    if match:
        return match.group("text")
    return None


def extract_transform_query(prompt: str) -> str | None:
    patterns = [
        r"\b(?:as|using|with|via|from|into|to)\s+([a-z0-9 _-]+?)(?:\s+with\b|\s+without\b|$)",
        r"\b(?:inspect|show|details for|about)\s+([a-z0-9 _-]+)$",
    ]
    normalized = prompt.strip().lower()
    for pattern in patterns:
        match = re.search(pattern, normalized)
        if match:
            return match.group(1).strip()
    return None


def extract_option_hints(prompt: str, transform: TransformInfo | None) -> dict[str, Any]:
    if not transform:
        return {}

    options: dict[str, Any] = {}
    normalized = prompt.lower()
    for option in transform.configurable_options:
        id_pattern = option.id.replace("_", "[ _-]?")
        value_match = re.search(rf"\b{id_pattern}\s+([^\s,]+)", normalized)
        if value_match:
            options[option.id] = coerce_option_value(value_match.group(1))
            continue

        label_tokens = re.findall(r"[a-z0-9]+", option.label.lower())
        if label_tokens:
            label_pattern = r"[ _-]?".join(label_tokens)
            value_match = re.search(rf"\b{label_pattern}\s+([^\s,]+)", normalized)
            if value_match:
                options[option.id] = coerce_option_value(value_match.group(1))
                continue

        if option.type == "boolean":
            if re.search(rf"\b(?:with|enable)\s+{id_pattern}\b", normalized):
                options[option.id] = True
            if re.search(rf"\b(?:without|disable|no)\s+{id_pattern}\b", normalized):
                options[option.id] = False

    generic_number = re.search(r"\bshift\s+(-?\d+)\b", normalized)
    if generic_number and any(option.id == "shift" for option in transform.configurable_options):
        options["shift"] = int(generic_number.group(1))

    return options


def split_steps(prompt: str) -> list[str]:
    return [segment.strip() for segment in re.split(r"\bthen\b|&&|->", prompt) if segment.strip()]


def plan_prompt(prompt: str) -> list[AgentStep]:
    steps: list[AgentStep] = []
    segments = split_steps(prompt)

    for index, segment in enumerate(segments):
        lowered = segment.lower()
        text = extract_text(segment)

        if any(token in lowered for token in ["list", "show transforms", "available transforms", "what can you do"]):
            steps.append(AgentStep(kind="list", explanation="List available transforms"))
            continue

        if any(token in lowered for token in ["inspect", "details", "about"]) and not any(
            token in lowered for token in ["decode", "encode", "transform", "convert"]
        ):
            transform_query = extract_transform_query(segment) or segment
            transform = find_transform(transform_query)
            steps.append(
                AgentStep(
                    kind="inspect",
                    transform_key=transform.key if transform else None,
                    explanation=f"Inspect transform derived from '{transform_query}'",
                )
            )
            continue

        action = None
        if any(token in lowered for token in ["decode", "decrypt", "reverse", "undo"]):
            action = "decode"
        elif any(token in lowered for token in ["preview"]):
            action = "preview"
        elif any(token in lowered for token in ["encode", "transform", "convert", "make"]):
            action = "encode"

        transform_query = extract_transform_query(segment)
        transform = find_transform(transform_query) if transform_query else None

        if action == "decode" and transform is None and "from " not in lowered and "using " not in lowered:
            steps.append(AgentStep(kind="auto-decode", text=text or segment.strip(), explanation="Use universal decoder"))
            continue

        if action and transform:
            steps.append(
                AgentStep(
                    kind="run",
                    transform_key=transform.key,
                    action=action,
                    text=text,
                    options=extract_option_hints(segment, transform),
                    explanation=f"{action} with {transform.key}",
                )
            )
            continue

        if index == 0 and text and transform is None and action == "decode":
            steps.append(AgentStep(kind="auto-decode", text=text, explanation="Use universal decoder"))
            continue

        raise ValueError(f"Could not resolve request segment: {segment}")

    return steps


def execute_plan(prompt: str) -> dict[str, Any]:
    steps = plan_prompt(prompt)
    current_text: str | None = None
    outputs: list[dict[str, Any]] = []

    for step in steps:
        if step.kind == "list":
            transforms = list_transforms()
            outputs.append(
                {
                    "kind": "list",
                    "count": len(transforms),
                    "transforms": [transform.key for transform in transforms[:25]],
                    "explanation": step.explanation,
                }
            )
            continue

        if step.kind == "inspect":
            if not step.transform_key:
                raise ValueError("Could not identify transform to inspect")
            transform = inspect_transform(step.transform_key)
            outputs.append(
                {
                    "kind": "inspect",
                    "transform": {
                        "key": transform.key,
                        "name": transform.name,
                        "category": transform.category,
                        "can_decode": transform.can_decode,
                        "options": [asdict(option) for option in transform.configurable_options],
                    },
                    "explanation": step.explanation,
                }
            )
            continue

        if step.kind == "auto-decode":
            source_text = step.text or current_text
            if not source_text:
                raise ValueError("No text available for auto-decode")
            result = auto_decode(source_text)
            outputs.append({"kind": "auto-decode", "result": result, "explanation": step.explanation})
            current_text = result["text"] if result else None
            continue

        if step.kind == "run":
            source_text = step.text if step.text is not None else current_text
            if source_text is None:
                raise ValueError(f"No text available for {step.action}")
            result = run_transform(step.action or "encode", step.transform_key or "", source_text, step.options)
            outputs.append(
                {
                    "kind": "run",
                    "action": result.action,
                    "transform": result.transform_key,
                    "transform_name": result.transform_name,
                    "options": result.options,
                    "output": result.output,
                    "explanation": step.explanation,
                }
            )
            current_text = result.output
            continue

    return {
        "input": prompt,
        "steps": [asdict(step) for step in steps],
        "outputs": outputs,
        "final_output": current_text,
    }

