# Sakthi Spark: A Modern Employee Innovation Management Platform

Sakthi Spark is a full-stack application that streamlines the process of collecting, reviewing, and implementing employee improvement ideas. The platform promotes continuous improvement by providing an intuitive interface for idea submission, tracking, and collaboration while offering robust analytics, leaderboard features, and a comprehensive credit points system.

## 🚀 Features

### For Employees
- 📝 **Easy Idea Submission**: Submit improvement ideas across various categories including cost savings, safety, quality, and productivity
- 📊 **Real-time Tracking**: Monitor the status and progress of your submitted ideas
- 🏆 **Gamification**: Earn credit points for submissions and achievements
- 📱 **Mobile-First Design**: Access the platform seamlessly on any device
- 🔔 **Notifications**: Stay updated on idea status changes and approvals

### For Reviewers & Administrators
- 📋 **Idea Management**: Efficiently review, approve, and track ideas through their implementation lifecycle
- 📈 **Analytics Dashboard**: Comprehensive insights into idea submissions and implementation rates
- 👥 **User Management**: Manage employee accounts and permissions
- 🏅 **Leaderboard**: Track top contributors and encourage healthy competition

## 🎯 Achievement System

### Submission Milestones
- 🎯 5 ideas submitted
- 🎯 10 ideas submitted
- 🎯 25 ideas submitted
- 🎯 50 ideas submitted

### Approval Milestones
- 🎯 5 ideas approved
- 🎯 10 ideas approved
- 🎯 25 ideas approved

## 🏗️ Architecture

```
Sakthi_Auto/
├── frontend/                 # React Native/Expo mobile app
│   ├── app/                 # Main app screens and navigation
│   │   ├── (tabs)/         # Tab-based navigation screens
│   │   │   ├── index.js    # Home/Dashboard screen
│   │   │   ├── submit.js   # Idea submission form
│   │   │   ├── tracker.js  # Idea tracking and status
│   │   │   ├── leaderboard.js # Leaderboard and achievements
│   │   │   └── profile.js  # User profile and statistics
│   │   └── login.js        # Authentication screen
│   ├── context/            # React Context for state management
│   │   ├── UserContext.js  # User authentication and data
│   │   └── IdeaContext.js  # Ideas state management
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions and API calls
└── backend/                # Node.js/Express API server
    ├── src/
    │   ├── controllers/    # Business logic for auth, ideas, users, notifications
    │   ├── models/         # MongoDB schemas and models
    │   ├── routes/         # API route definitions
    │   ├── middleware/     # Authentication and validation middleware
    │   ├── services/       # External service integrations (Twilio, etc.)
    │   └── config/         # Database and app configuration
    ├── scripts/            # Database seeding and utility scripts
    └── uploads/            # File upload storage
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Expo CLI (for mobile development)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sakthi_Auto
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd backend
   cp env.example .env
   # Edit .env with your MongoDB URI and other configurations
   
   # Frontend environment (if needed)
   cd ../frontend
   # Configure any frontend-specific environment variables
   ```

4. **Database Setup**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Start backend server (from backend directory)
   npm start
   
   # Start frontend (from frontend directory)
   npx expo start
   ```

## 📱 Mobile App Usage

### Getting Started
1. **Login**: Use your employee credentials to access the platform
2. **Submit Ideas**: Navigate to the "Submit" tab to create new improvement ideas
3. **Track Progress**: Use the "Tracker" tab to monitor your submitted ideas
4. **View Leaderboard**: Check the "Leaderboard" tab to see top contributors
5. **Profile**: Access your profile to view statistics and achievements

### Idea Submission Process
1. Fill out the idea submission form with:
   - Title and description
   - Category (Cost Savings, Safety, Quality, Productivity)
   - Expected impact and benefits
   - Implementation timeline
2. Submit the idea (+10 credit points)
3. Track the review process through status updates
4. Receive notifications on approval/rejection

### Credit Points System
- **Submission**: +10 points per idea
- **Approval**: +20 points per approved idea
- **Implementation**: +30 points per implemented idea
- **Achievements**: Bonus points for milestone achievements

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Ideas
- `GET /api/ideas` - Get all ideas (with filters)
- `POST /api/ideas` - Submit new idea (+10 points)
- `GET /api/ideas/my` - Get user's own ideas
- `PUT /api/ideas/:id/status` - Update idea status (+20/+30 points)
- `DELETE /api/ideas/:id` - Delete idea (recalculate points)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for development
npm test     # Run tests
npm run seed # Seed database with sample data
```

### Frontend Development
```bash
cd frontend
npx expo start     # Start Expo development server
npx expo start --web  # Start web version
npx expo build     # Build for production
```

### Database Management
```bash
cd backend
npm run seed       # Seed with sample data
npm run reset-db   # Reset database (if available)
```

## 📊 Database Schema

### User Model
```javascript
{
  employeeNumber: String,
  name: String,
  email: String,
  department: String,
  role: String,
  creditPoints: Number,
  achievements: Array,
  createdAt: Date
}
```

### Idea Model
```javascript
{
  title: String,
  description: String,
  category: String,
  submittedBy: ObjectId,
  status: String,
  reviewComments: String,
  approvedBy: ObjectId,
  approvedAt: Date,
  implementedAt: Date,
  createdAt: Date
}
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control
- Rate limiting on API endpoints

## 📱 Mobile Features

- Offline capability for viewing submitted ideas
- Push notifications for status updates
- Camera integration for idea documentation
- Biometric authentication support
- Responsive design for all screen sizes

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or your preferred platform
4. Set up CI/CD pipeline

### Mobile App Deployment
1. Build the app using Expo
2. Submit to App Store/Google Play Store
3. Configure push notifications
4. Set up app analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sakthi-spark
JWT_SECRET=your_jwt_secret_here
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

### Frontend (if needed)
```env
API_BASE_URL=http://localhost:5000/api
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

## 📈 Performance Optimization

- Database indexing for faster queries
- Image compression and optimization
- Lazy loading for large datasets
- Caching strategies for frequently accessed data
- CDN integration for static assets

## 🔍 Monitoring and Analytics

- Error tracking with Sentry
- Performance monitoring
- User analytics and behavior tracking
- Database performance monitoring
- API usage analytics

---

**Sakthi Spark** - Empowering continuous improvement through employee innovation! 🚀
