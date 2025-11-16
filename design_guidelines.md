# Vaccine Village - Mobile Design Guidelines

## Architecture Decisions

### Authentication
**No authentication required** - The app is a public education tool focused on accessibility.
- Include a **Settings screen** with:
  - Language preference selection
  - Download preferences for offline content
  - Data usage consent toggle
  - App version and about information

### Navigation
**Tab Navigation** (4 tabs):
1. **Home** - AI chatbot interface with prominent chat input
2. **Resources** - Curated vaccine information library
3. **Saved** - Bookmarked resources and chat history
4. **Settings** - Language, offline content, privacy controls

**Floating Action Button**: "Ask Question" FAB available on Resources and Saved tabs to quickly return to chat.

### Screen Specifications

#### 1. Language Selection (Initial Launch Only)
- **Purpose**: One-time language selection on first app open
- **Layout**:
  - Full-screen modal with app logo at top (lotus in maroon)
  - Scrollable list of languages with native script labels
  - Large, accessible touch targets (min 56px height)
  - Selected language highlighted with maroon accent
  - "Continue" button pinned to bottom
- **Header**: None (full-screen modal)
- **Safe Area**: Top inset: insets.top + Spacing.xl, Bottom: insets.bottom + Spacing.xl

#### 2. Home Screen (Chat Interface)
- **Purpose**: Primary vaccine question answering via AI chatbot
- **Layout**:
  - **Header**: Transparent, shows app logo (lotus) centered, language switcher icon (globe) on right
  - **Main Content**: 
    - Scrollable message list (inverted ScrollView)
    - "How to use" tip card at bottom (dismissible after first use)
    - Quick-start prompt chips above input for first-time users:
      - "What vaccines do babies need?"
      - "Is MMR vaccine safe?"
      - "Where can I get vaccinated?"
  - **Chat Input**: Fixed at bottom with beige background
    - Text input with placeholder in selected language
    - "Listen" icon to enable voice input (future)
    - Send button (maroon arrow icon)
  - **Message Bubbles**:
    - User messages: Right-aligned, maroon background, white text
    - Bot messages: Left-aligned, beige background, black text
    - Include confidence badge (High/Medium/Low) for bot responses
    - "Listen" button (speaker icon) on bot messages
    - "Cite sources" link in small text below bot messages
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + 80 (input height) + Spacing.xl

#### 3. Resources Screen
- **Purpose**: Browse curated vaccine resources by category
- **Layout**:
  - **Header**: Default navigation header with search bar, "Resources" title
  - **Main Content**: Scrollable list with category sections
    - Section headers: Bold, maroon text
    - Resource cards with:
      - Source badge (MOH/WHO/UNICEF) with icon
      - Resource title (bold, black)
      - Plain-language summary (2-3 lines, gray text)
      - Publish date (small, gray)
      - External link icon + bookmark icon
  - Floating "Ask Question" FAB (maroon, bottom-right)
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl + 60 (FAB height)

#### 4. Saved Screen
- **Purpose**: Access bookmarked resources and chat history
- **Layout**:
  - **Header**: Default with tabs for "Bookmarks" | "Chat History"
  - **Main Content**: 
    - Scrollable list of saved items
    - Swipe-to-delete gesture with confirmation
    - Empty state illustration with "No saved items yet" message
  - Floating "Ask Question" FAB
- **Safe Area**: Same as Resources

#### 5. Settings Screen
- **Purpose**: Configure language, download offline content, manage privacy
- **Layout**:
  - **Header**: Default with "Settings" title, back button
  - **Main Content**: Scrollable form with grouped sections
    - **Language**: Picker with current selection, chevron right
    - **Offline Content**: 
      - Download toggle for each language
      - Storage usage indicator
    - **Privacy**: 
      - Data collection consent toggle
      - View Privacy Policy button
      - View Terms of Service button
    - **About**: App version, credits, licenses
  - Submit/Cancel: None (changes apply immediately)
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl

#### 6. Source Citation Modal
- **Purpose**: Display full source references for chatbot answers
- **Layout**:
  - Native modal (slides up from bottom)
  - White background, rounded top corners
  - Close button (X) in top-right
  - Scrollable list of sources with:
    - Source name (bold)
    - Full citation
    - Link to original (external)
    - Date accessed
