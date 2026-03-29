from __future__ import annotations

import argparse
import json
import sys
from typing import Any

from .agent import execute_plan, find_transform
from .bridge import BridgeError, auto_decode, ensure_node_available, inspect_transform, list_transforms, run_transform


def parse_option_pairs(pairs: list[str]) -> dict[str, Any]:
    options: dict[str, Any] = {}
    for pair in pairs:
        if "=" not in pair:
            raise ValueError(f"Invalid option '{pair}'. Expected key=value")
        key, value = pair.split("=", 1)
        normalized = value.strip()
        lowered = normalized.lower()
        if lowered in {"true", "false"}:
            coerced: Any = lowered == "true"
        else:
            try:
                coerced = int(normalized)
            except ValueError:
                try:
                    coerced = float(normalized)
                except ValueError:
                    coerced = normalized
        options[key.strip()] = coerced
    return options


def read_text_argument(value: str | None) -> str:
    if value is not None:
        return value
    if not sys.stdin.isatty():
        return sys.stdin.read()
    return ""


def emit(data: Any, as_json: bool) -> None:
    if as_json:
        print(json.dumps(data, indent=2, ensure_ascii=False))
    elif isinstance(data, str):
        print(data)
    else:
        print(json.dumps(data, indent=2, ensure_ascii=False))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="p4rs3lt0ngv3-cli", description="Agent-based CLI for P4RS3LT0NGV3")
    subparsers = parser.add_subparsers(dest="command", required=True)

    list_parser = subparsers.add_parser("list", help="List available transforms")
    list_parser.add_argument("--category")
    list_parser.add_argument("--json", action="store_true")

    inspect_parser = subparsers.add_parser("inspect", help="Inspect a transform")
    inspect_parser.add_argument("transform")
    inspect_parser.add_argument("--json", action="store_true")

    for command_name, action in [("encode", "encode"), ("decode", "decode"), ("preview", "preview")]:
        cmd = subparsers.add_parser(command_name, help=f"{command_name.title()} text with a specific transform")
        cmd.add_argument("--transform", required=True)
        cmd.add_argument("--text")
        cmd.add_argument("--option", action="append", default=[], help="Transform option in key=value form")
        cmd.add_argument("--json", action="store_true")
        cmd.set_defaults(action=action)

    autod = subparsers.add_parser("auto-decode", help="Use the universal decoder")
    autod.add_argument("--text")
    autod.add_argument("--json", action="store_true")

    agent = subparsers.add_parser("agent", help="Resolve a natural-language request")
    agent.add_argument("prompt")
    agent.add_argument("--json", action="store_true")

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        ensure_node_available()

        if args.command == "list":
            transforms = list_transforms()
            if args.category:
                transforms = [transform for transform in transforms if transform.category == args.category]
            if args.json:
                emit(
                    [
                        {
                            "key": transform.key,
                            "name": transform.name,
                            "category": transform.category,
                            "can_decode": transform.can_decode,
                        }
                        for transform in transforms
                    ],
                    True,
                )
            else:
                for transform in transforms:
                    decode_flag = "decode" if transform.can_decode else "encode-only"
                    print(f"{transform.key:24} {transform.category:12} {decode_flag:11} {transform.name}")
            return 0

        if args.command == "inspect":
            transform = find_transform(args.transform)
            if not transform:
                raise BridgeError(f"Unknown transform: {args.transform}")
            meta = inspect_transform(transform.key)
            data = {
                "key": meta.key,
                "name": meta.name,
                "category": meta.category,
                "priority": meta.priority,
                "can_decode": meta.can_decode,
                "input_kind": meta.input_kind,
                "options": [
                    {
                        "id": option.id,
                        "label": option.label,
                        "type": option.type,
                        "default": option.default,
                        "min": option.min,
                        "max": option.max,
                        "step": option.step,
                        "options": option.options,
                    }
                    for option in meta.configurable_options
                ],
            }
            emit(data, args.json)
            return 0

        if args.command in {"encode", "decode", "preview"}:
            transform = find_transform(args.transform)
            if not transform:
                raise BridgeError(f"Unknown transform: {args.transform}")
            text = read_text_argument(args.text)
            options = parse_option_pairs(args.option)
            result = run_transform(args.action, transform.key, text, options)
            if args.json:
                emit(
                    {
                        "action": result.action,
                        "transform": result.transform_key,
                        "transform_name": result.transform_name,
                        "options": result.options,
                        "output": result.output,
                    },
                    True,
                )
            else:
                emit(result.output, False)
            return 0

        if args.command == "auto-decode":
            text = read_text_argument(args.text)
            result = auto_decode(text)
            emit(result or {}, args.json)
            return 0 if result else 1

        if args.command == "agent":
            result = execute_plan(args.prompt)
            emit(result if args.json else (result.get("final_output") or result), args.json)
            return 0

    except (BridgeError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

