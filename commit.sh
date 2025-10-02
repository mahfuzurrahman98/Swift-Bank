#!/bin/bash

# Swift Bank - Static Commit Script (Batch 4)
# Next 40 files with proper commit messages

echo "🚀 Starting static commit process for Swift Bank refactoring (Files 91-130)..."

# Reset all staged files first
git reset HEAD

# Commit 91: Alert Dialog UI Component
git add frontend/src/components/ui/alert-dialog.tsx
git commit -m "feat: add alert dialog UI component

- Implement modal confirmation dialogs
- Add customizable actions and styling
- Include accessibility and keyboard navigation"

# Commit 92: Alert UI Component
git add frontend/src/components/ui/alert.tsx
git commit -m "feat: add alert notification component

- Display success, error, and warning messages
- Add dismissible and persistent alert types
- Include icon support and custom styling"

# Commit 93: Avatar UI Component
git add frontend/src/components/ui/avatar.tsx
git commit -m "feat: add avatar display component

- Show user profile pictures and initials
- Add fallback handling and size variants
- Include rounded and square avatar styles"

# Commit 94: Badge UI Component
git add frontend/src/components/ui/badge.tsx
git commit -m "feat: add badge indicator component

- Display status indicators and labels
- Add color variants and size options
- Include notification badges and counters"

# Commit 95: Button UI Component
git add frontend/src/components/ui/button.tsx
git commit -m "feat: add button UI component

- Implement primary, secondary, and ghost variants
- Add loading states and disabled handling
- Include size variants and icon support"

# Commit 96: Calendar UI Component
git add frontend/src/components/ui/calendar.tsx
git commit -m "feat: add calendar date picker component

- Implement month and year navigation
- Add date selection and range picking
- Include disabled dates and custom styling"

# Commit 97: Card UI Component
git add frontend/src/components/ui/card.tsx
git commit -m "feat: add card container component

- Create structured content containers
- Add header, body, and footer sections
- Include shadow variants and hover effects"

# Commit 98: Collapsible UI Component
git add frontend/src/components/ui/collapsible.tsx
git commit -m "feat: add collapsible content component

- Implement expandable content sections
- Add smooth animations and transitions
- Include trigger and content area management"

# Commit 99: Custom Alert Message
git add frontend/src/components/ui/custom/alert-message.tsx
git commit -m "feat: add custom alert message component

- Enhanced alert with banking-specific styling
- Add transaction status indicators
- Include custom icons and color schemes"

# Commit 100: Autocomplete Input
git add frontend/src/components/ui/custom/autocomplete-input.tsx
git commit -m "feat: add autocomplete input component

- Implement search with suggestions
- Add beneficiary and account autocomplete
- Include keyboard navigation and filtering"

# Commit 101: Date Picker
git add frontend/src/components/ui/custom/date-picker.tsx
git commit -m "feat: add custom date picker component

- Banking-specific date selection
- Add transaction date filtering
- Include preset date ranges and validation"

# Commit 102: Form Description with Message
git add frontend/src/components/ui/custom/form-description-with-message.tsx
git commit -m "feat: add form description component

- Enhanced form field descriptions
- Add validation message display
- Include help text and error states"

# Commit 103: Mode Toggle Small
git add frontend/src/components/ui/custom/mode-toggle-sm.tsx
git commit -m "feat: add small mode toggle component

- Compact dark/light theme switcher
- Add icon-only toggle variant
- Include accessibility and keyboard support"

# Commit 104: Mode Toggle
git add frontend/src/components/ui/custom/mode-toggle.tsx
git commit -m "feat: add theme mode toggle component

- Full-featured dark/light theme switcher
- Add system theme detection
- Include smooth theme transitions"

# Commit 105: Multi Select
git add frontend/src/components/ui/custom/multi-select.tsx
git commit -m "feat: add multi-select component

- Select multiple options from list
- Add tag display and removal
- Include search and filtering capabilities"

# Commit 106: OTP Input
git add frontend/src/components/ui/custom/otp-input.tsx
git commit -m "feat: add OTP input component

- Secure one-time password entry
- Add auto-focus and paste handling
- Include validation and error states"

# Commit 107: Phone Input
git add frontend/src/components/ui/custom/phone-input.tsx
git commit -m "feat: add phone number input component

- International phone number formatting
- Add country code selection
- Include validation and formatting"

# Commit 108: Status Badge
git add frontend/src/components/ui/custom/status-badge.tsx
git commit -m "feat: add status badge component

- Banking-specific status indicators
- Add transaction and account status
- Include color coding and icons"

# Commit 109: Toast Chat Message
git add frontend/src/components/ui/custom/toast-chat-message.tsx
git commit -m "feat: add toast chat message component

