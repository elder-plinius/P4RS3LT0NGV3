from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class TransformOption:
    id: str
    label: str
    type: str
    default: Any = None
    min: float | int | None = None
    max: float | int | None = None
    step: float | int | None = None
    options: list[dict[str, Any]] | None = None


@dataclass(slots=True)
class TransformInfo:
    key: str
    name: str
    category: str
    priority: int
    can_decode: bool
    description: str = ""
    input_kind: str = "textarea"
    configurable_options: list[TransformOption] = field(default_factory=list)

    @property
    def search_tokens(self) -> set[str]:
        tokens = {self.key.lower(), self.name.lower(), self.name.lower().replace(" ", "_")}
        tokens.update(part for part in self.key.lower().split("_") if part)
        tokens.update(part for part in self.name.lower().replace("-", " ").split() if part)
        return tokens


@dataclass(slots=True)
class TransformResult:
    action: str
    transform_key: str
    transform_name: str
    options: dict[str, Any]
    output: str


@dataclass(slots=True)
class AgentStep:
    kind: str
    transform_key: str | None = None
    action: str | None = None
    text: str | None = None
    options: dict[str, Any] = field(default_factory=dict)
    explanation: str = ""

