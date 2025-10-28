# CrowdFunding Platform - Frontend

Modern React frontend for the crowdfunding platform built with Vite, React Router, Tailwind CSS, and Axios.

## 🚀 Features

- **User Authentication** - Register, login, and session management with JWT
- **Campaign Browsing** - Filter by category, type, and search
- **Campaign Creation** - Create campaigns with image/video uploads
- **Campaign Details** - View full campaign info, invest, like, and share
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Real-time Updates** - Dynamic progress bars and backers count
- **File Uploads** - Support for multiple images and video per campaign

## 📋 Prerequisites

- Node.js 16+ and npm
- Backend API running on http://localhost:5000

## 🛠️ Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

3. **Run development server:**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar with auth
│   └── CampaignCard.jsx # Campaign card component
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── CampaignsList.jsx # Browse campaigns
│   ├── CampaignDetail.jsx # Campaign details
│   └── CreateCampaign.jsx # Create campaign form
├── context/            # React Context
│   └── AuthContext.jsx # Authentication context
├── services/           # API services
│   └── api.js          # Axios config & API calls
├── App.jsx             # Main app with routing
├── main.jsx            # Entry point
└── index.css           # Global styles with Tailwind
```

## 🔌 API Integration

The app communicates with the backend API through Axios. All API calls are defined in `src/services/api.js`.

### Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent in Authorization header for protected routes
5. Token also sent as cookie for cookie-based auth

### Key API Endpoints Used

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/campaigns` - Get all campaigns (with filters)
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create campaign (multipart/form-data)
- `POST /api/campaigns/:id/like` - Like/unlike campaign
- `POST /api/campaigns/:id/invest` - Invest in campaign
- `GET /api/campaigns/trending` - Get trending campaigns

## 🎨 Styling

Built with **Tailwind CSS** for utility-first styling. Custom theme colors defined in `tailwind.config.js`.

Primary color scheme:
- Primary: Blue (#0ea5e9 and shades)
- Success: Green
- Danger: Red
- Gray scale for text and backgrounds

## 🔒 Authentication

The app uses JWT tokens for authentication:

- Tokens stored in localStorage
- AuthContext provides auth state throughout the app
- Protected routes redirect to login if not authenticated
- Automatic token refresh on API calls

## 📱 Responsive Design

- Mobile-first approach
- Hamburger menu on mobile
- Grid layouts adjust for tablet/desktop
- Touch-friendly buttons and forms

## 🧩 Components

### Navbar
- Responsive navigation
- User dropdown menu when authenticated
- Mobile hamburger menu

### CampaignCard
- Displays campaign summary
- Progress bar with percentage
- Category badges
- Like and backers count

### Auth Pages (Login/Register)
- Form validation
- Error handling
- Individual/Organization account types

### Campaign Pages
- **List**: Filter, search, pagination
- **Detail**: Full campaign info, invest modal, share
- **Create**: Multi-step form with file uploads

## 🚦 Usage

### Creating a Campaign

1. Register/Login to your account
2. Click "Start Campaign" in navbar
3. Fill in campaign details:
   - Title, description, goal amount
   - Category and type (donation/investment)
   - Upload images (1-5 required)
   - Upload video (optional)
   - Add rewards (optional)
4. Click "Launch Campaign"

### Supporting a Campaign

1. Browse campaigns or search for specific ones
2. Click on a campaign card to view details
3. Click "Back this project"
4. Enter investment amount
5. Confirm contribution

### Browsing Campaigns

- Use category filters on homepage
- Search by keywords
- Filter by campaign type (donation/investment)
- Filter by category
- View trending campaigns

## 🔧 Configuration

### Proxy Setup

Vite is configured to proxy API requests in development (see `vite.config.js`):

```js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  }
}
```

### Environment Variables

- `VITE_API_URL` - Backend API base URL

## 🐛 Troubleshooting

### API Connection Issues

If you get network errors:
1. Ensure backend is running on port 5000
2. Check CORS is enabled on backend
3. Verify `VITE_API_URL` in `.env`

### Authentication Issues

If login/register doesn't work:
1. Check browser console for errors
2. Verify backend `/api/auth` routes are working
3. Check if cookies are being set
4. Clear localStorage and try again

### File Upload Issues

If image/video uploads fail:
1. Check file size limits (images <10MB, video <100MB)
2. Verify Cloudinary is configured on backend
3. Check network tab for failed multipart requests

## 📚 Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Heroicons** - Icon library
- **Context API** - State management

## 🤝 Contributing

1. Make changes in a feature branch
2. Test all flows (auth, campaigns, uploads)
3. Ensure responsive design works
4. Submit pull request

## 📄 License

This project is part of the CrowdFunding Platform.

## 🔗 Related

- [Backend Documentation](../Backend/API_ROUTES_DOCUMENTATION.md)
- [Backend Setup](../Backend/README.md)


