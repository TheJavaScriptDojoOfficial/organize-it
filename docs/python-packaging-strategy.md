# Python Packaging Strategy (Tauri)

## Decision

For production releases, ship Python logic as a standalone bundled executable per platform, then invoke it from Tauri.

## Why this decision

- Avoids requiring users to pre-install Python, which reduces installation/support friction.
- Produces predictable runtime behavior across machines and OS versions.
- Keeps app startup/invocation model simple (`spawn` one binary, read JSON contract).
- Has lower integration complexity than embedding a full Python runtime into Tauri.

## Options evaluated

### 1) Bundle script, require system Python

Pros:
- Smallest app bundle size.
- Fastest short-term setup.

Cons:
- High support risk from missing Python, wrong versions, PATH issues, and permissions.
- Inconsistent behavior across user environments.
- Not suitable for non-technical users.

Verdict: Not recommended for a serious product.

### 2) Package Python logic as standalone executable

Pros:
- No external Python dependency for end users.
- Repeatable behavior and easier QA matrix.
- Straightforward packaging model for Tauri resources.

Cons:
- Larger binary size than raw scripts.
- Build pipeline must produce per-OS artifacts.

Verdict: Recommended.

### 3) Embed packaged Python runtime

Pros:
- Maximum control over runtime internals.
- Flexible for advanced Python dependency scenarios.

Cons:
- Highest implementation complexity and maintenance burden.
- More moving pieces for code signing and notarization.
- Slower to stabilize before release.

Verdict: Overkill for current scope.

## Release implications (no late surprises)

- Build CI must generate one Python executable per target platform/arch.
- Tauri bundle step should include the executable as a resource.
- Runtime path resolution in app must select the correct executable per OS.
- Contract tests should validate the existing frozen JSON contract in `python/README_contract.md`.
- Smoke tests should run `scan` and `organize` through the packaged executable on each platform.

## Pre-release acceptance gates

- Team signs off this strategy before release branch cut.
- Cross-platform packaged executable build is green in CI.
- End-to-end smoke tests pass using the packaged executable (not local Python).
- Installer/manual QA confirms no system Python is required.
