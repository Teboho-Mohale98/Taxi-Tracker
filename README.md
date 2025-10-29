# Taxi Tracker Pro

A comprehensive Flutter mobile application for managing taxi fleet operations, tracking driver earnings, expenses, and maintenance schedules.

## Features

### 1. Driver Management
- Add, edit, and remove drivers
- Assign each driver to a specific taxi with registration number
- Track mileage for each vehicle
- Automatic service reminders at 10,000 km intervals

### 2. Daily Income & Expense Tracking
- Quick entry form for daily driver returns
- Record amount earned, fuel costs, and fuel type (Petrol/Diesel)
- Automatic calculation of daily net profit
- View recent entries with detailed breakdowns

### 3. Weekly Reports & Analytics
- Comprehensive weekly summaries
- Driver-wise performance breakdown
- Visual charts showing daily performance trends
- Export reports to PDF or Excel format
- Navigate between different weeks to view historical data

### 4. Rank Fee Management
- Record weekly rank fees
- Option to apply or skip fees per week
- Automatic inclusion in profit calculations

### 5. Maintenance Tracking
- Record maintenance expenses by category:
  - Brake Pads
  - Rear Wheel Liners
  - Brake Fluid
  - Oil Changes
  - Tire Replacements
  - Engine Service
  - Custom items
- Track costs and dates
- View maintenance history by month

### 6. Dashboard Overview
- Real-time summary of current week performance
- Quick stats: Active drivers, vehicles needing service
- Color-coded profit indicators
- Service reminder notifications
- Weekly earnings vs. expenses visualization

### 7. Service Reminders
- Automatic notifications when vehicles reach 10,000 km
- Visual indicators on driver list
- Quick reset after service completion

## Technology Stack

- **Framework**: Flutter 3.0+
- **State Management**: Provider
- **Database**: Cloud Firestore (Firebase)
- **Charts**: fl_chart
- **PDF Export**: pdf, printing packages
- **Excel Export**: excel package
- **Notifications**: flutter_local_notifications

## Getting Started

### Prerequisites

