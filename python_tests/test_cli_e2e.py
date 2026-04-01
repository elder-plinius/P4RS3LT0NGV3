from __future__ import annotations

import json
import subprocess
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent


def run_cli(*args: str, input_text: str | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["uv", "run", "p4rs3lt0ngv3-cli", *args],
        cwd=PROJECT_ROOT,
        input=input_text,
        text=True,
        capture_output=True,
        check=False,
    )


def parse_json_output(process: subprocess.CompletedProcess[str]):
    assert process.returncode == 0, process.stderr
    return json.loads(process.stdout)


def test_list_json_exposes_large_catalog() -> None:
    process = run_cli("list", "--json")
    payload = parse_json_output(process)
    keys = {item["key"] for item in payload}
    assert len(payload) >= 150
    assert "base64" in keys
    assert "caesar" in keys


def test_inspect_includes_transform_options() -> None:
    process = run_cli("inspect", "caesar", "--json")
    payload = parse_json_output(process)
    assert payload["key"] == "caesar"
    assert any(option["id"] == "shift" for option in payload["options"])


def test_encode_and_decode_round_trip() -> None:
    encoded = run_cli("encode", "--transform", "base64", "--text", "Hello World")
    assert encoded.returncode == 0, encoded.stderr
    assert encoded.stdout.strip() == "SGVsbG8gV29ybGQ="

    decoded = run_cli("decode", "--transform", "base64", "--text", encoded.stdout.strip())
    assert decoded.returncode == 0, decoded.stderr
    assert decoded.stdout.strip() == "Hello World"


def test_encode_supports_transform_options() -> None:
    process = run_cli(
        "encode",
        "--transform",
        "binary",
        "--text",
        "Hi",
        "--option",
        "byteSpacing=false",
    )
    assert process.returncode == 0, process.stderr
    assert process.stdout.strip() == "0100100001101001"


def test_auto_decode_uses_universal_decoder() -> None:
    process = run_cli("auto-decode", "--text", "SGVsbG8=", "--json")
    payload = parse_json_output(process)
    assert payload["text"] == "Hello"
    assert payload["method"] == "Base64"


def test_agent_can_route_simple_encode_request() -> None:
    process = run_cli("agent", "encode 'Hello' as base64")
    assert process.returncode == 0, process.stderr
    assert process.stdout.strip() == "SGVsbG8="


def test_agent_can_route_decode_request_with_options() -> None:
    process = run_cli("agent", "decode 'Fyyfhp fy ifbs' from caesar shift 5")
    assert process.returncode == 0, process.stderr
    assert process.stdout.strip() == "Attack at dawn"


def test_agent_can_chain_steps() -> None:
    process = run_cli("agent", "encode 'Hi' as base64 then decode from base64", "--json")
    payload = parse_json_output(process)
    assert payload["final_output"] == "Hi"
    assert len(payload["outputs"]) == 2


def test_slash_command_encodes_text() -> None:
    process = run_cli("/base64", "Hello")
    assert process.returncode == 0, process.stderr
    assert process.stdout.strip() == "SGVsbG8="


def test_slash_command_decodes_text() -> None:
    process = run_cli("/base64", "--decode", "SGVsbG8=")
    assert process.returncode == 0, process.stderr
    assert process.stdout.strip() == "Hello"


def test_slash_command_supports_transform_flags() -> None:
    process = run_cli("/caesar", "--shift", "5", "Attack", "at", "dawn")
    assert process.returncode == 0, process.stderr
    assert process.stdout.strip() == "Fyyfhp fy ifbs"


def test_slash_command_supports_inspect() -> None:
    process = run_cli("/inspect", "caesar", "--json")
    payload = parse_json_output(process)
    assert payload["key"] == "caesar"
