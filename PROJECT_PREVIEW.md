# Jenga Nation - Project Preview

## Overview
Jenga Nation is a React-based community engagement platform for African regions, allowing users to report issues, participate in polls, and contribute to community projects.

## Current Project Structure
```
jenga-nation/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Card.tsx          # Reusable card components
│   │   │   └── Input.tsx         # Input component
│   │   ├── Auth.tsx              # Authentication screen
│   │   ├── BottomNav.tsx         # Bottom navigation
│   │   ├── DevQuickAccess.tsx    # Development tools
│   │   ├── FloatingActions.tsx   # Floating action button
│   │   ├── Home.tsx              # Main dashboard
│   │   ├── RegionSelector.tsx    # Region selection
│   │   ├── ReportIssue.tsx       # Issue reporting form
│   │   └── utils.ts              # Component utilities
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── utils/
│   │   ├── mockData.ts           # Sample data for development
│   │   └── utils.ts              # Utility functions
│   ├── App.tsx                   # Main application component
│   ├── index.tsx                 # Application entry point
│   └── App.css                   # Styling
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
└── postcss.config.js            # PostCSS configuration
```

## Key Features Implemented

### 1. Multi-Screen Navigation
- **Home Screen**: Welcome dashboard with quick actions
- **Authentication**: User login/registration flow
- **Region Selection**: Choose from African countries (Kenya, Tanzania, Uganda, Rwanda, etc.)
- **Issue Reporting**: Form to report community issues
- **Navigation**: Bottom navigation bar and floating action buttons

### 2. Component Architecture
- **Modular Design**: Reusable UI components (Card, Input, etc.)
- **TypeScript Support**: Full type safety with custom interfaces
- **Error Handling**: Try-catch blocks and user feedback
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### 3. Data Structure
- **User Management**: User profiles with levels, points, and badges
- **Issue Tracking**: Community issues with status, location, and voting
- **Projects**: Community development projects with funding goals
- **Polls**: Democratic decision-making tools
- **Regional Data**: Multi-country support with county-level detail

### 4. Technology Stack
- **Frontend**: React 19.2.0 with TypeScript
- **Styling**: Tailwind CSS 4.1.17 with custom theme
- **Icons**: Lucide React for consistent iconography
- **Testing**: Jest and React Testing Library
- **Build Tool**: Create React App

## Custom Theme Configuration
```javascript
// Tailwind theme extensions
colors: {
  'jenga-blue': '#2563eb',
  'jenga-green': '#16a34a',
  'jenga-red': '#ef4444',
  'jenga-orange': '#f97316',
  'jenga-purple': '#9333ea',
}
borderRadius: {
  'jenga': '20px',
  'jenga-lg': '30px',
}
```

## Sample Data Included
- **8 African Regions**: Kenya, Tanzania, Uganda, Rwanda, Ethiopia, Nigeria, South Africa, Ghana
- **Mock Issues**: Infrastructure, water, education categories
- **Community Projects**: Water initiatives, school libraries, healthcare clinics
- **User Badges**: Achievement system with progress tracking
- **Polls**: Democratic voting on community priorities

## Current Status
✅ **Completed:**
- Basic project structure and navigation
- Core components and screens
- TypeScript type definitions
- Mock data for development
- Tailwind CSS configuration
- Error handling implementation

⚠️ **In Progress:**
- PostCSS configuration fix needed
- Server startup (Tailwind CSS plugin issue)

🔄 **Next Steps:**
- Fix Tailwind CSS PostCSS plugin
- Add more interactive features
- Implement data persistence
- Add map integration
- Enhance UI/UX design

## How to Run
```bash
cd jenga-nation
npm install
npm start  # Will open http://localhost:3000
```

## Key Files to Review
1. `src/App.tsx` - Main application logic
2. `src/types/index.ts` - Data structure definitions
3. `src/utils/mockData.ts` - Sample data
4. `src/components/Home.tsx` - Main dashboard
5. `tailwind.config.js` - Custom styling theme

## Screenshots/Demo
The app features a clean, mobile-first design with:
- Gradient backgrounds (slate to blue to green)
- Card-based layouts
- Intuitive navigation
- African-focused regional selection
- Community-driven issue reporting

This is a solid foundation for a community engagement platform focused on African regions, with room for expansion into features like real-time updates, government integration, and advanced analytics.