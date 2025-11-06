# QuizMaster Frontend

A modern, responsive quiz platform frontend built with React and Tailwind CSS, inspired by Quizlet's design.

## Features

- 🎯 **Modern UI/UX**: Clean, intuitive interface inspired by Quizlet
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🔐 **Authentication**: Secure login/register with JWT tokens
- 📚 **Quiz Management**: Browse, take, and retake quizzes
- 📊 **Results & Analytics**: Detailed quiz results with performance insights
- ⚡ **Fast & Smooth**: Optimized performance with loading states
- 🎨 **Beautiful Design**: Gradient backgrounds, smooth animations, and modern cards

## Tech Stack

- **React 19** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Context API** - State management for authentication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── NavBar.jsx      # Navigation bar with auth
│   └── ProtectedRoute.jsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state
├── pages/              # Page components
│   ├── Home.jsx        # Landing page with quiz grid
│   ├── Login.jsx       # User login
│   ├── Register.jsx    # User registration
│   ├── Quiz.jsx        # Quiz taking interface
│   └── QuizResults.jsx # Quiz results display
├── services/           # API services
│   └── api.js          # Backend API client
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## API Integration

The frontend communicates with a Django REST API backend:

- **Authentication**: JWT-based auth with automatic token refresh
- **Quizzes**: CRUD operations for quiz management
- **Quiz Taking**: Submit answers and get results
- **User Profiles**: User data and statistics

## Key Features

### 🏠 Home Page

- Hero section with call-to-action
- Grid of quiz cards with modern design
- Responsive layout for all screen sizes

### 🔐 Authentication

- Secure login/register forms
- JWT token management
- Protected routes
- Automatic token refresh

### 📝 Quiz Taking

- Interactive question interface
- Progress tracking
- Answer selection with visual feedback
- Navigation between questions

### 📊 Results

- Score display with visual indicators
- Performance analysis
- Study tips and recommendations
- Retake functionality

## Styling

The app uses Tailwind CSS with custom utilities:

- Gradient backgrounds
- Smooth transitions
- Custom scrollbars
- Line clamping for text overflow
- Responsive grid layouts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
