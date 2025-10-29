# Taxi Tracker Pro - Complete Setup Guide

This guide will walk you through setting up and running the Taxi Tracker Pro application on your development machine.

## Prerequisites

### 1. Install Flutter

**Windows:**
1. Download Flutter SDK from https://docs.flutter.dev/get-started/install/windows
2. Extract the zip file to `C:\src\flutter`
3. Add Flutter to your PATH:
   - Search for "Environment Variables" in Windows
   - Add `C:\src\flutter\bin` to the Path variable
4. Open a new terminal and run: `flutter doctor`

**macOS:**
1. Download Flutter SDK from https://docs.flutter.dev/get-started/install/macos
2. Extract and add to PATH in `~/.zshrc` or `~/.bash_profile`:
   ```bash
   export PATH="$PATH:`pwd`/flutter/bin"
   ```
3. Run: `flutter doctor`

### 2. Install Development Tools

**For Android Development:**
- Install Android Studio from https://developer.android.com/studio
- Open Android Studio → Tools → SDK Manager
- Install Android SDK (API level 21 or higher)
- Install Android SDK Command-line Tools
- Accept Android licenses: `flutter doctor --android-licenses`

**For iOS Development (macOS only):**
- Install Xcode from the Mac App Store
- Open Xcode → Preferences → Locations → Command Line Tools
- Install CocoaPods: `sudo gem install cocoapods`

### 3. Verify Flutter Installation

Run the following command and fix any issues:
```bash
flutter doctor -v
```

You should see checkmarks (✓) for:
- Flutter
- Android toolchain
- Xcode (macOS only)
- VS Code or Android Studio

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Enter project name: `taxi-tracker-pro` (or your preferred name)
4. Disable Google Analytics (optional) or link to Analytics account
5. Click **"Create project"**

### Step 2: Enable Firestore Database

1. In your Firebase project, click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Choose **"Start in test mode"** for development
4. Select your closest region
5. Click **"Enable"**

**Important:** For production, update Firestore rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 3: Register Your App with Firebase

#### For Android:

1. In Firebase Console, click the Android icon (⚙️ Settings → Project settings)
2. Click **"Add app"** → Android icon
3. Enter package name: `com.example.taxi_tracker_pro`
4. App nickname: `Taxi Tracker Pro`
5. Click **"Register app"**
6. Download `google-services.json`
7. Place the file in: `android/app/google-services.json`

#### For iOS (if building for iOS):

1. In Firebase Console, click **"Add app"** → iOS icon
2. Enter iOS bundle ID: `com.example.taxiTrackerPro`
3. App nickname: `Taxi Tracker Pro`
4. Click **"Register app"**
5. Download `GoogleService-Info.plist`
6. Place the file in: `ios/Runner/GoogleService-Info.plist`

### Step 4: Configure Firebase in Your App

#### Option A: Automatic (Recommended)

1. Install FlutterFire CLI:
   ```bash
   dart pub global activate flutterfire_cli
   ```

2. Add to PATH (if not already):
   - Windows: Add `%USERPROFILE%\AppData\Local\Pub\Cache\bin` to PATH
   - macOS/Linux: Add `export PATH="$PATH":"$HOME/.pub-cache/bin"` to your shell profile

3. Run FlutterFire configure:
   ```bash
   flutterfire configure
   ```

4. Select your Firebase project
5. Choose platforms (Android, iOS, etc.)
6. This will automatically update `lib/firebase_options.dart`

#### Option B: Manual

If you prefer manual setup or FlutterFire CLI doesn't work:

1. Open `lib/firebase_options.dart`
2. Replace the placeholder values with your actual Firebase configuration:
   - Get these values from Firebase Console → Project Settings → Your apps
   - Copy the configuration values for each platform

Example for Android:
```dart
static const FirebaseOptions android = FirebaseOptions(
  apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  appId: '1:123456789:android:abcdefghijk',
  messagingSenderId: '123456789',
  projectId: 'taxi-tracker-pro',
  storageBucket: 'taxi-tracker-pro.appspot.com',
);
```

## Project Setup

### 1. Navigate to Project Directory

```bash
cd "C:\Users\tebohom\Documents\Taxi Tracker"
```

### 2. Install Dependencies

```bash
flutter pub get
```

This will download all required packages listed in `pubspec.yaml`.

### 3. Verify Installation

Check for any issues:
```bash
flutter doctor
```

### 4. Check Connected Devices

```bash
flutter devices
```

You should see:
- Android emulator (if running)
- Physical device (if connected via USB with USB debugging enabled)
- Chrome (for web development)

## Running the App

### On Android Emulator

1. **Start Android Emulator:**
   - Open Android Studio
   - Click **"Device Manager"** (phone icon)
   - Click ▶️ on an existing device or create a new one

2. **Run the app:**
   ```bash
   flutter run
   ```

### On Physical Android Device

1. **Enable Developer Options:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back → Developer Options → Enable "USB Debugging"

2. **Connect device via USB**

