# Vaccine Village

## Overview

Vaccine Village is a React Native mobile application built with Expo that provides multilingual vaccine education for Kenyan communities. The app serves as an accessible educational tool offering AI-powered chatbot assistance (mock service), curated vaccine resources, and offline-capable content in English, Swahili, and 13 indigenous Kenyan languages. It emphasizes privacy, low-bandwidth compatibility, and culturally appropriate health information delivery.

### Recent Features (November 16, 2025)
- **Phase-Based Navigation**: Robust onboarding flow with Loading → Landing → Language → Consent → Auth → Main transitions
- **Navigation Architecture Fix**: Resolved React hooks violations with always-mounted NavigationContainer and ref-based phase control
- **Enhanced Authentication**: Password-based authentication with firstName/lastName fields, SHA256 password hashing, and Kenyan phone number validation
- **Phone Normalization**: Robust utility handling all Kenyan formats (+254, 254, 0, 7, 1, spaces) with automatic legacy data migration on app startup
- **Community Reviews**: Star rating system (1-5) with optional anonymity, proper privacy handling (real names stored, "Anonymous" displayed when toggled)
- **Multilingual Chatbot**: Swahili translations for top 5 common responses (default, babies, schedule, location, sideEffects) with clear bilingual fallback messages for other languages
- **Enhanced History View**: Chat history now displays full conversation pairs (Q&A) with expandable cards
- **Improved Navigation**: Tapping Chat tab while active scrolls to top and clears input
- **Smart Cache Management**: Chat history auto-clears after 30 minutes in background
- **Custom Branding**: Maroon/beige app icons for iOS, Android (adaptive), and web
- **Offline Mode**: Startup modal offers resource download for offline access
- **Cross-screen Sync**: Bookmarks synchronized across all screens
- **Multilingual Support**: All new features translated to Swahili (professional translation needed for other 13 languages)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React Native 0.81.5 with Expo SDK 54
- **Language**: TypeScript with strict mode enabled
- **Navigation**: React Navigation v7 with bottom tabs and native stack navigators
- **State Management**: React Context API for global state (Authentication, Language)
- **UI Components**: Custom themed components with light/dark mode support
- **Animations**: React Native Reanimated v4 for smooth interactions
- **Styling**: StyleSheet-based styling with centralized theme constants

**Navigation Structure:**
- **Phase-based architecture**: Always-mounted NavigationContainer with RootStackNavigator controlling all screens
- **Onboarding phases**: Loading → Landing (first-time) → Language → Consent → Auth → Main
- **useOnboardingState hook**: Centralized phase management with AsyncStorage persistence
- **NavigationRef control**: Uses useNavigationContainerRef with onReady guard and route deduplication
- **Tab-based navigation** with 4 main tabs: Chat (Home), Resources, Saved, Settings
- **Stack navigators** for each tab to support future nested navigation
- **Floating Action Button** on Resources and Saved tabs for quick chat access
- **MainPhaseEffects**: Modal management (OfflineDownload, VaccinationStats) only during 'main' phase

