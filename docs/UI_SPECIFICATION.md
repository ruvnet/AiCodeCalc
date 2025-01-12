# AiCodeCalc UI Specification

## Design Philosophy

The UI follows a dark hacker-style aesthetic with a focus on:
- Clean, minimalist design
- High contrast for readability
- Neon accent colors
- Mobile-first responsive layout
- Professional and technical feel

## Color Palette

```css
:root {
  /* Base Colors */
  --background-primary: #0a0a0a;
  --background-secondary: #121212;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  
  /* Accent Colors */
  --accent-primary: #00ff9d;    /* Neon Green */
  --accent-secondary: #0066ff;  /* Electric Blue */
  --accent-warning: #ff3e00;    /* Warning Red */
  
  /* UI Elements */
  --input-background: #1a1a1a;
  --border-color: #333333;
  --hover-color: #2a2a2a;
}
```

## Typography

- **Primary Font**: JetBrains Mono (for code-like aesthetic)
- **Secondary Font**: Inter (for general text)
- **Font Sizes**:
  - Headings: 2rem, 1.5rem, 1.25rem
  - Body: 1rem
  - Small Text: 0.875rem
  - Micro Text: 0.75rem

## Layout Structure

### Header
- Fixed position
- Height: 60px
- Contains: Logo, Navigation Menu, Theme Toggle

### Main Navigation
- Tab-based navigation
- Mobile: Bottom navigation bar
- Desktop: Top horizontal tabs
- Progress indicator

### Content Area
- Centered container
- Max-width: 1200px
- Padding: 1rem (mobile), 2rem (desktop)
- Scrollable content

## Component Specifications

### 1. Input Fields
```css
/* Styling */
background: var(--input-background);
border: 1px solid var(--border-color);
border-radius: 4px;
padding: 0.75rem;
color: var(--text-primary);
```

### 2. Sliders
- Track height: 4px
- Thumb size: 16px
- Active state: Neon glow effect
- Value tooltip on hover

### 3. Buttons
```css
/* Primary Button */
background: var(--accent-primary);
color: var(--background-primary);
padding: 0.75rem 1.5rem;
border-radius: 4px;
font-weight: 500;

/* Secondary Button */
background: transparent;
border: 1px solid var(--accent-primary);
color: var(--accent-primary);
```

### 4. Cards
- Background: var(--background-secondary)
- Border radius: 8px
- Box shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
- Padding: 1.5rem

### 5. Charts
- Grid lines: var(--border-color)
- Data points: var(--accent-primary)
- Tooltips: Dark background with high contrast text
- Responsive sizing

## Page-Specific Layouts

### 1. Project Setup Tab
```
┌─────────────────────────┐
│ Project Name            │
├─────────────────────────┤
│ Total Lines of Code     │
├─────────────────────────┤
│ Language Complexity     │
├─────────────────────────┤
│ Timeline                │
└─────────────────────────┘
```

### 2. LLM Parameters Tab
```
┌─────────────────────────┐
│ Model Selection         │
├─────────────────────────┤
│ Cost Configuration      │
├─────────────────────────┤
│ Token Distribution      │
└─────────────────────────┘
```

### 3. Overheads Tab
```
┌─────────────────────────┐
│ Overhead Sliders        │
├─────────────────────────┤
│ Real-time Preview       │
└─────────────────────────┘
```

### 4. Human Comparison Tab
```
┌─────────────────────────┐
│ Developer Metrics       │
├─────────────────────────┤
│ Cost Comparison Chart   │
└─────────────────────────┘
```

### 5. Results Tab
```
┌─────────────────────────┐
│ Summary Cards           │
├─────────────────────────┤
│ Detailed Charts         │
├─────────────────────────┤
│ Export Options          │
└─────────────────────────┘
```

## Responsive Breakpoints

```css
/* Mobile First Approach */
/* Base styles are for mobile */

/* Tablet (640px) */
@media (min-width: 40em) {
  /* Tablet-specific styles */
}

/* Laptop (1024px) */
@media (min-width: 64em) {
  /* Desktop-specific styles */
}

/* Desktop (1280px) */
@media (min-width: 80em) {
  /* Large screen styles */
}
```

## Interactive Elements

### Hover States
- Subtle background color change
- Transition duration: 200ms
- Scale transform: 1.02 for clickable elements

### Focus States
- Neon glow effect
- High contrast outline
- Keyboard navigation support

### Active States
- Scale transform: 0.98
- Color intensity increase

## Loading States

### Skeletons
- Pulse animation
- Matching component dimensions
- Subtle gradient

### Progress Indicators
- Circular spinner for operations
- Linear progress for steps
- Color: var(--accent-primary)

## Error States

### Input Validation
- Red border highlight
- Error message below input
- Icon indicator

### System Errors
- Modal dialog
- Clear error message
- Recovery action button

## Animations

### Transitions
- Duration: 200ms - 300ms
- Timing function: ease-in-out
- Properties: opacity, transform

### Micro-interactions
- Button clicks
- Hover effects
- Focus transitions
- Tab switching

## Accessibility

### Color Contrast
- Meet WCAG 2.1 AA standards
- Minimum contrast ratio: 4.5:1
- Test all color combinations

### Keyboard Navigation
- Visible focus indicators
- Logical tab order
- Keyboard shortcuts

### Screen Readers
- ARIA labels
- Role attributes
- Meaningful alt text
- Skip links

## Mobile Optimizations

### Touch Targets
- Minimum size: 44x44px
- Adequate spacing
- Clear hit states

### Gestures
- Swipe between tabs
- Pull to refresh
- Pinch to zoom charts

### Performance
- Optimized images
- Minimal animations
- Efficient rendering
