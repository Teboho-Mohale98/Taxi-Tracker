# Quick Start Guide - Taxi Tracker Pro

Get your app running in 5 minutes!

## 🚀 Fastest Setup

### 1. Install Flutter (5 minutes)

**Windows:**
```bash
# Download from https://docs.flutter.dev/get-started/install/windows
# Extract to C:\src\flutter
# Add to PATH: C:\src\flutter\bin
```

**macOS:**
```bash
# Download from https://docs.flutter.dev/get-started/install/macos
# Extract and add to PATH
```

Verify:
```bash
flutter doctor
```

### 2. Set Up Firebase (3 minutes)

1. Go to https://console.firebase.google.com/
2. Create new project: "taxi-tracker-pro"
3. Enable Firestore (test mode)
4. Add Android app:
   - Package: `com.example.taxi_tracker_pro`
   - Download `google-services.json`
   - Place in `android/app/`

### 3. Configure Project (2 minutes)

```bash
cd "C:\Users\tebohom\Documents\Taxi Tracker"

# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Firebase
flutterfire configure

# Install dependencies
flutter pub get
```

### 4. Run the App! (1 minute)

```bash
# Connect Android device or start emulator
flutter run
```

That's it! 🎉

---

## 📱 Essential Commands

```bash
# Run app
flutter run

# Hot reload (while running)
Press 'r'

# Hot restart (while running)
Press 'R'

# Clean build
flutter clean && flutter pub get

# Build release APK
flutter build apk --release
```

---

## ⚡ Quick Feature Guide

### Add a Driver
1. Tap **Drivers** tab
2. Tap **+ Add Driver**
3. Fill: Name, Taxi Number, Mileage
4. Tap **Add**

### Record Daily Earnings
1. Tap **Daily Entry** tab
2. Select driver
3. Enter: Amount Made, Fuel Cost
4. Tap **Add Entry**

### View Reports
1. Tap **Reports** tab
2. See weekly summary
3. Tap **Export** for PDF/Excel

### Track Maintenance
1. Tap **Maintenance** tab
2. Tap **+ Add Maintenance**
3. Select taxi, type, cost
4. Tap **Add**

---

## 🔧 Troubleshooting

**App won't run?**
```bash
flutter clean
flutter pub get
flutter run
```

**Firebase error?**
```bash
flutterfire configure
```

**Build errors?**
```bash
flutter doctor
# Fix any issues shown
```

**Need help?**
- Check README.md for full documentation
- Check SETUP_GUIDE.md for detailed setup
- Run `flutter doctor -v` for diagnostics

---

## 📊 Sample Data

Test the app with this data:

**Driver 1:**
- Name: John Smith
- Taxi: ABC123GP
- Mileage: 5000 km

**Driver 2:**
- Name: Sarah Johnson
- Taxi: XYZ789GP
- Mileage: 12000 km (will trigger service reminder!)

**Daily Entry:**
- Driver: John Smith
- Amount: R 1500
- Fuel: R 450
- Type: Petrol

**Maintenance:**
- Taxi: John Smith - ABC123GP
- Type: Brake Pads
- Item: Front Brake Pads
- Cost: R 800

---

## 🎨 Customization Quick Tips

**Change app name:**
Edit `android/app/src/main/AndroidManifest.xml`:
```xml
android:label="Your App Name"
```

**Change colors:**
Edit `lib/main.dart` → Find `Color(0xFFFFD700)` (yellow) and `Color(0xFF2C2C2C)` (dark grey)

**Change service interval:**
Edit `lib/models/driver.dart` → Change `10000` to your preferred km

---

## 📱 Supported Features

✅ Driver Management
✅ Daily Earnings Tracking
✅ Fuel Cost Recording
✅ Weekly Reports
✅ Maintenance Tracking
✅ Service Reminders (10,000 km)
✅ PDF Export
✅ Excel Export
✅ Dashboard Analytics
✅ Rank Fee Management

---

## 🚀 Ready to Deploy?

### For Testing (APK):
```bash
flutter build apk --release
# File: build/app/outputs/flutter-apk/app-release.apk
```

### For Google Play (Bundle):
```bash
flutter build appbundle --release
# File: build/app/outputs/bundle/release/app-release.aab
```

---

**Need more details?** Check the full documentation in README.md

**Having issues?** See SETUP_GUIDE.md for comprehensive troubleshooting

**Happy fleet managing! 🚖💼**
