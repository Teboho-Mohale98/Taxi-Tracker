# Taxi Tracker Pro - App Architecture

## 🏗️ Application Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         TAXI TRACKER PRO                         │
│                     Flutter Mobile Application                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│                          (UI Screens)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Splash     │  │     Home     │  │  Dashboard   │          │
│  │   Screen     │→ │   Screen     │→ │   Screen     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                           │                                      │
│         ┌─────────────────┼─────────────────┐                   │
│         │                 │                 │                   │
│         ↓                 ↓                 ↓                   │
│  ┌──────────┐      ┌──────────┐     ┌──────────┐              │
│  │ Drivers  │      │  Daily   │     │Mainten-  │              │
│  │ Screen   │      │ Entries  │     │ ance     │              │
│  └──────────┘      │ Screen   │     │ Screen   │              │
│                    └──────────┘     └──────────┘              │
│                           │                                      │
│                           ↓                                      │
│                    ┌──────────┐                                 │
│                    │ Reports  │                                 │
│                    │ Screen   │                                 │
│                    └──────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT LAYER                      │
│                    (Provider - ChangeNotifier)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │     Driver     │  │  Daily Entry   │  │  Maintenance   │   │
│  │    Provider    │  │    Provider    │  │    Provider    │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│          │                   │                    │             │
│          │                   │                    │             │
│  ┌────────────────┐          │                    │             │
│  │  Weekly Fee    │          │                    │             │
│  │   Provider     │          │                    │             │
│  └────────────────┘          │                    │             │
│                              │                    │             │
└──────────────────────────────┼────────────────────┼─────────────┘
                               ↕                    ↕
┌─────────────────────────────────────────────────────────────────┐
│                        BUSINESS LOGIC LAYER                      │
│                           (Services)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐         ┌─────────────────────┐       │
│  │   Notification      │         │      Export         │       │
│  │     Service         │         │     Service         │       │
│  │  (Push Alerts)      │         │   (PDF/Excel)       │       │
│  └─────────────────────┘         └─────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                               ↕
┌─────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                              │
│                          (Models)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │   Driver   │  │   Daily    │  │Maintenance │  │ Weekly   │ │
│  │   Model    │  │   Entry    │  │   Model    │  │   Fee    │ │
│  │            │  │   Model    │  │            │  │  Model   │ │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                               ↕
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND / DATABASE                        │
│                      Firebase Cloud Firestore                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │  drivers   │  │   daily_   │  │maintenance │  │ weekly_  │ │
│  │ collection │  │  entries   │  │ collection │  │  fees    │ │
│  │            │  │ collection │  │            │  │collection│ │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘ │
│                                                                  │
│  Features: Real-time sync, Offline cache, Auto-backup           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### Adding a Daily Entry

```
User Input (UI)
      │
      ↓
Daily Entries Screen
      │
      ↓
Validation Check
      │
      ↓
Daily Entry Provider
      │
      ↓
Create Daily Entry Model
      │
      ↓
Firebase Firestore
      │
      ↓
Provider Notifies Listeners
      │
      ↓
UI Updates Automatically
```

### Viewing Weekly Report

```
Reports Screen Load
      │
      ↓
Weekly Fee Provider ─┐
Daily Entry Provider ├─→ Fetch Data from Firestore
Maintenance Provider ─┘
      │
      ↓
Calculate Weekly Totals
  • Total Earnings
  • Total Fuel
  • Total Maintenance
  • Rank Fee
  • Net Profit
      │
      ↓
Group by Driver
      │
      ↓
Display on Screen
      │
      ↓
User Exports ────→ Export Service ────→ PDF/Excel File
```

### Service Reminder Flow

```
User Updates Mileage
      │
      ↓
Driver Provider
      │
      ↓
Check: (totalKm - lastServiceKm) >= 10000?
      │
      ├─ YES → Notification Service
      │         │
      │         ↓
      │    Show Push Notification
      │         │
      │         ↓
      │    Update Dashboard UI
      │         │
      │         ↓
      │    Show Orange Badge
      │
      └─ NO → Normal Update
```

---

## 🗂️ File Dependency Tree

