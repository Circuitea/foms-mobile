# Field Operations Management System - Mobile Application

A Capstone Project made for the San Juan CDRRMO, in compliance with the academic requirements for the BS Information Technology program in Jose Rizal University.

> Contains information from OpenStreetMap, which is made available under the Open Database License (ODbL).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Field Operations Management System (FOMS) Mobile Application is designed to streamline task management and field operations for the San Juan City Disaster Risk Reduction and Management Office (CDRRMO). It enables field personnel to receive task assignments, update task statuses, and communicate effectively with the operations center.

## Features

- **User Authentication**: Secure login with token-based authentication
- **First-Time Login Onboarding**: Password setup for new users
- **Task Management**: View, accept, and update task statuses
- **Real-Time Notifications**: Push notifications for task assignments and updates
- **Location Services**: GPS tracking for field personnel
- **Profile Management**: Update personal information and availability status
- **Offline Support**: Basic functionality when network is unavailable

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Language**: TypeScript
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Push Notifications**: Expo Notifications
- **Maps**: React Native Leaflet View
- **Styling**: React Native StyleSheet

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)
- [Android Studio](https://developer.android.com/studio) (for Android development)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/foms-mobile.git
   cd foms-mobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   Or if you're using yarn:

   ```bash
   yarn install
   ```

3. **Install Expo CLI globally (if not already installed)**

   ```bash
   npm install -g expo-cli
   ```

4. **Install EAS CLI (for building)**

   ```bash
   npm install -g eas-cli
   ```

## Configuration

1. **Create environment configuration**

   Create or update `app.config.js` in the root directory:

   ```javascript
   export default {
     expo: {
       name: "FOMS",
       slug: "foms-mobile",
       version: "1.0.0",
       orientation: "portrait",
       icon: "./assets/icon.png",
       splash: {
         image: "./assets/splash.png",
         resizeMode: "contain",
         backgroundColor: "#1B2560"
       },
       extra: {
         apiBaseURL: process.env.API_BASE_URL || "https://your-api-url.com",
         eas: {
           projectId: "your-eas-project-id"
         }
       },
       android: {
         package: "com.yourorg.foms",
         adaptiveIcon: {
           foregroundImage: "./assets/adaptive-icon.png",
           backgroundColor: "#1B2560"
         }
       }
     }
   };
   ```

2. **Configure API endpoint**

   Update the `apiBaseURL` in `app.config.js` to point to your backend API server.

3. **Configure EAS (for builds)**

   ```bash
   eas build:configure
   ```

   This will create an `eas.json` file with build profiles.

## Running the Application

### Development Mode

1. **Start the Expo development server**

   ```bash
   npx expo start
   ```

2. **Run on Android**

   - **Android Emulator**: Press `a` in the terminal or run:
     ```bash
     npx expo start --android
     ```

   - **Physical Device**: Download the [Expo Go](https://expo.dev/client) app and scan the QR code displayed in the terminal.

### Development Build (Recommended for full functionality)

For features like push notifications that require native code:

```bash
# Build development client for Android
npx eas build --profile development --platform android
```

## Building for Production

### Using EAS Build (Recommended)

1. **Login to Expo**

   ```bash
   eas login
   ```

2. **Build for Android**

   ```bash
   npx eas build --platform android --profile production
   ```

3. **Submit to Google Play Store**

   ```bash
   npx eas submit --platform android
   ```

### Local Build (Alternative)

For Android APK:

```bash
npx expo run:android --variant release
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

Tests are located in the `__tests__` directory:

```
__tests__/
├── setup.ts                    # Jest setup and mocks
├── components/                 # Component tests
│   └── Button.test.tsx
├── integration/                # Integration tests
│   ├── auth-flow.test.tsx
│   └── task-management.test.tsx
├── lib/                        # Library/utility tests
│   ├── api.test.tsx
│   └── notifications.test.tsx
├── screens/                    # Screen tests
│   ├── HomeScreen.test.tsx
│   ├── LoginScreen.test.tsx
│   └── ProfileScreen.test.tsx
└── utils/                      # Utility tests
    └── validation.test.tsx
```

## Project Structure

```
foms-mobile/
├── __tests__/                  # Test files
├── assets/                     # Images, fonts, and other static assets
├── src/
│   ├── app/                    # Expo Router screens and layouts
│   │   ├── (auth)/             # Authentication screens
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   └── onboarding.tsx
│   │   ├── (tabs)/             # Main app screens (tab navigation)
│   │   │   ├── _layout.tsx
│   │   │   ├── home.tsx
│   │   │   ├── tasks.tsx
│   │   │   ├── meetings.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── profile/        # Profile sub-screens
│   │   │   └── task/           # Task detail screens
│   │   ├── _layout.tsx         # Root layout
│   │   └── index.tsx           # Entry point
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Map.tsx
│   │   ├── NotificationModal.tsx
│   │   └── TaskStatusModal.tsx
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom hooks
│   │   └── use-auth.tsx
│   ├── lib/                    # Utilities and services
│   │   ├── api.ts              # API client configuration
│   │   ├── constants.ts        # App constants
│   │   ├── location.ts         # Location services
│   │   └── notifications.ts    # Push notification setup
│   ├── providers/              # Context providers
│   │   ├── auth-provider.tsx
│   │   └── ProfileProvider.tsx
│   └── types/                  # TypeScript type definitions
│       ├── index.d.ts
│       ├── tasks.d.ts
│       └── transaction.d.ts
├── app.config.js               # Expo configuration
├── eas.json                    # EAS Build configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_BASE_URL` | Backend API base URL | `https://foms.djcayz.xyz` |

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**

   ```bash
   npx expo start --clear
   ```

2. **Node modules issues**

   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Android build issues**

   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

### Getting Help

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Write meaningful commit messages
- Add tests for new features

## Authors

- **Charles Barrameda** - *Initial work*

## License

This project is developed as part of an academic capstone project for Jose Rizal University. All rights reserved.

## Acknowledgments

- San Juan City CDRRMO for their collaboration
- Jose Rizal University - BS Information Technology Department
- OpenStreetMap contributors for map data
