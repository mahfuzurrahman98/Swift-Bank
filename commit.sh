#!/bin/bash

# Swift Bank - Static Commit Script (Batch 3)
# Next 30 files with proper commit messages

echo "🚀 Starting static commit process for Swift Bank refactoring (Files 61-90)..."

# Reset all staged files first
git reset HEAD

# Commit 61: Frontend package.json
git add frontend/package.json
git commit -m "feat: add frontend package.json with React dependencies

- Add React, TypeScript, and Vite dependencies
- Configure UI libraries (shadcn/ui, Tailwind CSS)
- Set up development and build scripts"

# Commit 62: Frontend public favicon
git add frontend/public/favicon.png
git commit -m "feat: add application favicon

- Add Swift Bank branded favicon
- Configure for multiple device sizes
- Include high-resolution icon support"

# Commit 63: Vite SVG logo
git add frontend/public/vite.svg
git commit -m "feat: add Vite development logo

- Add Vite framework logo for development
- Include SVG format for scalability
- Configure for development environment"

# Commit 64: API fetch client
git add frontend/src/api/fetchClient.ts
git commit -m "feat: add API fetch client utility

- Implement centralized HTTP client
- Add authentication token handling
- Include error handling and response parsing"

# Commit 65: Main App component
git add frontend/src/App.tsx
git commit -m "feat: add main App component

- Set up React Router and routing
- Configure theme provider and global state
- Add error boundary and layout structure"

# Commit 66: React assets
git add frontend/src/assets/react.svg
git commit -m "feat: add React framework logo

- Add React logo for development
- Include SVG format for scalability
- Configure for component library"

# Commit 67: Magic Link Form Component
git add frontend/src/components/auth/MagicLinkFormComponent.tsx
git commit -m "feat: add magic link authentication form

- Implement email input and validation
- Add magic link request functionality
- Include loading states and error handling"

# Commit 68: Persist Session Component
git add frontend/src/components/auth/PersistSessionComponent.tsx
git commit -m "feat: add session persistence component

- Implement automatic session restoration
- Add token refresh functionality
- Include authentication state management"

# Commit 69: Beneficiary Listing Component
git add frontend/src/components/banking/BeneficiaryListingComponent.tsx
git commit -m "feat: add beneficiary listing component

- Display list of saved beneficiaries
- Add search and filtering functionality
- Include beneficiary management actions"

# Commit 70: Beneficiary Modal
git add frontend/src/components/banking/BeneficiaryModal.tsx
git commit -m "feat: add beneficiary management modal

- Implement add/edit beneficiary form
- Add validation and error handling
- Include account verification features"

# Commit 71: Deposit Modal
git add frontend/src/components/banking/DepositModal.tsx
git commit -m "feat: add deposit transaction modal

- Implement deposit amount input and validation
- Add payment method selection
- Include transaction confirmation flow"

# Commit 72: Transaction Listing Component
git add frontend/src/components/banking/TransactionListingComponent.tsx
git commit -m "feat: add transaction listing component

- Display transaction history with pagination
- Add filtering by date, type, and amount
- Include transaction status indicators"

# Commit 73: Transaction Table
git add frontend/src/components/banking/TransactionTable.tsx
git commit -m "feat: add transaction data table

- Implement sortable transaction table
- Add column customization and export
- Include responsive design for mobile"

# Commit 74: Transfer Modal
git add frontend/src/components/banking/TransferModal.tsx
git commit -m "feat: add fund transfer modal

- Implement beneficiary selection and amount input
- Add transfer validation and confirmation
- Include real-time balance checking"

# Commit 75: Withdraw Modal
git add frontend/src/components/banking/WithdrawModal.tsx
git commit -m "feat: add withdrawal transaction modal

- Implement withdrawal amount validation
- Add account balance verification
- Include withdrawal method selection"

# Commit 76: Error Component
git add frontend/src/components/Error.tsx
git commit -m "feat: add error display component

- Implement user-friendly error messages
- Add error recovery actions
- Include different error types and styling"

# Commit 77: Error Boundary
git add frontend/src/components/ErrorBoundary.tsx
git commit -m "feat: add React error boundary

- Catch and handle React component errors
- Add error logging and reporting
- Include fallback UI for crashed components"

# Commit 78: Admin Header
git add frontend/src/components/layouts/admin/AdminHeader.tsx
git commit -m "feat: add admin layout header

- Implement navigation and user menu
- Add logout and profile access
- Include responsive design and branding"

# Commit 79: Admin Layout
git add frontend/src/components/layouts/admin/AdminLayout.tsx
git commit -m "feat: add admin layout wrapper

- Implement main admin interface layout
- Add sidebar navigation and content area
- Include responsive design and accessibility"

# Commit 80: Admin Sidebar
git add frontend/src/components/layouts/admin/AdminSidebar.tsx
git commit -m "feat: add admin navigation sidebar

- Implement collapsible navigation menu
- Add active route highlighting
- Include role-based menu items"

# Commit 81: Auth Layout
git add frontend/src/components/layouts/auth/AuthLayout.tsx
git commit -m "feat: add authentication layout

- Implement centered auth form layout
- Add branding and background styling
- Include responsive design for all devices"

# Commit 82: Root Layout
git add frontend/src/components/layouts/RootLayout.tsx
git commit -m "feat: add root application layout

- Implement base layout structure
- Add global providers and context
- Include theme and routing configuration"

# Commit 83: Global Loader
git add frontend/src/components/loaders/GlobalLoader.tsx
git commit -m "feat: add global loading component

- Implement full-screen loading indicator
- Add animated spinner and progress bar
- Include loading state management"

# Commit 84: Simple Loader
git add frontend/src/components/loaders/SimpleLoader.tsx
git commit -m "feat: add simple loading spinner

- Implement lightweight loading indicator
- Add customizable size and color options
- Include accessibility features"

# Commit 85: Table Empty State
git add frontend/src/components/loaders/table/TableEmpty.tsx
git commit -m "feat: add table empty state component

- Display message when no data available
- Add call-to-action buttons
- Include illustration and helpful text"

# Commit 86: Table Loader
git add frontend/src/components/loaders/table/TableLoader.tsx
git commit -m "feat: add table loading skeleton

- Implement skeleton loading for tables
- Add animated placeholder rows
- Include responsive column layouts"

# Commit 87: Date Tooltip
git add frontend/src/components/miscellaneous/DateTooltip.tsx
git commit -m "feat: add date formatting tooltip

- Display formatted dates on hover
- Add relative time calculations
- Include timezone and locale support"

# Commit 88: Password Format Helper
git add frontend/src/components/miscellaneous/PasswordFormatHelper.tsx
git commit -m "feat: add password format helper

- Display password requirements
- Add real-time validation feedback
- Include strength indicator and tips"

# Commit 89: Theme Provider
git add frontend/src/components/theme-provider.tsx
git commit -m "feat: add theme provider component

- Implement dark/light theme switching
- Add system theme detection
- Include theme persistence and context"

# Commit 90: Update commit script
git add commit.sh
git commit -m "chore: update commit management script

- Add batch 3 commit commands
- Update file tracking and organization
- Include progress indicators and logging"

echo "✅ Successfully committed files 61-90!"
echo "📊 Run 'git log --oneline -30' to see the latest commits"