- Banking notification toasts
- Add transaction alerts and confirmations
- Include action buttons and dismissal"

# Commit 110: Dialog UI Component
git add frontend/src/components/ui/dialog.tsx
git commit -m "feat: add dialog modal component

- Implement modal dialogs and overlays
- Add close handling and backdrop click
- Include animation and focus management"

# Commit 111: Dropdown Menu UI Component
git add frontend/src/components/ui/dropdown-menu.tsx
git commit -m "feat: add dropdown menu component

- Implement contextual menus and actions
- Add keyboard navigation and positioning
- Include separators and menu groups"

# Commit 112: Form UI Component
git add frontend/src/components/ui/form.tsx
git commit -m "feat: add form validation component

- React Hook Form integration
- Add field validation and error display
- Include form state management"

# Commit 113: Input UI Component
git add frontend/src/components/ui/input.tsx
git commit -m "feat: add input field component

- Styled text input with variants
- Add validation states and icons
- Include placeholder and label support"

# Commit 114: Label UI Component
git add frontend/src/components/ui/label.tsx
git commit -m "feat: add form label component

- Accessible form field labels
- Add required field indicators
- Include error and help text styling"

# Commit 115: Popover UI Component
git add frontend/src/components/ui/popover.tsx
git commit -m "feat: add popover tooltip component

- Floating content containers
- Add positioning and arrow indicators
- Include click and hover triggers"

# Commit 116: Select UI Component
git add frontend/src/components/ui/select.tsx
git commit -m "feat: add select dropdown component

- Styled select with custom options
- Add search and multi-select variants
- Include validation and placeholder support"

# Commit 117: Separator UI Component
git add frontend/src/components/ui/separator.tsx
git commit -m "feat: add separator divider component

- Visual content separators
- Add horizontal and vertical variants
- Include spacing and styling options"

# Commit 118: Sheet UI Component
git add frontend/src/components/ui/sheet.tsx
git commit -m "feat: add sheet slide-out component

- Side panel and drawer implementation
- Add slide animations and positioning
- Include backdrop and close handling"

# Commit 119: Sidebar UI Component
git add frontend/src/components/ui/sidebar.tsx
git commit -m "feat: add sidebar navigation component

- Collapsible navigation sidebar
- Add menu items and active states
- Include responsive behavior and icons"

# Commit 120: Skeleton UI Component
git add frontend/src/components/ui/skeleton.tsx
git commit -m "feat: add skeleton loading component

- Animated loading placeholders
- Add various shape and size variants
- Include shimmer effects and customization"

# Commit 121: Table UI Component
git add frontend/src/components/ui/table.tsx
git commit -m "feat: add data table component

- Structured data display tables
- Add sorting and pagination support
- Include responsive and accessible design"

# Commit 122: Tooltip UI Component
git add frontend/src/components/ui/tooltip.tsx
git commit -m "feat: add tooltip hover component

- Contextual help and information tooltips
- Add positioning and delay options
- Include keyboard accessibility support"

# Commit 123: Mobile Hook
git add frontend/src/hooks/use-mobile.ts
git commit -m "feat: add mobile detection hook

- Detect mobile and tablet devices
- Add responsive breakpoint handling
- Include window resize event listening"

# Commit 124: Theme Hook
git add frontend/src/hooks/use-theme.tsx
git commit -m "feat: add theme management hook

- Dark/light theme state management
- Add system theme preference detection
- Include theme persistence and switching"

# Commit 125: Main CSS Styles
git add frontend/src/index.css
git commit -m "feat: add main application styles

- Tailwind CSS base styles and utilities
- Add custom banking theme variables
- Include responsive design and animations"

# Commit 126: Utility Functions
git add frontend/src/lib/utils.ts
git commit -m "feat: add utility functions library

- Common helper functions and utilities
- Add class name merging and formatting
- Include validation and data manipulation"

# Commit 127: Main Entry Point
git add frontend/src/main.tsx
git commit -m "feat: add React application entry point

- Initialize React app with providers
- Add router and theme configuration
- Include error boundary and global setup"

# Commit 128: Landing Page
git add frontend/src/pages/Page.tsx
git commit -m "feat: add landing page component

- Main application landing page
- Add hero section and feature highlights
- Include call-to-action and navigation"

# Commit 129: Test Page
git add frontend/src/pages/TestPage.tsx
git commit -m "feat: add test page component

- Development testing and debugging page
- Add component showcase and examples
- Include feature testing and validation"

# Commit 130: Update commit script
git add commit.sh
git commit -m "chore: update commit management script

- Add batch 4 with 40 commit commands
- Update file tracking and organization
- Include enhanced progress indicators"

echo "✅ Successfully committed files 91-130!"
echo "📊 Run 'git log --oneline -40' to see the latest commits"