**Key Design Decisions:**
- **Color scheme**: Maroon (#800020) primary, Beige (#F5F5DC) accent, with comprehensive light/dark theme support
  - Brand colors maintained for consistency (Nov 16, 2025 update)
  - Improved background contrast for better readability
- **Accessibility-first**: Minimum 56px touch targets, haptic feedback, screen reader support
- **Safe area handling**: Comprehensive inset management for modern iOS/Android devices
- **Transparent headers** on chat screen with blurred tab bars on iOS

**Component Architecture:**
- Themed wrapper components (`ThemedView`, `ThemedText`) for consistent styling
- Reusable layout components (`ScreenScrollView`, `ScreenKeyboardAwareScrollView`, `ScreenFlatList`)
- Custom UI elements (Button, Card, ChatBubble, ConfidenceBadge, ResourceCard)
- Error boundary implementation for graceful error handling

### Authentication System

**Implementation Status**: ✅ Completed
- **User data storage**: AsyncStorage for local persistence
- **Required fields**: First name, last name, Kenyan phone number (normalized to +254 format), and password (SHA256 hashed)
- **Phone normalization**: Robust utility (utils/phoneNormalization.ts) handles all formats (+254, 254, 0, 7/1 prefixes, spaces, punctuation)
  - Legacy data migration: Automatically normalizes existing phone numbers on app startup
  - Consistent normalization in both signup and login flows
- **Password security**: SHA256 hashing via Expo Crypto with secure verification (utils/password.ts)
- **Session management**: Users must re-login after app restart (no persistent sessions for privacy/security)
- **Location tracking**: Expo Location API for county-level health facility recommendations
  - Location captured during signup with graceful permission handling
  - Can be updated later from Settings screen
  - Falls back gracefully if permissions are denied
- **Privacy-focused**: No server-side user data transmission in current implementation
- **Flow**: AuthScreen (new users) / LoginScreen (returning users) → Main App (4 tabs)

**Recent Updates (Nov 16, 2025)**:
- Enhanced with firstName/lastName fields (stored separately)
- Password-based authentication replaces phone-only auth
- Robust phone normalization with legacy migration
- Fixed user state rehydration after phone number migration

**Rationale**: 
- Password authentication provides better security for sensitive health information
- Separate name fields enable personalized greetings and proper review attribution
- Phone normalization ensures reliable login across different input formats
- Local storage allows the app to function without internet connectivity
- Future backend integration prepared through clean separation of concerns

### Internationalization (i18n)

**Multi-language Support:**
- **15 languages**: English, Swahili, Kikuyu, Luo, Kamba, Luyia, Kalenjin, Mijikenda, Somali, Turkana, Samburu, Maasai, Rendille, Embu, Meru
- **Implementation**: Custom translation system with language context provider
- **Storage**: User language preference persisted in AsyncStorage
- **Resource localization**: All vaccine resources include translations for title and summary

**Translation Status (Nov 16, 2025)**:
- **Fully translated**: English, Swahili, Kikuyu, Luo, Kamba, Luyia, Kalenjin, Somali (8 languages)
- **Placeholder/Awaiting professional translation**: Mijikenda, Turkana, Samburu, Maasai, Rendille, Embu, Meru (7 languages)
- Human-in-the-loop professional translation review workflow planned for placeholder languages

**Design Decision:**
- Built custom lightweight i18n instead of heavy libraries (like i18next) to reduce bundle size
- Translation keys typed for compile-time safety
- Fallback to English for missing translations

### Chat/AI Integration

**Current Implementation**: Mock chatbot service with multilingual support
- **Message structure**: Typed interfaces with role, content, confidence level, and source citations
- **Multilingual responses**: 
  - Swahili translations for top 5 common intents (default, babies, schedule, location, sideEffects)
  - Bilingual fallback messages for other 13 languages indicating translations are in progress
  - Responses automatically match user's selected language
- **Safety filtering**: `detectUnsafeQuery` function to identify potentially dangerous questions
- **Response confidence**: High/Medium/Low badges to indicate information reliability
- **Source citations**: Array of authoritative sources (Kenya MOH, WHO, UNICEF) per response
- **Language-aware architecture**:
  - `MOCK_RESPONSES_EN`: English responses for all intents
  - `MOCK_RESPONSES_SW`: Swahili translations for high-traffic intents
  - `getLocalizedResponse()`: Selects language-specific response with fallback
  - `addLanguageFallback()`: Adds bilingual disclaimer for incomplete translations

**Planned Architecture:**
- RAG (Retrieval-Augmented Generation) using open-source LLMs or Hugging Face models
- Vector embeddings for semantic search over curated vaccine knowledge base
- Confidence scoring based on source quality and semantic similarity
- Fallback to local health facility recommendations for low-confidence queries
- Full translations for all 15 supported languages (currently: English + partial Swahili)

**Design Rationale:**
- Mock implementation allows UI/UX development without backend dependency
- Clean service layer separation enables easy backend integration
- Confidence scoring builds user trust through transparency
- Multilingual support starts with Swahili (most widely spoken) and provides clear expectations for other languages

### Text-to-Speech (TTS)

**Current Integration**: Expo Speech API
- **Listen buttons** on chat messages and resource content
- **Language-aware**: TTS respects user's selected language
- **Haptic feedback**: Tactile confirmation when activating audio

**Planned Enhancement:**
- Integration with open-source TTS models (Coqui TTS, Mozilla TTS, Hugging Face)
- SSML support for correct pronunciation of medical terms
- Phonetic glossary for local language medical terminology
- Offline TTS capability through pre-generated audio caching

### Data Persistence

**Storage Strategy**: AsyncStorage for all local data
- **User preferences**: Language, theme, data consent
- **Chat history**: Persisted conversations with timestamps
- **Bookmarked resources**: User-saved vaccine information
- **First-time user flags**: "How to use" dismissal, language selection completion

**Rationale**: 
- AsyncStorage provides cross-platform persistence without native modules
- JSON serialization for complex data structures
- No backend dependency for offline-first functionality

### Offline Support Strategy

**Current Capabilities:**
- Local storage of all UI strings and translations
- Static resource metadata cached in app bundle
- Chat history persisted locally

**Planned Features:**
- Service worker/PWA for web deployment
- Pre-cached vaccine resource PDFs
- Offline-capable TTS audio files
- Text-only fallback mode for low-bandwidth scenarios

**Design Decision:**
- Progressive enhancement approach: app works offline, enhanced with connectivity
- Small bundle size prioritized for low-bandwidth users
- Future CDN integration for media assets

### Resource Management

**Content Structure:**
- **Vaccine resources** defined in static configuration with metadata
- **Categories**: General information, vaccination schedules, safety information
- **Sources**: Ministry of Health (Kenya), WHO, UNICEF with visual badges
- **Multilingual**: All resources include translations across supported languages

**Bookmark System:**
- Local-only storage in AsyncStorage
- Quick toggle functionality with haptic feedback
- Dedicated "Saved" tab for bookmarked content and chat history

## External Dependencies

### Core Expo Modules
- **expo SDK 54**: Base platform with automatic updates and OTA support
- **expo-constants**: Environment and app configuration access
- **expo-font**: Custom font loading (future typography enhancement)
- **expo-splash-screen**: Controlled app launch experience
- **expo-status-bar**: Themed status bar management
- **expo-haptics**: Tactile feedback for interactions
- **expo-speech**: Text-to-speech functionality
- **expo-location**: Optional geolocation for health facility recommendations
- **expo-web-browser**: In-app browser for external vaccine resources
- **expo-blur**: Translucent tab bar effects on iOS
- **expo-glass-effect**: Advanced blur effects when available

### Navigation
- **@react-navigation/native v7**: Core navigation framework
- **@react-navigation/native-stack**: Native stack transitions
- **@react-navigation/bottom-tabs**: Tab-based primary navigation
- **@react-navigation/elements**: Header utilities and components
- **react-native-screens**: Native screen optimization
- **react-native-safe-area-context**: Device inset handling

### UI & Interaction
- **react-native-reanimated v4**: High-performance animations
- **react-native-gesture-handler**: Touch gesture system
- **react-native-keyboard-controller**: Advanced keyboard management
- **@expo/vector-icons**: Feather icon set for consistent UI

### Storage
- **@react-native-async-storage/async-storage**: Key-value persistence

### Planned Third-Party Services
- **AI/LLM Backend**: Hugging Face Inference API or self-hosted LLM (Llama, BLOOM)
- **Embedding Service**: Sentence transformers for semantic search
- **TTS Service**: Coqui TTS, Mozilla TTS, or Hugging Face TTS models
- **CDN**: For static vaccine resource files and pre-generated audio
- **Analytics** (optional with consent): Privacy-focused usage tracking

### Development Tools
- **TypeScript**: Type safety and developer experience
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **babel-plugin-module-resolver**: Path alias support (@/ imports)

### Platform Targets
- **iOS**: Native iOS app via Expo
- **Android**: Native Android app via Expo
- **Web**: React Native Web for browser access (limited offline support)