- **Safe Area**: Top: Spacing.lg, Bottom: insets.bottom + Spacing.lg

## Design System

### Color Palette
- **Primary (Maroon)**: `#800020` - CTA buttons, active states, user message bubbles, brand elements
- **Beige**: `#F5F5DC` - Backgrounds, bot message bubbles, input fields, secondary surfaces
- **Black**: `#000000` - Primary text, strong accents
- **Gray Scale**:
  - Dark Gray `#4A4A4A` - Secondary text
  - Medium Gray `#9E9E9E` - Tertiary text, metadata
  - Light Gray `#E0E0E0` - Dividers, disabled states
- **System Colors**:
  - Success Green `#4CAF50` - High confidence badge
  - Warning Orange `#FF9800` - Medium confidence badge
  - Error Red `#F44336` - Low confidence badge, misinformation warnings

### Typography
- **Primary Font**: System default (SF Pro for iOS, Roboto for Android)
- **Hierarchy**:
  - Heading 1: 28pt, Bold - Screen titles
  - Heading 2: 22pt, Semibold - Section headers
  - Heading 3: 18pt, Semibold - Card titles
  - Body: 16pt, Regular - Main content
  - Caption: 14pt, Regular - Metadata, timestamps
  - Small: 12pt, Regular - Source citations, disclaimers
- **Line Height**: 1.5x for body text, 1.3x for headings
- **Accessibility**: Support Dynamic Type (iOS), scale fonts with system settings

### Spacing & Layout
- **Spacing Scale**:
  - xs: 4px
  - sm: 8px
  - md: 12px
  - lg: 16px
  - xl: 24px
  - xxl: 32px
- **Card Padding**: lg (16px) internal padding
- **List Item Height**: Minimum 56px for touch targets
- **Corner Radius**: 12px for cards, 24px for input fields and buttons, 8px for badges

### Icons & Assets
- **Icon Library**: Feather Icons from @expo/vector-icons
- **Logo**: Stylized lotus SVG
  - Primary: Maroon lotus with beige background (use in header)
  - Monochrome: Black lotus (use in small contexts)
  - Size: 32px in header, 48px in language selection
- **No custom illustrations** - Use system icons and text-based UI
- **Confidence Badges**: Text-only badges with color coding
  - High: Green background, white text
  - Medium: Orange background, white text
  - Low: Red background, white text

### Interaction Design
- **Touchable Feedback**: All buttons and cards have 0.7 opacity when pressed
- **Floating Action Button Shadow**:
  - shadowOffset: {width: 0, height: 4}
  - shadowOpacity: 0.15
  - shadowRadius: 8
  - elevation: 8 (Android)
- **Loading States**: Skeleton screens for resource lists, typing indicator (animated dots) for chatbot
- **Haptic Feedback**: Light impact on button press, medium on send message, notification on received message
- **Animations**:
  - Screen transitions: 300ms slide
  - Modal presentation: 400ms spring
  - Message appearance: 200ms fade + slide up

### Accessibility
- **VoiceOver/TalkBack**: All interactive elements have accessibility labels in selected language
- **Color Contrast**: Minimum 4.5:1 for body text, 3:1 for large text
- **Touch Targets**: Minimum 44x44pt (iOS) / 48x48dp (Android)
- **Text-to-Speech Integration**:
  - "Listen" button on every bot message and resource summary
  - Automatic pronunciation of vaccine names using phonetic annotations
  - Pause/resume/speed controls in accessible modal
- **Reduce Motion**: Respect system preference, disable animations if enabled
- **Screen Reader Announcements**: Live regions for new chat messages

### Offline & Performance
- **Cached Content Indicators**: Small cloud-with-checkmark icon on downloaded resources
- **Offline Banner**: Persistent yellow banner at top when offline, "You're offline - showing cached content"
- **Low Bandwidth Mode**: Setting to disable auto-download of audio files
- **Progressive Loading**: Show text immediately, load TTS audio in background with loading spinner on "Listen" button

### Safety & Moderation
- **Misinformation Warning**: Red alert card with exclamation icon for blocked queries
  - "We can't answer this question safely"
  - "Please contact: [local health facility info]"
  - Links to WHO/MOH official guidance
- **Source Attribution**: Every bot message must display "Sources: WHO, Kenya MOH" with tap-to-expand
- **Report Issue**: Small "Report" link on bot messages for user feedback