```
main.dart
  ├─ firebase_options.dart
  ├─ screens/splash_screen.dart
  │   └─ screens/home_screen.dart
  │       ├─ screens/dashboard_screen.dart
  │       │   ├─ providers/driver_provider.dart
  │       │   ├─ providers/daily_entry_provider.dart
  │       │   ├─ providers/maintenance_provider.dart
  │       │   └─ providers/weekly_fee_provider.dart
  │       │
  │       ├─ screens/drivers_screen.dart
  │       │   ├─ providers/driver_provider.dart
  │       │   └─ models/driver.dart
  │       │
  │       ├─ screens/daily_entries_screen.dart
  │       │   ├─ providers/driver_provider.dart
  │       │   ├─ providers/daily_entry_provider.dart
  │       │   └─ models/daily_entry.dart
  │       │
  │       ├─ screens/maintenance_screen.dart
  │       │   ├─ providers/driver_provider.dart
  │       │   ├─ providers/maintenance_provider.dart
  │       │   └─ models/maintenance.dart
  │       │
  │       └─ screens/reports_screen.dart
  │           ├─ providers/driver_provider.dart
  │           ├─ providers/daily_entry_provider.dart
  │           ├─ providers/maintenance_provider.dart
  │           ├─ providers/weekly_fee_provider.dart
  │           ├─ models/weekly_fee.dart
  │           └─ services/export_service.dart
  │
  ├─ providers/driver_provider.dart
  │   ├─ models/driver.dart
  │   └─ services/notification_service.dart
  │
  ├─ providers/daily_entry_provider.dart
  │   └─ models/daily_entry.dart
  │
  ├─ providers/maintenance_provider.dart
  │   └─ models/maintenance.dart
  │
  └─ providers/weekly_fee_provider.dart
      └─ models/weekly_fee.dart
```

---

## 🔄 Provider Pattern Explanation

### What is Provider?
Provider is a state management solution that:
- Listens for data changes
- Notifies UI widgets to rebuild
- Prevents unnecessary rebuilds
- Separates business logic from UI

### How It Works in This App

```dart
// 1. Provider is created
class DriverProvider with ChangeNotifier {
  List<Driver> _drivers = [];

  // 2. When data changes
  Future<void> addDriver(Driver driver) async {
    await firestore.add(driver);
    _drivers.add(driver);

    // 3. Notify all listeners
    notifyListeners(); // ← This rebuilds consuming widgets
  }
}

// 4. In main.dart - Provide to whole app
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => DriverProvider()),
  ],
  child: MyApp(),
)

// 5. In UI - Consume the provider
Consumer<DriverProvider>(
  builder: (context, provider, child) {
    return ListView(
      children: provider.drivers.map((driver) =>
        DriverCard(driver: driver)
      ).toList(),
    );
  },
)

// 6. When provider.addDriver() is called,
//    all Consumer widgets automatically rebuild!
```

---

## 🎨 UI Component Hierarchy

```
MaterialApp
  └─ MultiProvider (wraps entire app)
      └─ HomeScreen (Bottom Navigation)
          ├─ DashboardScreen
          │   ├─ RefreshIndicator
          │   └─ SingleChildScrollView
          │       ├─ Summary Cards Row
          │       ├─ Weekly Stats Cards
          │       ├─ Net Profit Gradient Card
          │       ├─ Weekly Chart (BarChart)
          │       └─ Service Reminders List
          │
          ├─ DriversScreen
          │   ├─ ListView of Driver Cards
          │   │   ├─ CircleAvatar (with badge)
          │   │   ├─ Driver Info
          │   │   └─ PopupMenuButton (Edit/Delete)
          │   └─ FloatingActionButton (Add)
          │
          ├─ DailyEntriesScreen
          │   ├─ Entry Form Container
          │   │   ├─ Driver Dropdown
          │   │   ├─ Date Picker
          │   │   ├─ Amount TextField
          │   │   ├─ Fuel Cost TextField
          │   │   ├─ Fuel Type Dropdown
          │   │   └─ Submit Button
          │   └─ Recent Entries ListView
          │
          ├─ MaintenanceScreen
          │   ├─ Monthly Grouped ListView
          │   │   ├─ Month Header + Total
          │   │   └─ Maintenance Cards
          │   └─ FloatingActionButton (Add)
          │
          └─ ReportsScreen
              ├─ Week Selector (Previous/Next)
              ├─ Overall Summary Card
              ├─ Rank Fee Section
              ├─ Driver Performance List
              │   └─ ExpansionTile per Driver
              └─ Export Button
```

