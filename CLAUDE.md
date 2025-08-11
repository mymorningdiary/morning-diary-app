# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator  
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run web version
- `npm run test` - Run Jest tests with watch mode
- `npm run lint` - Run ESLint for code quality checks
- `npm run reset-project` - Reset to blank project structure

### Build Commands (EAS)
- `eas build --profile development` - Development build with dev client
- `eas build --profile preview` - Internal preview build
- `eas build --profile production` - Production build

## Architecture Overview

This is a React Native mobile app built with Expo and TypeScript, implementing a morning diary application with Kakao login integration.

### Tech Stack
- **Framework**: Expo SDK 52 with React Native 0.76
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context + TanStack Query for server state
- **UI**: Custom component library with theme support
- **Authentication**: Kakao SDK integration
- **Storage**: AsyncStorage for local data persistence

### Project Structure

```
app/                    # File-based routing screens
├── _layout.tsx        # Root layout with providers
├── index.tsx          # Entry point
├── login.tsx          # Kakao login screen
├── main.tsx           # Main diary view
├── write.tsx          # Diary writing
└── ...                # Other screens

components/            # Reusable UI components
├── MD*.tsx           # Custom component library (MDButton, MDText, etc.)
├── main/             # Main screen specific components
├── write/            # Write screen specific components
└── index.ts          # Component exports

contexts/             # React Context providers
├── AppContext.tsx    # App state (first launch, etc.)
├── AuthContext.tsx   # Authentication state
└── UserContext.tsx   # User data management

core/                 # Business logic layer
├── api/              # API layer with Axios
│   ├── auth/         # Authentication APIs
│   ├── diary/        # Diary CRUD operations
│   └── user/         # User management
├── storage/          # Local storage abstractions
└── types.ts          # Core type definitions

hooks/                # Custom React hooks
├── useAuthMutation.ts
├── useDiaryQuery.ts
└── ...               # TanStack Query hooks

constants/            # App constants
├── colors.ts         # Color palette
├── fonts.ts          # Typography
└── theme.ts          # Theme configuration

domain/               # Feature-specific components
├── first-write/      # First-time writing flow
├── setting/          # Settings management
└── ...               # Other feature domains
```

### Key Architectural Patterns

1. **Provider Pattern**: App wrapped in multiple context providers for global state
2. **Custom Hook Pattern**: Business logic abstracted into reusable hooks
3. **Component Library**: Consistent UI through custom MD* components
4. **Feature Domains**: Screen-specific logic grouped in domain folders
5. **API Layer**: Centralized HTTP client with typed responses
6. **Storage Abstraction**: Unified interface for AsyncStorage operations

### Authentication Flow
- Uses Kakao SDK for social authentication
- JWT tokens managed through AuthContext
- Protected routes handled at navigation level
- First launch detection for onboarding flow

### Kakao Integration
- Native app key: `a243e903ae144e0e7d383fc00ef39d21`
- Requires Android Maven repo configuration
- Deep linking support configured in app.json

### Development Notes
- TypeScript strict mode enabled
- ESLint with Expo and Prettier configurations
- Jest testing framework with expo preset
- Development client builds for testing native features
- EAS Build configured for multiple environments (dev, preview, production)

### Theme System
- Dark/light mode support via React Navigation themes
- Custom color palette in constants/colors.ts
- Consistent typography through constants/fonts.ts
- Theme-aware components using useThemeColor hook