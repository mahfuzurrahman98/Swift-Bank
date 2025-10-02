#!/bin/bash

# Swift Bank - Static Commit Script (Batch 5)
# Next 40 files with proper commit messages

echo "🚀 Starting static commit process for Swift Bank refactoring (Files 131-170)..."

# Reset all staged files first
git reset HEAD

# Commit 131: Accepted File Types Data
git add frontend/src/lib/data/accepted-file-types.ts
git commit -m "feat: add accepted file types configuration

- Define allowed file extensions and MIME types
- Add file size limits and validation rules
- Include document and image type restrictions"

# Commit 132: Countries Data
git add frontend/src/lib/data/countries.json
git commit -m "feat: add countries data configuration

- Complete list of world countries with codes
- Add country names, ISO codes, and flags
- Include phone codes and currency information"

# Commit 133: Error Messages Data
git add frontend/src/lib/data/errors.ts
git commit -m "feat: add error messages configuration

- Centralized error message definitions
- Add banking-specific error codes
- Include user-friendly error descriptions"

# Commit 134: Predefined Steps Data
git add frontend/src/lib/data/predefine-steps.ts
git commit -m "feat: add predefined steps configuration

- Define onboarding and process steps
- Add step validation and progression rules
- Include step descriptions and requirements"

# Commit 135: Services Data
git add frontend/src/lib/data/services.ts
git commit -m "feat: add services configuration data

- Define available banking services
- Add service descriptions and features
- Include pricing and availability information"

# Commit 136: Sidebar Items Data
git add frontend/src/lib/data/sidebar-items.ts
git commit -m "feat: add sidebar navigation items

- Define navigation menu structure
- Add icons, routes, and permissions
- Include role-based menu visibility"

# Commit 137: Timezones Data
git add frontend/src/lib/data/timezones.ts
git commit -m "feat: add timezones configuration

- Complete list of world timezones
- Add UTC offsets and DST information
- Include timezone abbreviations and names"

# Commit 138: Magic Link Verify Page
git add frontend/src/pages/auth/MagicLinkVerifyPage.tsx
git commit -m "feat: add magic link verification page

- Handle magic link token verification
- Add success and error state handling
- Include automatic redirect after verification"

# Commit 139: Signin Page
git add frontend/src/pages/auth/SigninPage.tsx
git commit -m "feat: add signin page component

- Email-based authentication interface
- Add magic link request functionality
- Include form validation and error handling"

# Commit 140: Banking Dashboard Page
git add frontend/src/pages/banking/BankingDashboardPage.tsx
git commit -m "feat: add banking dashboard page

- Main banking interface with account overview
- Add balance display and recent transactions
- Include quick action buttons and widgets"

# Commit 141: Beneficiaries Page
git add frontend/src/pages/banking/BeneficiariesPage.tsx
git commit -m "feat: add beneficiaries management page

- List and manage saved beneficiaries
- Add beneficiary creation and editing
- Include search and filtering capabilities"

# Commit 142: Transactions Page
git add frontend/src/pages/banking/TransactionsPage.tsx
git commit -m "feat: add transactions history page

- Display transaction history with filtering
- Add export and search functionality
- Include transaction details and status"

# Commit 143: Router Index
git add frontend/src/router/index.tsx
git commit -m "feat: add main router configuration

- Set up React Router with all routes
- Add route protection and authentication
- Include error boundaries and fallbacks"

# Commit 144: Protected Route Component
git add frontend/src/router/ProtectedRoute.tsx
git commit -m "feat: add protected route component

- Authentication-based route protection
- Add redirect to login for unauthorized users
- Include role-based access control"

# Commit 145: Routes Configuration
git add frontend/src/router/routes.ts
git commit -m "feat: add routes configuration

- Define all application routes and paths
- Add route metadata and permissions
- Include nested routing structure"

# Commit 146: Auth Services
git add frontend/src/services/auth-services.ts
git commit -m "feat: add authentication services

- Magic link authentication API calls
- Add token management and validation
- Include session handling and logout"

# Commit 147: Banking Services
git add frontend/src/services/banking-service.ts
git commit -m "feat: add banking services

- Account and transaction API calls
- Add beneficiary management services
- Include balance and transfer operations"

# Commit 148: User Services
git add frontend/src/services/user-service.ts
git commit -m "feat: add user management services

- User profile and preferences API calls
- Add account settings and updates
- Include user data validation and formatting"

# Commit 149: Auth Store
git add frontend/src/stores/auth-store.ts
git commit -m "feat: add authentication state store

- Zustand-based auth state management
- Add user session and token storage
- Include login/logout state handling"

