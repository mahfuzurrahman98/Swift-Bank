#!/bin/bash

# Swift Bank - Static Commit Script (Batch 2)
# Next 30 files with proper commit messages

echo "🚀 Starting static commit process for Swift Bank refactoring (Files 31-60)..."

# Reset all staged files first
git reset HEAD

# Commit 31: Auth routes
git add backend/src/app/routes/auth.routes.ts
git commit -m "feat: add authentication API routes

- Define magic link authentication endpoints
- Add user registration and login routes
- Include token validation and refresh endpoints"

# Commit 32: Routes index
git add backend/src/app/routes/index.ts
git commit -m "feat: add routes module index file

- Export all API route modules
- Configure route middleware and prefixes
- Set up centralized routing configuration"

# Commit 33: Account schema
git add backend/src/app/schemas/account.schema.ts
git commit -m "feat: add account validation schema

- Define account creation validation rules
- Add transaction amount and type validation
- Include balance and currency validation"

# Commit 34: Common schema
git add backend/src/app/schemas/common.ts
git commit -m "feat: add common validation schemas

- Define shared validation rules and patterns
- Add pagination and filtering schemas
- Include base entity validation schemas"

# Commit 35: Magic link schema
git add backend/src/app/schemas/magic-link.schema.ts
git commit -m "feat: add magic link validation schema

- Define email validation for magic link requests
- Add device information validation
- Include token expiration and security validation"

# Commit 36: User serializer
git add backend/src/app/serializers/user.serializer.ts
git commit -m "feat: add user data serializer

- Define user profile serialization logic
- Add sensitive data filtering
- Include role-based data exposure control"

# Commit 37: Account service
git add backend/src/app/services/account.service.ts
git commit -m "feat: add account service for banking operations

- Implement account creation and management logic
- Add balance inquiry and transaction processing
- Include account validation and business rules"

# Commit 38: Auth service
git add backend/src/app/services/auth.service.ts
git commit -m "feat: add authentication service

- Implement magic link authentication logic
- Add JWT token generation and validation
- Include user session management"

# Commit 39: Beneficiary service
git add backend/src/app/services/beneficiary.service.ts
git commit -m "feat: add beneficiary management service

- Implement beneficiary CRUD operations
- Add beneficiary validation and verification
- Include trusted contact management"

# Commit 40: Email service
git add backend/src/app/services/email.service.ts
git commit -m "feat: add email service for notifications

- Implement email sending functionality
- Add template rendering and personalization
- Include delivery tracking and error handling"

# Commit 41: Magic link service
git add backend/src/app/services/magic-link.service.ts
git commit -m "feat: add magic link service

- Implement magic link generation and validation
- Add device tracking and security features
- Include link expiration and cleanup logic"

# Commit 42: Token service
git add backend/src/app/services/token.service.ts
git commit -m "feat: add JWT token service

- Implement token generation and validation
- Add refresh token functionality
- Include token blacklisting and security"

# Commit 43: User service
git add backend/src/app/services/user.service.ts
git commit -m "feat: add user management service

- Implement user CRUD operations
- Add profile management and preferences
- Include role and permission management"

# Commit 44: Magic link email template
git add backend/src/app/templates/auth/magic-link.ejs
git commit -m "feat: add magic link email template

- Create responsive email template for magic links
- Add branding and styling
- Include security instructions and expiration info"

# Commit 45: Magic link email template (nested)
git add backend/src/app/templates/email-templates/auth/magic-link.ejs
git commit -m "feat: add nested magic link email template

- Create alternative email template structure
- Add template inheritance and modularity
- Include customizable branding elements"

# Commit 46: Cookie configuration
git add backend/src/configs/cookie-config.ts
git commit -m "feat: add cookie configuration

- Define secure cookie settings
- Add SameSite and HttpOnly configurations
- Include domain and path restrictions"

# Commit 47: Backend main index
git add backend/src/index.ts
git commit -m "feat: add backend main entry point

- Initialize Express application
- Configure middleware and error handling
- Set up database connection and server startup"

# Commit 48: Account seeder
git add backend/src/seeders/account-seeder.ts
git commit -m "feat: add account database seeder

- Create sample account data for development
- Add test users with different account types
- Include initial balance and transaction history"

# Commit 49: Express type definitions
git add backend/src/types/express.d.ts
git commit -m "feat: add Express type definitions

- Extend Express Request interface
- Add custom user and authentication properties
- Include type safety for middleware"

# Commit 50: Custom error utility
git add backend/src/utils/custom-error.ts
git commit -m "feat: add custom error handling utility

- Define application-specific error classes
- Add error codes and status mapping
- Include error serialization and logging"

# Commit 51: Error formatter helper
git add backend/src/utils/helpers/error-formatter.ts
git commit -m "feat: add error formatter helper

- Implement consistent error response formatting
- Add validation error handling
- Include stack trace filtering for production"

# Commit 52: Hash utility helper
git add backend/src/utils/helpers/hash.ts
git commit -m "feat: add password hashing utility

- Implement bcrypt password hashing
- Add salt generation and validation
- Include secure comparison functions"

# Commit 53: Backend TypeScript config
git add backend/tsconfig.json
git commit -m "feat: add backend TypeScript configuration

- Configure TypeScript compiler options
- Set up path mapping and module resolution
- Include strict type checking and build options"

# Commit 54: Commit script
git add commit.sh
git commit -m "chore: add commit management script

- Create automated commit script for deployment
- Add proper commit message formatting
- Include batch processing for large changesets"

# Commit 55: Frontend environment template
git add frontend/.env.example
git commit -m "feat: add frontend environment variables template

- Add API endpoint configuration
- Set authentication and session variables
- Configure build and deployment settings"

# Commit 56: Frontend banking documentation
git add frontend/BANKING_README.md
git commit -m "docs: add frontend banking documentation

- Document banking features and components
- Add user interface guidelines
- Include development and testing instructions"

# Commit 57: Shadcn components config
git add frontend/components.json
git commit -m "feat: add shadcn/ui components configuration

- Configure component library settings
- Set up Tailwind CSS integration
- Define component generation and styling options"

# Commit 58: ESLint configuration
git add frontend/eslint.config.js
git commit -m "feat: add ESLint configuration

- Configure code quality and style rules
- Add React and TypeScript specific rules
- Include accessibility and best practice checks"

# Commit 59: HTML entry point
git add frontend/index.html
git commit -m "feat: add HTML entry point

- Create main HTML template
- Add meta tags and viewport configuration
- Include favicon and app manifest links"

# Commit 60: Frontend package lock
git add frontend/package-lock.json
git commit -m "chore: add frontend package-lock.json for dependency locking

- Lock React and TypeScript dependency versions
- Ensure consistent builds across environments
- Include security audit and vulnerability info"

echo "✅ Successfully committed files 31-60!"
echo "📊 Run 'git log --oneline -30' to see the latest commits"