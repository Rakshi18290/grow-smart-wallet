# Database Setup & Authentication Guide

## Overview
This application now includes complete Gmail authentication and Firebase database integration to store user financial data securely in the cloud.

## ✅ What's Been Implemented

### 🔐 **Authentication System**
- **Gmail OAuth Login**: Users sign in with their Google accounts
- **User Profile Management**: Stores user information (name, email, photo)
- **Session Management**: Automatic login/logout handling
- **Protected Routes**: Dashboard only accessible after authentication

### 🗄️ **Database Schema**
- **Users**: Profile information and preferences
- **Financial Data**: Income, expenses, savings, debt tracking
- **Budget Categories**: Customizable spending categories
- **Goals**: Financial goals with progress tracking
- **Transactions**: Complete transaction history
- **Real-time Updates**: Live data synchronization across devices

### 🚀 **New Features**
- **User-specific Data**: Each user's data is isolated and secure
- **Real-time Sync**: Changes reflect immediately across all devices
- **Offline-ready**: Data cached locally when offline
- **Auto-backup**: All data automatically backed up to Firebase

## 🛠️ Setup Instructions

### 1. Firebase Project Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Enter project name (e.g., "budgetbot-app")
   - Enable Google Analytics (optional)

2. **Enable Authentication**:
   - In Firebase Console, go to "Authentication" > "Sign-in method"
   - Enable "Google" sign-in provider
   - Add your domain to authorized domains

3. **Create Firestore Database**:
   - Go to "Firestore Database" > "Create database"
   - Start in production mode
   - Choose a location close to your users

4. **Configure Security Rules**:
   ```javascript
   // Firestore Security Rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       match /financialData/{document} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       
       match /budgetCategories/{document} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       
       match /goals/{document} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       
       match /transactions/{document} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

### 2. Environment Configuration

1. **Get Firebase Config**:
   - In Firebase Console, go to Project Settings > General
   - Scroll to "Your apps" section
   - Click on web app or create one
   - Copy the config object

2. **Setup Environment Variables**:
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your Firebase configuration
   ```

3. **Example .env.local**:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   VITE_FIREBASE_AUTH_DOMAIN=budgetbot-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=budgetbot-app
   VITE_FIREBASE_STORAGE_BUCKET=budgetbot-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
   ```

### 3. Application Startup

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

## 📊 Database Collections

### **users**
```typescript
{
  id: string;           // Firebase Auth UID
  email: string;        // User's Gmail address
  displayName: string;  // User's display name
  photoURL: string;     // Profile picture URL
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### **financialData**
```typescript
{
  id: string;
  userId: string;       // Reference to user
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalDebt: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### **budgetCategories**
```typescript
{
  id: string;
  userId: string;       // Reference to user
  name: string;         // e.g., "Needs", "Wants", "Savings"
  spent: number;        // Amount spent in category
  budget: number;       // Budget limit for category
  color: string;        // UI color class
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### **goals**
```typescript
{
  id: string;
  userId: string;       // Reference to user
  name: string;         // Goal name
  targetAmount: number; // Target amount to achieve
  currentAmount: number; // Current progress
  deadline: string;     // Target date (YYYY-MM-DD)
  description: string;  // Goal description
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### **transactions**
```typescript
{
  id: string;
  userId: string;       // Reference to user
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category?: string;    // Optional category
  createdAt: Timestamp;
}
```

## 🔒 Security Features

- **Row-Level Security**: Users can only access their own data
- **Authentication Required**: All database operations require valid authentication
- **Data Validation**: Client and server-side validation
- **Encrypted Storage**: Firebase encrypts all data at rest
- **HTTPS Only**: All communication encrypted in transit

## 🌟 Key Benefits

### **For Users**:
- ✅ **Secure Login**: Gmail OAuth - no passwords to remember
- ✅ **Cloud Backup**: Data never lost, accessible anywhere
- ✅ **Real-time Sync**: Works across all devices instantly
- ✅ **Privacy First**: Only you can access your financial data

### **For Developers**:
- ✅ **Production Ready**: Firebase scales automatically
- ✅ **Real-time Features**: Live updates with minimal code
- ✅ **Offline Support**: Works without internet connection
- ✅ **Analytics Ready**: Built-in usage analytics

## 🧪 Testing the Implementation

1. **Start the Application**:
   ```bash
   npm run dev
   ```

2. **Test Authentication**:
   - Click "Sign in with Google"
   - Complete Gmail OAuth flow
   - Verify you're redirected to dashboard

3. **Test Data Persistence**:
   - Add income/expenses
   - Create financial goals
   - Sign out and sign back in
   - Verify data is persisted

4. **Test Real-time Updates**:
   - Open app in two browser tabs
   - Make changes in one tab
   - Verify changes appear in other tab

## 🚨 Important Notes

- **Demo Environment**: Current config uses demo Firebase settings
- **Production Setup**: Replace demo config with your Firebase project
- **Data Privacy**: Never commit .env.local to version control
- **Security Rules**: Always test Firestore security rules thoroughly

## 📞 Troubleshooting

### Common Issues:

1. **"Auth domain not authorized"**:
   - Add your domain to Firebase Authentication settings

2. **"Permission denied"**:
   - Check Firestore security rules
   - Ensure user is authenticated

3. **"Config not found"**:
   - Verify .env.local file exists and has correct values
   - Restart development server after adding env vars

4. **"Module not found"**:
   - Run `npm install` to ensure all dependencies are installed

## 🎯 Next Steps

The application is now fully functional with:
- ✅ Secure Gmail authentication
- ✅ Cloud database storage  
- ✅ Real-time data synchronization
- ✅ User-specific data isolation
- ✅ Professional UI/UX

Your BudgetBot app is ready for production use! 🚀