# Commit 150: Employee Onboarding Store
git add frontend/src/stores/employee-onborading-store.ts
git commit -m "feat: add employee onboarding store

- Employee onboarding process state
- Add step progression and validation
- Include form data persistence"

# Commit 151: Notification Store
git add frontend/src/stores/notification-store.ts
git commit -m "feat: add notification state store

- Toast and alert notification management
- Add notification queue and display logic
- Include notification types and persistence"

# Commit 152: Onboarding Store
git add frontend/src/stores/onboarding-store.ts
git commit -m "feat: add user onboarding store

- User onboarding process state management
- Add step completion tracking
- Include onboarding data validation"

# Commit 153: Password Reset Store
git add frontend/src/stores/password-reset-store.ts
git commit -m "feat: add password reset store

- Password reset flow state management
- Add token validation and expiration
- Include reset form data handling"

# Commit 154: Custom Error Utility
git add frontend/src/utils/CustomError.ts
git commit -m "feat: add custom error utility class

- Enhanced error handling with context
- Add error codes and categorization
- Include stack trace and debugging info"

# Commit 155: Navigation Paths Enum
git add frontend/src/utils/enums/navigation-paths.ts
git commit -m "feat: add navigation paths enum

- Centralized route path constants
- Add type safety for navigation
- Include nested route definitions"

# Commit 156: Protection Enum
git add frontend/src/utils/enums/protection.ts
git commit -m "feat: add route protection enum

- Define route protection levels
- Add role-based access constants
- Include permission and security levels"

# Commit 157: Transaction Enum
git add frontend/src/utils/enums/transaction.ts
git commit -m "feat: add transaction enum definitions

- Transaction types and status constants
- Add payment method and currency enums
- Include transaction category definitions"

# Commit 158: User Enum
git add frontend/src/utils/enums/user.ts
git commit -m "feat: add user enum definitions

- User role and status constants
- Add account type and verification enums
- Include user preference definitions"

# Commit 159: Chat Helper
git add frontend/src/utils/helpers/chat.ts
git commit -m "feat: add chat utility helpers

- Chat message formatting and validation
- Add emoji and text processing
- Include chat history management"

# Commit 160: Date Helper
git add frontend/src/utils/helpers/date.ts
git commit -m "feat: add date utility helpers

- Date formatting and manipulation
- Add timezone conversion utilities
- Include relative time calculations"

# Commit 161: Error Formatter Helper
git add frontend/src/utils/helpers/error-formatter.ts
git commit -m "feat: add error formatter helper

- Consistent error message formatting
- Add validation error processing
- Include user-friendly error display"

# Commit 162: File Helper
git add frontend/src/utils/helpers/file.ts
git commit -m "feat: add file utility helpers

- File upload and validation utilities
- Add file size and type checking
- Include file processing and conversion"

# Commit 163: Helpers Index
git add frontend/src/utils/helpers/index.ts
git commit -m "feat: add helpers module index

- Export all utility helper functions
- Add centralized helper imports
- Include helper function organization"

# Commit 164: Logger Helper
git add frontend/src/utils/helpers/logger.ts
git commit -m "feat: add logging utility helper

- Structured logging with levels
- Add development and production logging
- Include error tracking and debugging"

# Commit 165: Sanitize Helper
git add frontend/src/utils/helpers/sanitize.ts
git commit -m "feat: add data sanitization helper

- Input sanitization and validation
- Add XSS protection utilities
- Include data cleaning functions"

# Commit 166: Slug Helper
git add frontend/src/utils/helpers/slug.ts
git commit -m "feat: add URL slug utility helper

- Generate URL-friendly slugs
- Add string normalization utilities
- Include special character handling"

# Commit 167: Step Helper
git add frontend/src/utils/helpers/step.ts
git commit -m "feat: add step progression helper

- Multi-step form progression logic
- Add step validation and navigation
- Include step completion tracking"

# Commit 168: Sub-step Helper
git add frontend/src/utils/helpers/sub-step.ts
git commit -m "feat: add sub-step utility helper

- Nested step progression management
- Add sub-step validation and flow
- Include conditional step logic"

# Commit 169: Auth Interfaces
git add frontend/src/utils/interfaces/auth-interfaces.ts
git commit -m "feat: add authentication interfaces

- TypeScript interfaces for auth data
- Add user session and token types
- Include authentication response types"

# Commit 170: Update commit script
git add commit.sh
git commit -m "chore: update commit management script

- Add batch 5 with 40 commit commands
- Update file tracking and organization
- Include comprehensive progress tracking"

echo "✅ Successfully committed files 131-170!"
echo "📊 Run 'git log --oneline -40' to see the latest commits"