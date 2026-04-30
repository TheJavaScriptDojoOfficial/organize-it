# Organize It

Organize It is a desktop app that scans a folder and sorts files into category folders so messy directories become clean and predictable.

## Current Release

- Version: `1.0.0`
- Platforms: macOS, Windows, Ubuntu (Linux)

## Features

- Scan a folder and preview category distribution
- Organize files into category folders
- Handle partial failures safely (for example permissions issues)
- Persist user settings between app restarts

## Prerequisites (Development)

- Node.js 20+
- npm 10+
- Rust toolchain (stable)
- Tauri prerequisites:
  - [macOS setup](https://tauri.app/start/prerequisites/#macos)
  - [Windows setup](https://tauri.app/start/prerequisites/#windows)
  - [Linux setup](https://tauri.app/start/prerequisites/#linux)

## Run Locally

```bash
npm install
npm run tauri:dev
```

## Build Installers

```bash
npm install
npm run tauri:build
```

Build artifacts are generated under `src-tauri/target/release/bundle/`.

## Install Instructions

### macOS

1. Download the `.dmg` (or `.app.tar.gz`) artifact.
2. Open and drag `Organize It.app` into `Applications`.
3. If Gatekeeper warns on first run, allow it from System Settings -> Privacy & Security.

### Windows

1. Download the `.msi` installer.
2. Run the installer and complete setup.
3. Launch `Organize It` from Start Menu.

### Ubuntu/Linux

1. Download `.deb` (or `.AppImage`) artifact.
2. For `.deb`: `sudo dpkg -i organize-it_<version>_amd64.deb`
3. For `.AppImage`: `chmod +x Organize-It.AppImage && ./Organize-It.AppImage`

## Release Assets Checklist

Before publishing a release, ensure:

- App metadata/version updated in `package.json` and `src-tauri/tauri.conf.json`
- Icon set exists in `src-tauri/icons/` (`32x32.png`, `128x128.png`, `128x128@2x.png`, `icon.icns`, `icon.ico`)
- Updated screenshots are available in `docs/screenshots/`
- Manual QA checklist is completed (`docs/manual-qa-checklist.md`)
- Release notes are prepared (`docs/release-notes-v1.0.0.md`)

## Screenshots

Release screenshots are tracked in `docs/screenshots/`.

## License

Add your project license details here (for example MIT) before external distribution.
