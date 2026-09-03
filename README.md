# Rungs

A hundred a day, one rung at a time.

An offline-first coaching PWA for push-ups, pull-ups and squats. You start at a
daily total of 100 reps — split across the three by relative strength — and
climb: 100 → 200 → 300, where 300 is 100 of each. Reps are cut into short
windows spread through your day rather than one long session.

React 19 + Vite + TypeScript + Tailwind v4 + Dexie (IndexedDB), installable as
a PWA on desktop/mobile web and packaged as a native Android app via Capacitor.

## Development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build         # production build to dist/ (auto-bumps patch version)
npm run lint
```

## Android (Capacitor)

The `android/` directory is a native Capacitor project that wraps the built
web app (`dist/`) in a WebView shell — same HashRouter-based SPA, same Dexie
IndexedDB storage, no server required. It's checked into the repo (standard
Capacitor practice — it can carry native customizations), but build output,
local SDK paths, and signing secrets are gitignored.

### One-time setup

Needs a JDK compatible with the Android Gradle Plugin (17–21; **not** 26) and
the Android SDK command-line tools:

```bash
brew install openjdk@21 android-commandlinetools
sdkmanager --sdk_root="$(brew --prefix)/share/android-commandlinetools" \
  "platform-tools" "platforms;android-35" "build-tools;35.0.0"
echo "sdk.dir=$(brew --prefix)/share/android-commandlinetools" > android/local.properties
```

Release builds are signed. Generate a keystore once and keep it **outside
git** and backed up somewhere durable — losing it means you can never ship
an update to the same `applicationId` again, only a new listing:

```bash
keytool -genkeypair -v -keystore android/keystore/release.keystore \
  -alias hundred -keyalg RSA -keysize 2048 -validity 10000
cp android/keystore.properties.example android/keystore.properties
# then fill in the real store/key passwords in android/keystore.properties
```

### Building

```bash
export JAVA_HOME=$(brew --prefix openjdk@21)/libexec/openjdk.jdk/Contents/Home
export ANDROID_HOME=$(brew --prefix)/share/android-commandlinetools

npm run build && npx cap sync android
cd android
./gradlew assembleDebug      # unsigned, for sideloading/testing
./gradlew assembleRelease    # signed with keystore.properties, for distribution
```

Output:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

After changing app icons or the web app itself, re-run
`npm run build && npx cap sync android` before rebuilding the APK — Capacitor
copies `dist/` into the native project's assets, it doesn't read it live.
