# Swift Bank Backend API

Industry-standard Express.js + TypeScript backend for the Swift Banking application, featuring modern architecture patterns, dependency injection, and comprehensive banking functionality.

## 🏗️ Architecture

This backend follows a **layered architecture** pattern:

```
Routes → Controllers → Services → Models → Database
```

### Key Features

-   **Modern TypeScript**: Full type safety and modern ES features
-   **Dependency Injection**: Using tsyringe for clean, testable code
-   **Zod Validation**: Runtime type checking and validation
-   **JWT Authentication**: Secure token-based authentication
-   **MongoDB**: Document database with Mongoose ODM
-   **Error Handling**: Centralized error handling with custom error types
-   **Security**: Helmet, CORS, rate limiting, and input validation

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   MongoDB 5.0+
-   npm or yarn

### Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Environment Setup**:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB**:

```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

4. **Start Development Server**:

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Available Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm start          # Start production server
npm run type-check # TypeScript type checking
```

## 📊 API Endpoints

### Authentication

-   `POST /api/v1/auth/register` - User registration
-   `POST /api/v1/auth/login` - User login
-   `POST /api/v1/auth/refresh` - Refresh access token
-   `POST /api/v1/auth/logout` - User logout
-   `GET /api/v1/auth/profile` - Get user profile
-   `PUT /api/v1/auth/profile` - Update user profile
-   `POST /api/v1/auth/change-password` - Change password

### Account Management

-   `GET /api/v1/accounts` - Get user account
-   `POST /api/v1/accounts/deposit` - Deposit money
-   `POST /api/v1/accounts/withdraw` - Withdraw money
-   `POST /api/v1/accounts/transfer` - Transfer to beneficiary

### Beneficiaries

-   `GET /api/v1/accounts/beneficiaries` - Get beneficiaries
-   `POST /api/v1/accounts/beneficiaries` - Add beneficiary
-   `DELETE /api/v1/accounts/beneficiaries/:id` - Remove beneficiary

### Transactions

-   `GET /api/v1/accounts/transactions` - Get transaction history

### System

-   `GET /api/v1/status` - API status check
-   `GET /health` - Health check

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**: Short-lived (15 minutes) for API requests
2. **Refresh Token**: Long-lived (7 days) stored in HTTP-only cookies

### Usage Example

```javascript
// Login
const response = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // Important for cookies
});

// Use access token for API requests
const apiResponse = await fetch("/api/v1/accounts", {
    headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    },
    credentials: "include",
});
```

## 💰 Banking Operations

### Account Structure

Each user has one account with:

-   Balance tracking
-   Beneficiary management
-   Transaction history
-   Active/inactive status

### Transaction Types

1. **Self Transactions**: Deposits and withdrawals
2. **Fund Transfers**: Money transfers between accounts

### Security Features

-   Beneficiary verification for transfers
-   Balance validation
-   Transaction logging
-   Account status checks

## 🗄️ Database Schema

### Users Collection

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  googleAuth: Boolean,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

### Accounts Collection

```javascript
{
  userId: String,
  balance: Number,
  active: Boolean,
  beneficiaries: [ObjectId],
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

### Self Transactions Collection

```javascript
{
  accountId: String,
  amount: Number,
  type: 'deposit' | 'withdraw',
  balance: Number,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

### Fund Transfers Collection

```javascript
{
  fromAccountId: String,
  toAccountId: String,
  amount: Number,
  fromAccountBalance: Number,
  toAccountBalance: Number,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

## 🛡️ Security

### Implemented Security Measures

1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Route-level access control
3. **Input Validation**: Zod schemas for all inputs
4. **Password Security**: bcrypt hashing with salt rounds
5. **HTTP Security**: Helmet.js security headers
6. **CORS**: Configured for frontend domain
7. **Rate Limiting**: Prevents brute force attacks
8. **Soft Deletes**: Data preservation and security

### Environment Variables

Required environment variables:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/swift_bank
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=your-cookie-secret
CORS_ORIGIN=http://localhost:3000
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── index.ts                    # Application entry point
│   ├── app/
│   │   ├── index.ts               # Express app configuration
│   │   ├── data-source.ts         # MongoDB connection
│   │   ├── routes/                # Route definitions
│   │   ├── controllers/           # Request handlers
│   │   ├── services/              # Business logic
│   │   ├── models/                # Database models
│   │   ├── schemas/               # Validation schemas
│   │   ├── dtos/                  # Data transfer objects
│   │   ├── interfaces/            # TypeScript interfaces
│   │   ├── middlewares/           # Custom middleware
│   │   └── enums/                 # Enumerations
│   ├── utils/                     # Utility functions
│   ├── configs/                   # Configuration files
│   └── types/                     # Global TypeScript types
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🚦 Error Handling

The API uses a standardized error response format:

```javascript
{
  success: false,
  message: "Error description",
  code: "ERROR_CODE", // Optional
  errors: [           // For validation errors
    {
      field: "fieldName",
      message: "Field-specific error"
    }
  ]
}
```

## 📈 Development

### Code Standards

-   **TypeScript**: Strict type checking
-   **ESLint**: Code linting and formatting
-   **Dependency Injection**: Testable, modular code
-   **Error Handling**: Comprehensive error management
-   **Validation**: Runtime input validation with Zod

### Testing

```bash
# Run type checking
npm run type-check

# Test API endpoints manually
curl -X GET http://localhost:3001/health
```

## 📝 Migration Notes

This backend was migrated from the existing server structure while maintaining:

✅ **Same Database Schema**: Compatible with existing data
✅ **Same API Endpoints**: Drop-in replacement
✅ **Same Functionality**: All banking operations preserved
✅ **Enhanced Architecture**: Modern patterns and best practices
✅ **Improved Security**: Enhanced authentication and validation
✅ **Better Error Handling**: Standardized error responses
✅ **Type Safety**: Full TypeScript coverage

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use dependency injection patterns
3. Add proper error handling
4. Include input validation
5. Maintain consistent API responses
6. Write clear documentation

## 📞 Support

For issues and questions:

-   Check the API status: `GET /health`
-   Review error responses for debugging
-   Ensure MongoDB is running
-   Verify environment configuration
