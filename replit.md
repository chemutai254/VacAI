# Vaccine Village

## Overview

Vaccine Village is a React Native mobile application built with Expo, designed to provide multilingual vaccine education to Kenyan communities. It offers an accessible educational tool featuring AI-powered chatbot assistance (mock service), curated vaccine resources, and offline-capable content in English, Swahili, and 13 indigenous Kenyan languages. The project prioritizes privacy, low-bandwidth compatibility, and culturally appropriate health information delivery, aiming to enhance health literacy and access to vital vaccine information across diverse communities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React Native with Expo SDK
- **Language**: TypeScript with strict mode
- **Navigation**: React Navigation v7 (bottom tabs, native stack)
- **State Management**: React Context API
- **UI Components**: Custom themed components, light/dark mode support
- **Animations**: React Native Reanimated v4
- **Styling**: StyleSheet-based with centralized theme constants

**Navigation Structure:**
- **Phase-based architecture**: RootStackNavigator controls Loading → Landing → Language → Consent → Auth → Main transitions.
- **Tab-based navigation** with 4 main tabs: Chat, Resources, Saved, Settings.
- Stack navigators for each tab support nested navigation.

**Key Design Decisions:**
- **Color scheme**: Maroon (#800020) primary, Beige (#F5F5DC) accent, with comprehensive light/dark theme support.
- **Accessibility-first**: 56px touch targets, haptic feedback, screen reader support.
- **Safe area handling**: Comprehensive inset management for modern devices.
- **Transparent headers** and blurred tab bars on iOS.

### Authentication System

**Implementation Status**: Completed (Google OAuth)
- **Authentication Method**: Google OAuth 2.0 via `expo-auth-session`.
- **User Profile Data**: Automatically populated from Google account (email, name, profile picture, Google ID).
- **Session Management**: OAuth flow with token exchange; user profile cached in AsyncStorage for offline access.
- **Legacy Migration**: Automatic detection and cleanup of old phone/password profiles.
- **Location Services**: Expo Location API for county-level health facility recommendations, captured during first sign-in.
- **Privacy-focused**: No server-side user data transmission in current implementation.

### Internationalization (i18n)

**Multi-language Support:**
- **15 languages**: English, Swahili, Kikuyu, Luo, Kamba, Luyia, Kalenjin, Mijikenda, Somali, Turkana, Samburu, Maasai, Rendille, Embu, Meru.
- **Implementation**: Custom translation system with language context provider, preference persisted in AsyncStorage.
- **Translation Status**: Fully translated chatbot responses for top 5 common intents in all 15 languages; UI translations complete for English and Swahili.

### Chat/AI Integration

**Current Implementation**: Mock chatbot service with comprehensive multilingual support.
- **Message structure**: Typed interfaces with role, content, confidence, and source citations.
- **Multilingual responses**: Complete translations for all 15 languages for top 5 common intents, matching user's selected language.
- **Safety filtering**: `detectUnsafeQuery` function.
- **Response confidence**: High/Medium/Low badges.
- **Source citations**: Array of authoritative sources.

**Planned Architecture:**
- RAG (Retrieval-Augmented Generation) using open-source LLMs.
- Vector embeddings for semantic search over a curated knowledge base.

### Text-to-Speech (TTS)

**Current Integration**: Expo Speech API with "Listen" buttons on chat messages and resources, language-aware TTS, and haptic feedback.

**Planned Enhancement:**
- Integration with open-source TTS models (Coqui TTS, Mozilla TTS, Hugging Face).
- SSML support and phonetic glossary.
- Offline TTS capability.

### Data Persistence

**Storage Strategy**: AsyncStorage for all local data.
- User preferences (language, theme, data consent).
- Chat history.
- Bookmarked resources.
- First-time user flags.

### Offline Support Strategy

**Current Capabilities:**
- Local storage of UI strings and translations.
- Static resource metadata cached in app bundle.
- Chat history persisted locally.

**Planned Features:**
- Service worker/PWA for web.
- Pre-cached vaccine resource PDFs and TTS audio files.
- Text-only fallback mode.

### Resource Management

**Content Structure:**
- Vaccine resources defined in static configuration with metadata.
- Categories: General, schedules, safety.
- Sources: Ministry of Health (Kenya), WHO, UNICEF.
- Multilingual: All resources include translations.

**Bookmark System:**
- Local-only storage in AsyncStorage with quick toggle.
- Dedicated "Saved" tab.

## External Dependencies

### Core Expo Modules
- **expo SDK**: Base platform, OTA updates.
- **expo-constants**: Configuration access.
- **expo-speech**: Text-to-speech.
- **expo-location**: Optional geolocation.
- **expo-web-browser**: In-app browser.
- **expo-auth-session**: Google OAuth.

### Navigation
- **@react-navigation/native**: Core framework.
- **@react-navigation/native-stack**: Native stack transitions.
- **@react-navigation/bottom-tabs**: Tab-based navigation.

### UI & Interaction
- **react-native-reanimated**: High-performance animations.
- **react-native-gesture-handler**: Touch gestures.
- **@expo/vector-icons**: Icon set.

### Storage
- **@react-native-async-storage/async-storage**: Key-value persistence.

### Planned Third-Party Services
- **AI/LLM Backend**: Hugging Face Inference API or self-hosted LLM.
- **Embedding Service**: For semantic search.
- **TTS Service**: Coqui TTS, Mozilla TTS, or Hugging Face TTS.
- **CDN**: For static assets.

### Development Tools
- **TypeScript**: Type safety.
- **ESLint**: Code quality.
- **Prettier**: Code formatting.
- **babel-plugin-module-resolver**: Path alias support.

### Platform Targets
- **iOS**: Native iOS app.
- **Android**: Native Android app.
- **Web**: React Native Web.