# EduCal

A mobile financial planning app that helps families calculate and save for their children's education costs. Uses AI-powered school search to provide localized cost estimates and personalized monthly savings goals.

## Tech Stack

- **Expo SDK 55** + React Native
- **Expo Router** (file-based routing)
- **Zustand** (state management)
- **TypeScript** (strict mode)
- **Google Gemini API** (AI-powered school search with Maps + Search grounding)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Bun](https://bun.sh/) (recommended) or npm
- [Expo Go](https://expo.dev/go) on your device, or an emulator

### Setup

```bash
bun install
bun start
```

Scan the QR code with Expo Go, or press `a` for Android / `i` for iOS.

### Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `bun start`     | Start Expo dev server    |
| `bun run android` | Run on Android         |
| `bun run ios`   | Run on iOS               |
| `bun run web`   | Run on web               |
| `bun run lint`  | Run ESLint               |

## Project Structure

```
src/
  app/
    onboarding/        # 3-step onboarding wizard
    (tabs)/             # Home, Schools, Progress, Profile
    school/[id].tsx     # School detail screen
  components/           # UI primitives + feature components
  services/             # Gemini API client, savings calculator
  stores/               # Zustand stores
  types/                # TypeScript types
  constants/            # Theme tokens, fallback data
  utils/                # Formatters, validators
docs/                   # Spec, design system, API docs
```
