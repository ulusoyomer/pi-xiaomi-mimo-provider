# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-14

### Added

- Xiaomi Mimo provider extension for pi coding agent
- `mimo-v2-pro` model — reasoning, text & image input, 1M context window
- `mimo-v2-omni` model — reasoning, text & image input, 1M context window
- `mimo-v2-tts` model — text input, 1M context window
- OAuth login flow via `/login xiaomi-mimo`
- OpenAI-compatible API support (`https://token-plan-sgp.xiaomimimo.com/v1`)
- Official Xiaomi pricing: $1/$3 per MTok (up to 256K), $2/$6 (256K–1M)
- Unit tests (11 tests covering provider registration, model configs, OAuth)