---

## 📡 Firebase Data Sync Flow

```
App Start
    ↓
Firebase Initialization
    ↓
Provider Initialization
    ↓
Fetch Data from Firestore
    ↓
┌─────────────────────────┐
│  Firestore Listeners    │
│  (Real-time updates)    │
└─────────────────────────┘
         ↕
    When data changes on server
         ↓
    Firestore pushes update
         ↓
    Provider receives update
         ↓
    notifyListeners() called
         ↓
    UI rebuilds automatically
```

---

## 🔐 Security Rules Structure

### Current (Development Mode)
```javascript
// Allow all reads and writes
allow read, write: if true;
```

### Recommended (Production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Drivers collection
    match /drivers/{driverId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Daily entries collection
    match /daily_entries/{entryId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.createdBy;
    }

    // Maintenance collection
    match /maintenance/{maintenanceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Weekly fees collection
    match /weekly_fees/{feeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🧩 Key Design Patterns Used

### 1. **Repository Pattern** (Implicit)
Providers act as repositories, abstracting data access

### 2. **Observer Pattern** (Provider)
UI observes providers, updates when data changes

### 3. **Factory Pattern** (Models)
Models have `fromMap()` factory constructors

### 4. **Singleton Pattern** (Services)
NotificationService uses singleton pattern

### 5. **Separation of Concerns**
- Models: Data structure
- Providers: Business logic
- Screens: UI presentation
- Services: Shared functionality

---

## 📦 Package Responsibilities

```
┌─────────────────────────────────────────┐
│         Firebase Packages               │
├─────────────────────────────────────────┤
│ firebase_core      → Firebase init      │
│ cloud_firestore    → Database ops       │
│ firebase_auth      → Authentication     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        State Management                 │
├─────────────────────────────────────────┤
│ provider           → State management   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           UI & Charts                   │
├─────────────────────────────────────────┤
│ fl_chart           → Bar charts         │
│ intl               → Date formatting    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        Export & Sharing                 │
├─────────────────────────────────────────┤
│ pdf                → PDF generation     │
│ printing           → PDF preview/print  │
│ excel              → Excel export       │
│ share_plus         → File sharing       │
│ path_provider      → File paths         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Notifications                   │
├─────────────────────────────────────────┤
│ flutter_local_notifications → Alerts   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            Utilities                    │
├─────────────────────────────────────────┤
│ uuid               → Unique IDs         │
└─────────────────────────────────────────┘
```

---

## 🚀 App Lifecycle

```
1. App Launch
   ↓
2. Splash Screen (2 seconds)
   ↓
3. Initialize Firebase
   ↓
4. Initialize Notification Service
   ↓
5. Navigate to Home Screen
   ↓
6. Load Dashboard (default tab)
   ↓
7. Fetch data from all providers
   ↓
8. Display data in UI
   ↓
9. User interacts
   ↓
10. Data updates → Firestore → Providers → UI
```

---

## 💾 Offline Support

Firebase Firestore provides automatic offline support:

```
User Has Internet          User Offline
       ↓                         ↓
  Cloud Firestore          Local Cache
       ↓                         ↓
   Real-time Sync          Queue Changes
       ↓                         ↓
  Update UI                 Update UI
                                 ↓
                          When Online Again
                                 ↓
                          Sync to Cloud
```

---

## 🎯 Performance Considerations

### Efficient Queries
```dart
// Good: Query with date range
.where('date', isGreaterThan: weekStart)
.where('date', isLessThan: weekEnd)

// Good: Limit results
.limit(20)

// Good: Order by date
.orderBy('date', descending: true)
```

### Denormalization
```dart
// Store driverName directly in daily_entry
// Avoid extra query to get driver name
{
  "driverId": "123",
  "driverName": "John Doe",  // Denormalized
  "amount": 1500
}
```

### Provider Optimization
```dart
// Only rebuild specific widgets
Consumer<DriverProvider>(
  builder: (context, provider, child) {
    // Only this widget rebuilds
    return Text(provider.drivers.length.toString());
  },
)
```

---

This architecture ensures:
- ✅ Scalability
- ✅ Maintainability
- ✅ Testability
- ✅ Performance
- ✅ Clean code organization

**Ready to build and deploy!** 🚀
