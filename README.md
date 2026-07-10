# Health & Wellness App

A comprehensive health and wellness tracking application similar to Samsung Health but with extended features. Built with React, Node.js/Express, and PostgreSQL.

## Features

### Core Health Trackers
- **Weight Tracking**: Log and visualize weight trends
- **Sleep Tracking**: Monitor sleep patterns and quality
- **Meal Tracking**: Track meals with nutritional information (calories, macros)
- **Workout Tracking**: Log exercises and calories burned
- **Water Intake**: Track daily hydration

### Wellness & Recovery
- **Journal**: Write daily journal entries with mood integration
- **Mood Tracking**: Log daily moods with intensity ratings
- **Symptom Tracking**: Record physical and mental symptoms
- **Substance Use Tracking**: Monitor substance consumption
- **Cravings Tracker**: Log cravings and track resistance
- **Abstinence Tracking**: Track days/milestones of substance abstinence

### Goals & Habits
- **Goal Setting**: Create and track health goals
- **Habit Tracking**: Build and maintain healthy habits with streaks

### Analytics & Insights
- **Dashboard**: Real-time summary of today's health metrics
- **Analytics**: Detailed charts and trends (weight, nutrition, mood, cravings)
- **Reports**: Weekly/monthly health insights

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast builds
- **Material-UI (MUI)** for UI components
- **Redux Toolkit** for state management
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **Node.js/Express** with TypeScript
- **PostgreSQL** database
- **TypeORM** for database ORM
- **JWT** for authentication
- **Socket.io** for real-time notifications (future)

## Project Structure

```
my-home/
├── apps/
│   ├── backend/              # Express API server
│   │   ├── src/
│   │   │   ├── entities/    # TypeORM entities
│   │   │   ├── routes/      # API routes
│   │   │   ├── middleware/  # Express middleware
│   │   │   ├── utils/       # JWT, password utilities
│   │   │   └── index.ts     # Server entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   └── web/                 # React frontend
│       ├── src/
│       │   ├── pages/       # Page components
│       │   ├── components/  # Reusable components
│       │   ├── store/       # Redux store
│       │   ├── services/    # API calls
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── index.html
│
├── package.json             # Root monorepo config
├── docker-compose.yml       # PostgreSQL + Adminer
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Docker & Docker Compose (for database)

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd My-home
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Backend (.env):
```bash
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your configuration
```

4. **Start PostgreSQL**
```bash
docker-compose up -d
```

5. **Start development servers**

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:web
```

The app will be available at `http://localhost:5173`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Health Trackers
- `GET/POST /api/weight` - Weight logs
- `GET/POST /api/sleep` - Sleep logs
- `GET/POST /api/meals` - Meal tracking
- `GET/POST /api/workouts` - Workouts
- `GET/POST /api/water` - Water intake
- `GET/POST /api/journal` - Journal entries
- `GET/POST /api/moods` - Mood logs
- `GET/POST /api/symptoms` - Symptom tracking
- `GET/POST /api/substance-use` - Substance use logs
- `GET/POST /api/cravings` - Craving logs
- `GET/POST /api/abstinence` - Abstinence tracking
- `GET/POST /api/goals` - Goal tracking
- `GET/POST /api/habits` - Habit tracking

### Dashboard & Analytics
- `GET /api/dashboard/today` - Today's summary
- `GET /api/dashboard/stats/:period` - Period stats
- `GET /api/analytics/weight/:period` - Weight analytics
- `GET /api/analytics/nutrition/:period` - Nutrition analytics
- `GET /api/analytics/mood/:period` - Mood analytics
- `GET /api/analytics/cravings/:period` - Craving analytics
- `GET /api/analytics/substance/:period` - Substance use analytics

## Database Schema

All entities are defined in `apps/backend/src/entities/`

Key tables:
- `users` - User accounts
- `weight_logs` - Weight tracking
- `sleep_logs` - Sleep data
- `meals` - Meal entries
- `workouts` - Exercise logs
- `water_intake` - Hydration tracking
- `journal_entries` - Journal notes
- `mood_logs` - Mood tracking
- `symptoms` - Symptom logs
- `substance_use` - Substance use tracking
- `cravings` - Craving logs
- `abstinence_tracking` - Abstinence milestones
- `goals` - Health goals
- `habits` - Daily habits
- `habit_completions` - Habit completion records

## Running in Production

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

## Testing

```bash
npm run test
```

## Features Roadmap

- [ ] Real-time notifications with Socket.io
- [ ] Dark mode support
- [ ] Mobile app (React Native)
- [ ] Social features (share progress, communities)
- [ ] Integration with health APIs (Apple Health, Google Fit)
- [ ] Data export (PDF, CSV)
- [ ] Reminders and goals notifications
- [ ] Advanced ML-based insights
- [ ] Food database integration for meal tracking
- [ ] Wearable device integration

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT License

## Support

For support, email support@healthwellness.app or open an issue on GitHub.

---

Built with ❤️ for health and wellness
