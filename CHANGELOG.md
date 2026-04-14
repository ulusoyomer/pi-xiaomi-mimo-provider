# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-14

### Added

- Reasoning on/off control via `compat.supportsReasoningEffort` for mimo-v2-pro and mimo-v2-omni
- `reasoningEffortMap` mapping: `minimal`→none (reasoning off), `low`→low, `medium`→medium, `high`→high
- Users can toggle reasoning with `/thinking minimal` (off) or `/thinking high` (max)
- 3 new tests for reasoning compat settings

## [1.0.5] - 2026-04-14

### Fixed

- Updated API key URL to `https://platform.xiaomimimo.com/#/console/plan-manage` in README and source comments

## [1.0.3] - 2026-04-14

### Fixed

- Updated remaining old package name references (`pi-mimo-provider` → `pi-xiaomi-mimo-provider`) in README

## [1.0.2] - 2026-04-14

### Added

- CHANGELOG.md for tracking project history

## [1.0.1] - 2026-04-14

### Fixed

- Context window updated from 128K to 1M tokens per official Xiaomi docs
- Added official Xiaomi pricing: $1/$3 per MTok (up to 256K), $2/$6 (256K–1M)
- Package renamed from `pi-mimo-provider` to `pi-xiaomi-mimo-provider`

### Added

- Unit tests (11 tests covering provider registration, model configs, OAuth flow)
- Vitest dev tooling with `test`, `test:watch`, `typecheck` scripts
- `.gitignore` updated to exclude `docs/`

## [1.0.0] - 2026-04-14

### Added

- Xiaomi Mimo provider extension for pi coding agent
- `mimo-v2-pro` model — reasoning, text & image input
- `mimo-v2-omni` model — reasoning, text & image input
- `mimo-v2-tts` model — text input
- OAuth login flow via `/login xiaomi-mimo`
- OpenAI-compatible API support (`https://token-plan-sgp.xiaomimimo.com/v1`)
