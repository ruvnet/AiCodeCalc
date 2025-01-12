# AiCodeCalc Component Specification

## Component Architecture

The application follows atomic design principles, organizing components into atoms, molecules, organisms, templates, and pages.

## Core Components

### Layout Components

#### AppLayout
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}
```
- Main application wrapper
- Handles responsive container
- Applies global styles
- Manages navigation state

#### NavigationBar
```typescript
interface NavigationBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}
```
- Responsive top navigation
- Tab switching logic
- Progress indication
- Mobile menu handling

### Calculator Components

#### ProjectSetupForm
```typescript
interface ProjectSetupProps {
  onSubmit: (data: ProjectSetupData) => void;
  initialData?: ProjectSetupData;
}

interface ProjectSetupData {
  projectName: string;
  totalLoc: number;
  complexity: ComplexityLevel;
  timeline: number;
}
```
- Project name input
- Lines of code counter
- Complexity selector
- Timeline configuration

#### LLMConfigurationPanel
```typescript
interface LLMConfigProps {
  models: LLMModel[];
  onModelChange: (models: LLMModel[]) => void;
}

interface LLMModel {
  id: string;
  name: string;
  inputCost: number;
  outputCost: number;
  usageFraction: number;
}
```
- Model selection
- Cost configuration
- Token distribution
- Usage allocation

#### OverheadCalculator
```typescript
interface OverheadProps {
  factors: OverheadFactors;
  onChange: (factors: OverheadFactors) => void;
}

interface OverheadFactors {
  iteration: number;
  retry: number;
  bugFix: number;
  testing: number;
}
```
- Overhead sliders
- Real-time preview
- Factor explanations
- Composite calculation

#### HumanComparisonPanel
```typescript
interface HumanComparisonProps {
  metrics: HumanMetrics;
  onChange: (metrics: HumanMetrics) => void;
}

interface HumanMetrics {
  hourlyRate: number;
  locPerDay: number;
  errorRate: number;
  teamSize: number;
}
```
- Developer metrics input
- Cost comparison
- Timeline estimation
- Team size configuration

#### ResultsDashboard
```typescript
interface ResultsProps {
  calculations: CalculationResults;
  exportOptions: ExportOption[];
}

interface CalculationResults {
  llmCosts: ModelCosts[];
  humanCosts: HumanCosts;
  timeline: TimelineComparison;
  savings: CostSavings;
}
```
- Cost breakdown
- Comparative charts
- Export functionality
- Summary metrics

### UI Components

#### InputField
```typescript
interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number';
  error?: string;
  hint?: string;
}
```
- Styled input container
- Label handling
- Error states
- Helper text

#### Slider
```typescript
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  tooltip?: boolean;
}
```
- Custom track styling
- Interactive thumb
- Value tooltip
- Label integration

#### Card
```typescript
interface CardProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlighted';
  className?: string;
}
```
- Container styling
- Title handling
- Content wrapper
- Variant support

#### Chart
```typescript
interface ChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'pie';
  options?: ChartOptions;
}

interface ChartData {
  label: string;
  value: number;
  color?: string;
}
```
- Multiple chart types
- Responsive sizing
- Custom styling
- Interactive tooltips

## Shared Components

#### LoadingSpinner
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}
```
- Animated spinner
- Size variants
- Color customization

#### ErrorBoundary
```typescript
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}
```
- Error catching
- Fallback UI
- Error reporting

#### Tooltip
```typescript
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}
```
- Positioned tooltip
- Content rendering
- Show/hide logic

## Component Organization

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   └── NavigationBar.tsx
│   │
│   ├── calculator/
│   │   ├── ProjectSetupForm.tsx
│   │   ├── LLMConfigurationPanel.tsx
│   │   ├── OverheadCalculator.tsx
│   │   ├── HumanComparisonPanel.tsx
│   │   └── ResultsDashboard.tsx
│   │
│   ├── ui/
│   │   ├── InputField.tsx
│   │   ├── Slider.tsx
│   │   ├── Card.tsx
│   │   └── Chart.tsx
│   │
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── Tooltip.tsx
```

## Component Guidelines

### 1. Props Interface
- Every component must have a defined props interface
- Use TypeScript for type safety
- Document all props with JSDoc comments

### 2. Error Handling
- Implement error boundaries where appropriate
- Provide fallback UI for error states
- Log errors for debugging

### 3. Performance
- Use React.memo for expensive renders
- Implement useMemo and useCallback hooks
- Avoid unnecessary re-renders

### 4. Accessibility
- Include ARIA labels
- Support keyboard navigation
- Maintain focus management

### 5. Testing
- Write unit tests for all components
- Include integration tests for complex flows
- Test accessibility compliance

### 6. Documentation
- Include component stories
- Document props and usage
- Provide examples

## State Management

### 1. Local State
- Use useState for component-specific state
- Implement useReducer for complex state
- Handle form state with React Hook Form

### 2. Global State
- Use React Context for shared state
- Implement custom hooks for state access
- Handle persistence with local storage

### 3. Side Effects
- Manage with useEffect hook
- Clean up subscriptions
- Handle async operations

## Component Communication

### 1. Props Drilling
- Limit to 2-3 levels
- Use Context for deeper hierarchies
- Implement compound components

### 2. Event Handling
- Consistent naming conventions
- Type-safe event handlers
- Debounce when necessary

### 3. Refs
- Use for DOM manipulation
- Handle focus management
- Implement forwarded refs

## Styling Guidelines

### 1. CSS Modules
- Scoped styling
- Consistent naming
- Theme variables

### 2. Tailwind Classes
- Utility-first approach
- Custom extensions
- Responsive design

### 3. CSS-in-JS
- Styled components
- Dynamic styling
- Theme integration
