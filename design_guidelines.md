# Vaccine Village - Mobile Design Guidelines

## Architecture Decisions

### Authentication
**No authentication required** - Public education tool focused on accessibility.
- Include **Settings screen** with:
  - Language preference
  - Offline content downloads
  - Data usage consent
  - App version & about

### Navigation
**Tab Navigation** (4 tabs):
1. **Home** - AI chatbot with Meta AI-style interface
2. **Resources** - Curated vaccine library
3. **Saved** - Bookmarks and chat history
4. **Settings** - Language, privacy, offline content

**Floating Action Button**: Maroon "Ask Question" FAB on Resources and Saved tabs (bottom-right, 16px from edges).

### Screen Specifications

#### 1. Language Selection (Initial Launch)
- **Purpose**: One-time language selection on first open
- **Layout**:
  - Full-screen modal, white background
  - App logo (lotus) centered at top
  - Large heading: "Choose Your Language"
  - Scrollable card list of languages (native script labels)
  - Each language card: white background, 1px gray border, 12px radius, 56px min height
  - Selected state: maroon border (2px), maroon checkmark icon
  - "Continue" button pinned to bottom (maroon, full-width, 56px height)
- **Safe Area**: Top: insets.top + Spacing.xxl, Bottom: insets.bottom + Spacing.xl

#### 2. Home Screen (Chat Interface)
- **Purpose**: Primary vaccine Q&A via AI chatbot
- **Layout**:
  - **Header**: Transparent, white text/icons
    - App logo (lotus, 28px) centered
    - Language switcher (globe icon) top-right
  - **Main Content**: 
    - White background with subtle gradient (white to beige)
    - Inverted ScrollView for messages
    - **Welcome State** (no messages yet):
      - Large welcome heading: "How can I help you today?"
      - 3 gradient cards with vaccine topics (maroon to lighter maroon gradients):
        - "Baby Vaccines" with icon
        - "Vaccine Safety" with icon  
        - "Vaccination Centers" with icon
      - 4-6 suggestion chips below cards: "What vaccines do babies need?", "Is MMR safe?", etc.
    - **Active Chat**:
      - User messages: Maroon background, white text, right-aligned, rounded (left corners sharp)
      - Bot messages: White cards with subtle shadow, black text, left-aligned, rounded (right corners sharp)
      - Bot messages include:
        - Confidence badge (top-right: High/Medium/Low with colored dot)
        - "Listen" button (speaker icon, beige background)
        - "Sources" link (underlined, small gray text)
  - **Chat Input**: Fixed at bottom
    - White card with shadow, beige border (1px)
    - Text input placeholder in gray
    - Maroon send button (arrow icon, circular, 44px)
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + 90px + Spacing.xl

#### 3. Resources Screen
- **Purpose**: Browse curated vaccine resources
- **Layout**:
  - **Header**: White background, search bar integrated
    - "Resources" title (bold, 28pt)
    - Search input with light gray background, rounded
  - **Main Content**: White background, scrollable
    - Section headers: Maroon text, 22pt semibold, Spacing.xl top margin
    - Resource cards (white, subtle shadow, 12px radius):
      - Source badge (WHO/MOH with colored dot, top-right)
      - Title (18pt bold)
      - Summary (16pt regular, gray, 2-3 lines)
      - Publish date + bookmark icon (bottom row)
      - Card spacing: Spacing.lg between cards
  - FAB: Maroon circle with white "+" icon
    - Shadow: width: 0, height: 4, opacity: 0.15, radius: 8
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl + 72px

#### 4. Saved Screen
- **Purpose**: Bookmarks and chat history
- **Layout**:
  - **Header**: White background with segmented control
    - "Bookmarks" | "Chat History" tabs (maroon active state)
  - **Main Content**: White background
    - Card-based list (same style as Resources)
    - Swipe-to-delete with maroon delete button
    - Empty state: Large icon, "No saved items yet" text (gray)
  - FAB: Same as Resources
- **Safe Area**: Same as Resources

