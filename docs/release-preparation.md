# Step 20 - Release Preparation

## Goal

Prepare the app for external use so it is shareable and installable.

## Acceptance Criteria

- App metadata is finalized (name, icon, version).
- README and installation instructions are up to date.
- Screenshots exist for release publishing.
- Packaged builds are produced for macOS, Windows, and Ubuntu.
- Release notes are ready.

## 1) App Name

- Product name: `Organize It`
- Config locations:
  - `src-tauri/tauri.conf.json` -> `productName`
  - `src-tauri/tauri.conf.json` -> window title
  - `package.json` -> package name/description

## 2) Icon

Required icon files (used by bundle config):

- `src-tauri/icons/32x32.png`
- `src-tauri/icons/128x128.png`
- `src-tauri/icons/128x128@2x.png`
- `src-tauri/icons/icon.icns`
- `src-tauri/icons/icon.ico`

Generate from a single high-resolution source image:

```bash
npx tauri icon path/to/source-icon.png
```

Notes:

- Use a square PNG source (recommended 1024x1024).
- Keep style readable at small sizes.

## 3) Versioning

Version is aligned to `1.0.0` in:

- `package.json`
- `src-tauri/tauri.conf.json`

Version bump process:

1. Update both files to the new version.
2. Create/update `docs/release-notes-v<version>.md`.
3. Build and validate installers for all platforms.

## 4) README

README must include:

- App overview and key features
- Prerequisites
- Local run instructions
- Build instructions
- Platform-specific install instructions
- Release asset checklist

## 5) Screenshots

Store release screenshots in `docs/screenshots/`:

- `organizer-main.png`
- `scan-preview.png`
- `organize-success.png`
- `settings.png`

Capture guidance:

- Use consistent window size.
- Avoid personal/sensitive data in folder paths.
- Capture both light/dark states only if relevant to product behavior.

## 6) Packaged Builds (3 OS)

Run per OS environment:

```bash
npm install
npm run tauri:build
```

Expected output root:

- `src-tauri/target/release/bundle/`

Expected artifact types:

- macOS: `.dmg` and/or `.app.tar.gz`
- Windows: `.msi`
- Ubuntu: `.deb` and/or `.AppImage`

## 7) Release Notes

Use `docs/release-notes-v1.0.0.md` as the release notes source.

Include:

- Highlights
- Improvements/Fixes
- Known issues
- Install/upgrade notes

## Release Signoff

- [ ] App name finalized
- [ ] Icon assets complete
- [ ] Version synced across config files
- [ ] README updated
- [ ] Install instructions verified
- [ ] Screenshots added
- [ ] macOS package generated
- [ ] Windows package generated
- [ ] Ubuntu package generated
- [ ] Release notes complete
- [ ] App is shareable and installable
