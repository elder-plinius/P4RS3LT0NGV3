from __future__ import annotations

import json
import subprocess
import sys
from functools import lru_cache
from pathlib import Path
from typing import Any

from .models import TransformInfo, TransformOption, TransformResult


class BridgeError(RuntimeError):
    """Raised when the Node bridge fails."""


PROJECT_ROOT = Path(__file__).resolve().parent.parent
BRIDGE_PATH = PROJECT_ROOT / "scripts" / "cli_bridge.js"


def _run_bridge(payload: dict[str, Any]) -> dict[str, Any]:
    process = subprocess.run(
        ["node", str(BRIDGE_PATH)],
        input=json.dumps(payload),
        text=True,
        capture_output=True,
        cwd=PROJECT_ROOT,
        check=False,
    )
    if process.returncode != 0:
        message = process.stderr.strip() or process.stdout.strip() or "Node bridge failed"
        try:
            parsed = json.loads(process.stdout)
            message = parsed.get("error", message)
        except json.JSONDecodeError:
            pass
        raise BridgeError(message)

    lines = [line for line in process.stdout.splitlines() if line.strip()]
    if not lines:
        raise BridgeError("Node bridge returned no output")
    try:
        data = json.loads(lines[-1])
    except json.JSONDecodeError as exc:
        raise BridgeError(f"Node bridge returned invalid JSON: {lines[-1]}") from exc
    if not data.get("ok"):
        raise BridgeError(data.get("error", "Unknown bridge error"))
    return data


@lru_cache(maxsize=1)
def list_transforms() -> list[TransformInfo]:
    data = _run_bridge({"command": "list"})
    transforms = []
    for item in data["transforms"]:
        transforms.append(
            TransformInfo(
                key=item["key"],
                name=item["name"],
                category=item["category"],
                priority=item["priority"],
                can_decode=item["canDecode"],
                description=item.get("description", ""),
                input_kind=item.get("inputKind", "textarea"),
                configurable_options=[
                    TransformOption(
                        id=opt["id"],
                        label=opt["label"],
                        type=opt["type"],
                        default=opt.get("default"),
                        min=opt.get("min"),
                        max=opt.get("max"),
                        step=opt.get("step"),
                        options=opt.get("options"),
                    )
                    for opt in item.get("configurableOptions", [])
                ],
            )
        )
    return transforms


@lru_cache(maxsize=256)
def inspect_transform(transform_key: str) -> TransformInfo:
    data = _run_bridge({"command": "inspect", "transform": transform_key})
    item = data["transform"]
    return TransformInfo(
        key=item["key"],
        name=item["name"],
        category=item["category"],
        priority=item["priority"],
        can_decode=item["canDecode"],
        description=item.get("description", ""),
        input_kind=item.get("inputKind", "textarea"),
        configurable_options=[
            TransformOption(
                id=opt["id"],
                label=opt["label"],
                type=opt["type"],
                default=opt.get("default"),
                min=opt.get("min"),
                max=opt.get("max"),
                step=opt.get("step"),
                options=opt.get("options"),
            )
            for opt in item.get("configurableOptions", [])
        ],
    )


def run_transform(action: str, transform_key: str, text: str, options: dict[str, Any] | None = None) -> TransformResult:
    data = _run_bridge(
        {
            "command": "run",
            "action": action,
            "transform": transform_key,
            "text": text,
            "options": options or {},
        }
    )
    return TransformResult(
        action=data["action"],
        transform_key=data["transform"],
        transform_name=data["name"],
        options=data["options"],
        output=data["output"],
    )


def auto_decode(text: str) -> dict[str, Any] | None:
    data = _run_bridge({"command": "auto-decode", "text": text})
    return data["result"]


def ensure_node_available() -> None:
    process = subprocess.run(["node", "--version"], capture_output=True, text=True, check=False)
    if process.returncode != 0:
        raise BridgeError("Node.js is required to run the P4RS3LT0NGV3 CLI")


def main_check() -> int:
    try:
        ensure_node_available()
    except BridgeError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    return 0

