# Jenga Nation - Visual Demo Guide

## App Flow Demonstration

### 1. Welcome/Home Screen
```
┌─────────────────────────────────┐
│  Welcome, Sarah!                │
│                                 │
│  ┌─────────────────────────────┐ │
│  │     Quick Actions           │ │
│  │                             │ │
│  │  [Report an Issue]          │ │
│  │  [View Profile]             │ │
│  │                             │ │
│  └─────────────────────────────┘ │
│                                 │
│  ┌─────────────────────────────┐ │
│  │ [Home] [Report] [Profile]   │ │ ← Bottom Nav
│  └─────────────────────────────┘ │
│                            [+]  │ ← Floating Action
└─────────────────────────────────┘
```

### 2. Region Selection Screen
```
┌─────────────────────────────────┐
│  Select Your Region             │
│                                 │
│  ┌─────────────────────────────┐ │
│  │  Kenya                      │ │
│  │  Tanzania                   │ │
│  │  Uganda                     │ │
│  │  Rwanda                     │ │
│  │  Ethiopia                   │ │
│  │  Nigeria                    │ │
│  │  South Africa               │ │
│  │  Ghana                      │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 3. Issue Reporting Form
```
┌─────────────────────────────────┐
│  ← Back    Report Issue         │
│                                 │
│  ┌─────────────────────────────┐ │
│  │ Title                       │ │
│  │ [________________]          │ │
│  │                             │ │
│  │ Description                 │ │
│  │ [________________]          │ │
│  │ [________________]          │ │
│  │ [________________]          │ │
│  │                             │ │
│  │    [Submit Report]          │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Key Visual Elements

### Color Scheme
- **Primary Blue**: #2563eb (jenga-blue)
- **Success Green**: #16a34a (jenga-green)  
- **Alert Red**: #ef4444 (jenga-red)
- **Warning Orange**: #f97316 (jenga-orange)
- **Accent Purple**: #9333ea (jenga-purple)

### Design Features
- **Gradient Background**: Subtle slate → blue → green gradient
- **Rounded Corners**: Custom 20px and 30px border radius
- **Card Layout**: White cards with soft shadows
- **Mobile-First**: Optimized for mobile devices
- **Clean Typography**: System fonts for readability

### Interactive Elements
- **Hover Effects**: Buttons darken on hover
- **Form Validation**: Required field indicators
- **Navigation**: Smooth screen transitions
- **Feedback**: Success/error messages
- **Loading States**: User feedback during actions

## Sample Data Preview

### Mock Issues
1. **Pothole on Main Street** (Infrastructure, Pending)
2. **Water Supply Issue** (Water, In Progress)  
3. **School Renovation** (Education, Resolved)

### Mock Projects
1. **Clean Water Initiative** (75% complete, $45K/$60K)
2. **School Library Project** (60% complete, $28K/$45K)
3. **Healthcare Clinic** (90% complete, $85K/$95K)

### User Profile
- **Name**: Sarah M.
- **Level**: 8
- **Points**: 450
- **Reports**: 12
- **Badges**: First Report, Community Hero, Super Voter

## Technical Highlights

### Component Structure
```
App.tsx
├── Auth.tsx (Login/Register)
├── RegionSelector.tsx (Country Selection)
├── Home.tsx (Dashboard)
├── ReportIssue.tsx (Issue Form)
├── BottomNav.tsx (Navigation)
├── FloatingActions.tsx (Quick Actions)
└── DevQuickAccess.tsx (Dev Tools)
```

### State Management
- Screen navigation with useState
- Form handling with controlled components
- Error boundaries for graceful failures
- Local state for user preferences

This represents a modern, accessible, and user-friendly community platform specifically designed for African regions with potential for significant social impact.