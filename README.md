# Kaizen Ideas: A Modern Employee Innovation Management Platform

Kaizen Ideas is a full-stack application that streamlines the process of collecting, reviewing, and implementing employee improvement ideas. The platform promotes continuous improvement by providing an intuitive interface for idea submission, tracking, and collaboration while offering robust analytics, leaderboard features, and a comprehensive credit points system to drive engagement.

The application consists of a React Native mobile frontend and a Node.js/Express backend, enabling employees to easily submit improvement ideas across various categories including cost savings, safety, quality, and productivity. Reviewers and administrators can efficiently manage and track ideas through their implementation lifecycle, while built-in gamification features encourage participation through leaderboards, achievement tracking, and credit points rewards.

## 🏆 Credit Points System

The platform features a sophisticated credit points system that rewards users for their contributions and encourages continuous participation:

### Points Allocation
- **Idea Submission**: +10 points per submitted idea
- **Idea Approval**: +20 points per approved idea  
- **Idea Implementation**: +30 points per implemented idea

### Real-time Updates
- Credit points are automatically calculated and updated in real-time
- Profile page shows detailed breakdown of points earned
- Notifications are sent when credit points change
- Milestone achievements are celebrated with special notifications

### Milestone System
Users receive notifications for achieving milestones:
- 🎯 First idea submitted
- 🎯 5 ideas submitted
- 🎯 10 ideas submitted
- 🎯 First idea approved
- 🎯 5 ideas approved
- 🎯 First idea implemented
- 🎯 100 credit points reached
- 🎯 500 credit points reached
- 🎯 1000 credit points reached

### When Points Are Updated
- **Idea Submission**: Points recalculated immediately
- **Status Change**: Points updated when idea status changes to approved/implemented
- **Idea Deletion**: Points recalculated after idea deletion
- **Manual Recalculation**: Admin can trigger recalculation for all users

## Repository Structure
```
.
├── backend/                      # Node.js/Express backend application
│   ├── src/
│   │   ├── config/              # Configuration files (database connection)
│   │   ├── controllers/         # Business logic for auth, ideas, users, notifications
│   │   ├── middleware/          # Auth, validation middleware
│   │   ├── models/             # Mongoose models for User, Idea, Notification
│   │   ├── routes/             # API route definitions
│   │   └── server.js           # Express application entry point
│   └── scripts/
│       └── seedData.js         # Database seeding script
└── frontend/                    # React Native mobile application
    ├── app/                     # Expo Router screens and layouts
    │   ├── (tabs)/             # Tab-based navigation screens
    │   └── _layout.js          # Root layout configuration
    ├── context/                # React Context providers
    ├── hooks/                  # Custom React hooks
    └── utils/                  # Utility functions and theme configuration
```

## Usage Instructions
### Prerequisites
- Node.js v14.x or higher
- MongoDB v4.x or higher
- Expo CLI for mobile development
- React Native development environment setup

### Installation

#### Quick Setup (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd Sakthi_Auto

# Install all dependencies
npm run install:all

# Setup environment
cd backend
cp env.example .env
# Edit .env with your MongoDB connection string and JWT secret

# Start both frontend and backend
npm run dev
```

#### Manual Setup

##### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update environment variables
# Edit .env with your MongoDB connection string and other configurations

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

##### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Expo development server
npm start
```

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run start` - Start both frontend and backend in production mode
- `npm run install:all` - Install dependencies for all packages
- `npm run build` - Build the frontend for web deployment
- `npm run test` - Run backend tests

### Quick Start
1. Access the application using the following test credentials:
   ```
   Employee: 12345 | OTP: 1234
   Reviewer: 67890 | OTP: 1234
   ```

2. Submit your first idea:
   - Navigate to the "Submit" tab
   - Fill in the idea details across the multi-step form
   - Add supporting images if needed
   - Submit for review
   - **Earn 10 credit points immediately!**

3. Track your ideas and points:
   - Use the "Tracker" tab to monitor your submitted ideas
   - Check the "Profile" tab to see your credit points breakdown
   - Filter ideas by status
   - View detailed feedback from reviewers

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - User logout

### Ideas
- `GET /api/ideas` - Get all ideas (with filters)
- `POST /api/ideas` - Submit new idea (+10 points)
- `GET /api/ideas/my` - Get user's own ideas
- `PUT /api/ideas/:id/status` - Update idea status (+20/+30 points)
- `DELETE /api/ideas/:id` - Delete idea (recalculate points)

### Users
- `GET /api/users/leaderboard` - Get leaderboard
- `POST /api/users/recalculate-credit-points` - Recalculate all users' credit points (Admin)

## Credit Points Calculation

The credit points system automatically calculates points based on user actions:

```javascript
// Points calculation formula
const creditPoints = (submitted * 10) + (approved * 20) + (implemented * 30);
```

### Real-time Updates
The frontend automatically refreshes user data when:
- A new idea is submitted
- An idea status is updated
- An idea is deleted
- User manually refreshes profile

## Database Schema

### User Model
```javascript
{
  employeeNumber: String,
  name: String,
  email: String,
  department: String,
  designation: String,
  role: String,
  creditPoints: Number, // Auto-calculated
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Idea Model
```javascript
{
  title: String,
  problem: String,
  improvement: String,
  benefit: String,
  department: String,
  estimatedSavings: Number,
  status: String, // pending, approved, rejected, implemented
  submittedBy: ObjectId,
  reviewedBy: ObjectId,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Data Flow
The application follows a standard client-server architecture with RESTful API communication between the React Native frontend and Express backend.

```ascii
[Mobile Client] <--> [Express Server] <--> [MongoDB]
     |                     |                  |
User Interface    API & Business Logic    Data Storage
     |                     |                  |
Auth Context     JWT Authentication     User/Idea Data
     |                     |                  |
Credit Points    Real-time Updates      Points Calculation
```

Key component interactions:
1. User authentication via JWT tokens
2. Real-time idea status updates
3. Automatic credit points calculation
4. Notification system for status changes and milestones
5. File upload for supporting documentation
6. Caching for improved performance
7. Role-based access control
8. Automated email notifications
9. Analytics and reporting pipeline
10. Leaderboard with credit points ranking

## Troubleshooting
1. Database Connection Issues
   - Error: "MongoDB Connection Failed"
   - Solution: 
     ```bash
     # Check MongoDB service status
     sudo service mongod status
     
     # Verify connection string in .env
     MONGODB_URI=mongodb://localhost:27017/kaizen-ideas
     ```

2. Authentication Issues
   - Error: "Invalid token"
   - Solution: Clear local storage and re-login
   ```javascript
   // In browser console or React Native
   await AsyncStorage.clear()
   ```

3. Credit Points Not Updating
   - Check if the idea status was properly updated
   - Verify the user has proper permissions
   - Try refreshing the profile page
   - Check server logs for calculation errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