1. **Flutter SDK**: Install Flutter (3.0 or higher)
   - [Flutter Installation Guide](https://docs.flutter.dev/get-started/install)

2. **Firebase Project**: Create a Firebase project
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Cloud Firestore

### Installation Steps

#### 1. Install Flutter Dependencies

```bash
flutter pub get
```

#### 2. Configure Firebase

**Option A: Using FlutterFire CLI (Recommended)**

```bash
# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Firebase for your project
flutterfire configure --project=your-firebase-project-id
```

This will automatically generate the correct `firebase_options.dart` file with your project credentials.

**Option B: Manual Configuration**

1. Create a Firebase project at https://console.firebase.google.com/
2. Add Android and/or iOS apps to your Firebase project
3. Download the configuration files:
   - For Android: `google-services.json` → Place in `android/app/`
   - For iOS: `GoogleService-Info.plist` → Place in `ios/Runner/`
4. Update `lib/firebase_options.dart` with your Firebase configuration values

#### 3. Set Up Firebase Firestore

1. Go to your Firebase Console
2. Navigate to Firestore Database
3. Create a database (start in test mode for development)
4. The app will automatically create the necessary collections

#### 4. Platform-Specific Setup

**Android**

Update `android/app/build.gradle`:
```gradle
android {
    compileSdkVersion 34

    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 34
    }
}
```

**iOS**

Update `ios/Podfile`:
```ruby
platform :ios, '12.0'
```

#### 5. Run the App

```bash
# For Android
flutter run

# For iOS
flutter run -d ios

# For specific device
flutter devices
flutter run -d <device-id>
```

## Project Structure

```
lib/
├── main.dart                          # App entry point
├── firebase_options.dart              # Firebase configuration
├── models/                            # Data models
│   ├── driver.dart
│   ├── daily_entry.dart
│   ├── maintenance.dart
│   └── weekly_fee.dart
├── providers/                         # State management
│   ├── driver_provider.dart
│   ├── daily_entry_provider.dart
│   ├── maintenance_provider.dart
│   └── weekly_fee_provider.dart
├── screens/                           # UI screens
│   ├── splash_screen.dart
│   ├── home_screen.dart
│   ├── dashboard_screen.dart
│   ├── drivers_screen.dart
│   ├── daily_entries_screen.dart
│   ├── maintenance_screen.dart
│   └── reports_screen.dart
└── services/                          # Business logic
    ├── notification_service.dart
    └── export_service.dart
```

## Firestore Database Structure

### Collections

**drivers**
```json
{
  "id": "string",
  "name": "string",
  "taxiNumber": "string",
  "totalKm": "number",
  "lastServiceKm": "number",
  "createdAt": "timestamp",
  "isActive": "boolean"
}
```

**daily_entries**
```json
{
  "id": "string",
  "driverId": "string",
  "driverName": "string",
  "taxiNumber": "string",
  "date": "timestamp",
  "amountMade": "number",
  "fuelCost": "number",
  "fuelType": "string",
  "notes": "string",
  "createdAt": "timestamp"
}
```

**maintenance**
```json
{
  "id": "string",
  "taxiId": "string",
  "taxiNumber": "string",
  "type": "string",
  "itemName": "string",
  "cost": "number",
  "date": "timestamp",
  "notes": "string",
  "createdAt": "timestamp"
}
```

**weekly_fees**
```json
{
  "id": "string",
  "weekStart": "timestamp",
  "weekEnd": "timestamp",
  "rankFee": "number",
  "notes": "string",
  "isApplied": "boolean",
  "createdAt": "timestamp"
}
```

## Usage Guide

### Adding a Driver

1. Navigate to the **Drivers** tab
2. Tap the **"Add Driver"** button
3. Fill in driver name, taxi number, and current mileage
4. Tap **"Add"**

### Recording Daily Entries

1. Navigate to the **Daily Entry** tab
2. Select the driver from the dropdown
3. Choose the date (defaults to today)
4. Enter amount made and fuel cost
5. Select fuel type (Petrol/Diesel)
6. Add optional notes
7. Tap **"Add Entry"**

### Viewing Weekly Reports

1. Navigate to the **Reports** tab
2. Use the left/right arrows to navigate between weeks
3. Tap **"Today"** to return to the current week
4. View overall summary and driver-specific breakdowns
5. Add/edit weekly rank fee if applicable
6. Tap **"Export Report"** to save as PDF or Excel

### Adding Maintenance Records

1. Navigate to the **Maintenance** tab
2. Tap the **"Add Maintenance"** button
3. Select the taxi
4. Choose maintenance type
5. Enter item name and cost
6. Select the date
7. Add optional notes
8. Tap **"Add"**

### Managing Service Reminders

1. When a vehicle reaches 10,000 km, you'll see:
   - A notification
   - Orange indicator on the driver card
   - Alert on the dashboard
2. After servicing, tap the three dots on the driver card
3. Select **"Mark Serviced"**
4. The mileage counter resets

## Customization

### Color Scheme

The app uses a yellow and dark grey theme. To customize:

Edit `lib/main.dart`:
```dart
primaryColor: const Color(0xFFFFD700), // Yellow - Change this
scaffoldBackgroundColor: const Color(0xFFF5F5F5),
colorScheme: ColorScheme.fromSeed(
  seedColor: const Color(0xFFFFD700), // Change this
  primary: const Color(0xFFFFD700),
  secondary: const Color(0xFF2C2C2C), // Dark grey - Change this
),
```

### Service Interval

Default is 10,000 km. To change:

Edit `lib/models/driver.dart`:
```dart
bool get isServiceDue {
  return (totalKm - lastServiceKm) >= 10000; // Change this value
}

double get kmUntilService {
  final remaining = 10000 - (totalKm - lastServiceKm); // Change this value
  return remaining > 0 ? remaining : 0;
}
```

## Troubleshooting

### Firebase Configuration Issues

**Error**: `[core/no-app] No Firebase App '[DEFAULT]' has been created`

**Solution**:
1. Ensure `firebase_options.dart` has correct credentials
2. Run `flutterfire configure` again
3. Verify `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) are in the correct locations

### Build Errors

**Error**: `Execution failed for task ':app:processDebugGoogleServices'`

**Solution**:
1. Make sure `google-services.json` is in `android/app/`
2. Clean and rebuild: `flutter clean && flutter pub get && flutter run`

### Permission Issues

**Android Notifications Not Working**

**Solution**:
1. The app requests notification permissions automatically
2. For Android 13+, ensure you've granted notification permission in Settings

## Future Enhancements

- [ ] Multi-user authentication with role-based access
- [ ] Cloud backup and restore
- [ ] GPS-based automatic mileage tracking
- [ ] Photo upload for fuel slips and receipts
- [ ] Advanced analytics and insights
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline mode with sync

## Support

For issues or questions:
- Create an issue in the project repository
- Check the Flutter documentation: https://docs.flutter.dev
- Firebase documentation: https://firebase.google.com/docs

## License

This project is provided as-is for personal or commercial use.

---

**Built with Flutter & Firebase**

Made for taxi fleet owners to simplify their daily operations.
