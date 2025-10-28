# 🎯 CrowdFunding Platform

A full-stack crowdfunding platform built with React and Node.js, featuring campaign creation, file uploads, authentication, and real-time investment tracking.

![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Frontend](https://img.shields.io/badge/Frontend-React-61dafb)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based auth for individuals and organizations
- 📸 **Media Uploads** - Upload images and videos via Cloudinary
- 💰 **Campaign Management** - Create, browse, and support fundraising campaigns
- 🎯 **Smart Filtering** - Search by category, type, and keywords
- 📊 **Real-time Progress** - Live funding progress and backers count
- 🎁 **Rewards System** - Offer rewards at different contribution levels
- 💙 **Social Features** - Like campaigns and share with others
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                      │
│   React + Vite + Tailwind CSS + React Router   │
│            Port 3000 (Development)              │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP/REST API
                 │ (Axios + JWT)
                 │
┌────────────────▼────────────────────────────────┐
│                    Backend                      │
│      Express.js + Node.js + PostgreSQL         │
│            Port 5000 (Development)              │
└────────────┬──────────────┬─────────────────────┘
             │              │
             │              │
    ┌────────▼─────┐  ┌────▼──────────┐
    │  PostgreSQL  │  │   Cloudinary  │
    │   (NeonDB)   │  │ (File Storage)│
    └──────────────┘  └───────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- PostgreSQL database (or free NeonDB account)
- Cloudinary account (free tier available)

### Setup in 5 Minutes

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd CrowdFundingASV
```

2. **Backend Setup**
```bash
cd Backend
npm install

# Create .env file
echo "DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret" > .env

npm run dev
```

3. **Frontend Setup** (in new terminal)
```bash
cd Frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

npm run dev
```

4. **Access the app**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

📖 **Detailed setup:** See [QUICKSTART.md](./QUICKSTART.md)

## 📂 Project Structure

```
CrowdFundingASV/
│
├── Backend/                    # Node.js Express API
│   ├── config/                # Database & Cloudinary configuration
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth & file upload middleware
│   ├── models/                # PostgreSQL models
│   ├── Routes/                # API endpoints
│   ├── utils/                 # Helper functions (JWT)
│   ├── server.js              # Express server entry point
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment template
│
├── Frontend/                   # React SPA
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── context/           # React Context (Auth)
│   │   ├── services/          # API service layer
│   │   ├── App.jsx            # Main app with routing
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles + Tailwind
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── package.json           # Frontend dependencies
│   └── .env.example           # Environment template
│
├── QUICKSTART.md              # Detailed setup guide
└── README.md                  # This file
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |

### Campaigns
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/campaigns` | Get all campaigns (with filters) | ❌ |
| GET | `/api/campaigns/:id` | Get campaign details | ❌ |
| GET | `/api/campaigns/trending` | Get trending campaigns | ❌ |
| GET | `/api/campaigns/category/:category` | Filter by category | ❌ |
| GET | `/api/campaigns/type/:type` | Filter by type | ❌ |
| POST | `/api/campaigns` | Create campaign | ✅ |
| PUT | `/api/campaigns/:id` | Update campaign | ✅ |
| DELETE | `/api/campaigns/:id` | Delete campaign | ✅ |
| POST | `/api/campaigns/:id/like` | Like/unlike campaign | ✅ |
| POST | `/api/campaigns/:id/invest` | Invest in campaign | ✅ |
| POST | `/api/campaigns/:id/comments` | Add comment | ✅ |
| GET | `/api/campaigns/:id/comments` | Get comments | ❌ |

Full documentation: [Backend/API_ROUTES_DOCUMENTATION.md](./Backend/API_ROUTES_DOCUMENTATION.md)

## 💾 Database Schema

### Users Table
- User accounts (individuals or organizations)
- Authentication data (email, password hash)
- Profile information

### Campaigns Table
- Campaign details (title, description, goal)
- Category and type (donation/investment)
- Status tracking (active, funded, expired)
- Financial data (goal, raised amount)

### Campaign Media Table
- Images and videos for campaigns
- Cloudinary URLs

### Rewards Table
- Reward tiers for campaigns
- Amount and description

### Investments Table
- User contributions to campaigns
- Amount and timestamp

### Campaign Likes Table
- User likes on campaigns

### Campaign Discussions Table
- Comments on campaigns

## 🎨 Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS
- **Icons:** Heroicons
- **State Management:** Context API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (NeonDB)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Cloud Storage:** Cloudinary
- **CORS:** cors middleware
- **Cookie Parsing:** cookie-parser

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication (30-day expiry)
- ✅ HTTP-only cookies for token storage
- ✅ CORS enabled for cross-origin requests
- ✅ SQL injection protection (parameterized queries)
- ✅ File type validation (images and videos only)
- ✅ File size limits (images: 10MB, videos: 100MB)

## 📱 Responsive Design

The frontend is built mobile-first with Tailwind CSS:

- **Mobile (< 768px):** Single column layout, hamburger menu
- **Tablet (768px - 1024px):** 2-column grid for campaigns
- **Desktop (> 1024px):** 3-column grid, expanded navigation

## 🎯 User Flows

### Campaign Creator Flow
1. Register/Login
2. Click "Start Campaign"
3. Fill campaign details
4. Upload images (1-5) and video (optional)
5. Add reward tiers (optional)
6. Launch campaign
7. Share with network
8. Track progress and backers

### Backer Flow
1. Browse campaigns (filter by category/type)
2. View campaign details
3. Register/Login (if not authenticated)
4. Click "Back this project"
5. Enter contribution amount
6. Confirm investment
7. Receive confirmation

## 🚧 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications (campaign updates, new backers)
- [ ] User profiles and dashboards
- [ ] Campaign updates and milestones
- [ ] Social media integration
- [ ] Advanced analytics
- [ ] Admin panel
- [ ] Multi-language support
- [ ] Mobile apps (React Native)

## 🐛 Known Issues

- None at the moment! 🎉

## 📖 Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get started in 5 minutes
- [API Documentation](./Backend/API_ROUTES_DOCUMENTATION.md) - Complete API reference
- [Frontend README](./Frontend/README.md) - Frontend-specific docs
- [Backend README](./Backend/README.md) - Backend-specific docs (if exists)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- [NeonDB](https://neon.tech) - Serverless PostgreSQL
- [Cloudinary](https://cloudinary.com) - Media management
- [Heroicons](https://heroicons.com) - Beautiful icons
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS

---

**Made with ❤️ for the crowdfunding community**