#### 5. Settings Screen
- **Purpose**: Configure app preferences
- **Layout**:
  - **Header**: White background, "Settings" title, back button
  - **Main Content**: White background, scrollable form
    - Grouped sections with white cards:
      - **Language**: Current selection, chevron right
      - **Offline Content**: Toggle switches per language, storage indicator
      - **Privacy**: Consent toggle, policy links
      - **About**: Version, credits
    - Card spacing: Spacing.lg between groups
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl

#### 6. Source Citation Modal
- **Purpose**: Display chatbot source references
- **Layout**:
  - Native bottom sheet modal
  - White background, rounded top (24px radius)
  - "Sources" title, close button (X) top-right
  - Scrollable list of source cards
  - Each source: Title (bold), citation, external link icon
- **Safe Area**: Top: Spacing.lg, Bottom: insets.bottom + Spacing.lg

## Design System

### Color Palette
- **Primary Maroon**: `#800020` - CTAs, active states, accents
- **Beige**: `#F5F5DC` - Secondary backgrounds, subtle accents
- **White**: `#FFFFFF` - Primary backgrounds, surfaces
- **Grays**:
  - Text: `#1A1A1A` (primary), `#6B6B6B` (secondary), `#9E9E9E` (tertiary)
  - Borders: `#E5E5E5` (dividers), `#F5F5F5` (subtle backgrounds)
- **System**:
  - Success: `#10B981` (high confidence)
  - Warning: `#F59E0B` (medium confidence)
  - Error: `#EF4444` (low confidence)

### Typography
- **Font**: SF Pro (iOS) / Roboto (Android)
- **Scale**:
  - H1: 28pt Bold - Screen titles
  - H2: 22pt Semibold - Section headers
  - H3: 18pt Semibold - Card titles
  - Body: 16pt Regular - Main content
  - Caption: 14pt Regular - Metadata
  - Small: 12pt Regular - Disclaimers
- **Line Height**: 1.5x for body, 1.3x for headings
- **Letter Spacing**: -0.5px for headings, 0px for body

### Spacing & Cards
- **Spacing Scale**: xs:4, sm:8, md:12, lg:16, xl:24, xxl:32
- **Card Design**:
  - Background: White
  - Border: 1px solid #E5E5E5 (or no border with shadow)
  - Shadow: {width:0, height:2, opacity:0.08, radius:8}
  - Radius: 12px standard, 24px for input fields
  - Padding: lg (16px) internal
- **Touch Targets**: Minimum 44x44pt (iOS) / 48x48dp (Android)

### Icons & Assets
- **Icons**: Feather Icons (@expo/vector-icons)
- **Logo**: Maroon lotus SVG (32px header, 48px language selection)
- **Confidence Badges**: Colored dot + text
  - High: Green dot, gray text
  - Medium: Orange dot, gray text
  - Low: Red dot, gray text
- **No custom illustrations** - System icons only

### Interaction Design
- **Touchable Feedback**: 0.7 opacity on press (cards, buttons, chips)
- **FAB Shadow**: {width:0, height:4, opacity:0.15, radius:8}
- **Loading**: Skeleton screens (gray shimmer) for lists, typing dots (3 animated) for chat
- **Haptics**: Light on button press, medium on message send
- **Animations**:
  - Screen transitions: 300ms ease-in-out
  - Modal presentation: 400ms spring
  - Message appear: 200ms fade + slide up
  - Card hover: 150ms scale (1.0 → 0.98)

### Accessibility
- **Contrast**: 4.5:1 minimum for body text, 3:1 for large text
- **VoiceOver/TalkBack**: All interactive elements labeled in selected language
- **Text-to-Speech**: "Listen" button on bot messages and resources
- **Reduce Motion**: Respect system preference, disable animations
- **Dynamic Type**: Support system font scaling

### Offline & Safety
- **Offline Indicator**: Yellow banner at top ("Offline mode - cached content")
- **Downloaded Content**: Cloud checkmark icon on cached resources
- **Misinformation Warning**: Red alert card with exclamation icon, contact info for health facility
- **Source Attribution**: All bot messages show "Sources: WHO, Kenya MOH" with tap-to-expand