3. **Verify connection:**
   ```bash
   flutter devices
   ```

4. **Run the app:**
   ```bash
   flutter run
   ```

### On iOS Device/Simulator (macOS only)

1. **Open iOS Simulator:**
   ```bash
   open -a Simulator
   ```

2. **Run the app:**
   ```bash
   flutter run -d ios
   ```

## Building the App

### Android APK (for testing)

```bash
flutter build apk --release
```

The APK will be at: `build/app/outputs/flutter-apk/app-release.apk`

### Android App Bundle (for Google Play Store)

```bash
flutter build appbundle --release
```

The bundle will be at: `build/app/outputs/bundle/release/app-release.aab`

### iOS (macOS only)

```bash
flutter build ios --release
```

Then open `ios/Runner.xcworkspace` in Xcode to archive and submit.

## Troubleshooting

### Issue: "Error: No Firebase App has been created"

**Solution:**
1. Ensure you've run `flutterfire configure`
2. Check that `google-services.json` is in `android/app/`
3. Verify `lib/firebase_options.dart` has correct values
4. Clean and rebuild:
   ```bash
   flutter clean
   flutter pub get
   flutter run
   ```

### Issue: "Gradle build failed"

**Solution:**
1. Update Android SDK tools in Android Studio
2. Accept licenses:
   ```bash
   flutter doctor --android-licenses
   ```
3. Check `android/build.gradle` and `android/app/build.gradle` are correctly configured

### Issue: "Pod install failed" (iOS)

**Solution:**
```bash
cd ios
pod deintegrate
pod install
cd ..
flutter run
```

### Issue: "Package does not exist" errors

**Solution:**
```bash
flutter clean
flutter pub get
flutter pub upgrade
flutter run
```

### Issue: Dependencies conflict

**Solution:**
```bash
flutter pub upgrade --major-versions
```

## Testing the App

### 1. Add Your First Driver

1. Open the app
2. Go to **Drivers** tab
3. Tap **"Add Driver"**
4. Enter:
   - Name: John Doe
   - Taxi Number: ABC123GP
   - Mileage: 5000
5. Tap **"Add"**

### 2. Add a Daily Entry

1. Go to **Daily Entry** tab
2. Select "John Doe - ABC123GP"
3. Enter:
   - Amount Made: 1500
   - Fuel Cost: 500
   - Fuel Type: Petrol
4. Tap **"Add Entry"**

### 3. View Dashboard

1. Go to **Dashboard** tab
2. You should see:
   - 1 Active Driver
   - This week's earnings: R1500
   - Fuel costs: R500
   - Net profit: R1000

### 4. Generate Report

1. Go to **Reports** tab
2. View the weekly summary
3. Tap **"Export Report"** → Choose PDF or Excel

## Next Steps

### Customize the App

1. **Change App Name:**
   - Edit `android/app/src/main/AndroidManifest.xml`
   - Change `android:label`

2. **Change App Icon:**
   - Use flutter_launcher_icons package
   - Or manually replace icons in:
     - `android/app/src/main/res/mipmap-*/ic_launcher.png`
     - `ios/Runner/Assets.xcassets/AppIcon.appiconset/`

3. **Change Colors:**
   - Edit `lib/main.dart` → `ThemeData`

### Production Deployment

#### Android:
1. Create a keystore for signing
2. Configure signing in `android/app/build.gradle`
3. Build release: `flutter build appbundle`
4. Upload to Google Play Console

#### iOS:
1. Set up App Store Connect
2. Configure signing in Xcode
3. Build: `flutter build ios --release`
4. Archive and upload via Xcode

### Enable Cloud Backup

Update Firestore rules to require authentication:
1. Set up Firebase Authentication (Email/Password or Google Sign-In)
2. Update Firestore security rules
3. Implement authentication in the app

## Support Resources

- **Flutter Documentation**: https://docs.flutter.dev
- **Firebase Documentation**: https://firebase.google.com/docs
- **Stack Overflow**: Tag questions with `flutter` and `firebase`
- **FlutterFire**: https://firebase.flutter.dev

## Common Commands Reference

```bash
# Check Flutter installation
flutter doctor

# Get dependencies
flutter pub get

# Run app
flutter run

# Run with specific device
flutter run -d <device-id>

# Build release APK
flutter build apk --release

# Build release App Bundle
flutter build appbundle --release

# Clean build files
flutter clean

# Update dependencies
flutter pub upgrade

# Analyze code
flutter analyze

# Format code
flutter format .

# Run tests
flutter test
```

## Development Tips

1. **Hot Reload**: Press `r` in the terminal while app is running to hot reload changes
2. **Hot Restart**: Press `R` to fully restart the app
3. **Enable DevTools**: Run `flutter pub global activate devtools` then `flutter pub global run devtools`
4. **View logs**: Use `flutter logs` or Android Studio/Xcode logcat

---

**You're all set! Happy coding!**

If you encounter any issues not covered here, check the README.md file or create an issue in the project repository.
