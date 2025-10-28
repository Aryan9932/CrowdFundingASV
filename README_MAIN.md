# 🚀 CrowdFunding Platform - Multi-Model Funding Ecosystem

> A comprehensive crowdfunding platform supporting 4 funding models: Donation, Reward, Equity, and Debt-based crowdfunding with AI-powered recommendations.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.0-blue.svg)

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Funding Models](#-funding-models)
- [AI Recommendation System](#-ai-recommendation-system)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## ✨ Features

### 🎯 Core Features
- **4 Funding Models** - Donation, Reward, Equity, Debt-based crowdfunding
- **AI-Powered Recommendations** - Smart questionnaire to match users with ideal funding model
- **User Authentication** - Secure JWT-based auth with bcrypt password hashing
- **Campaign Management** - Create, edit, and manage campaigns with rich media
- **File Uploads** - Cloudinary integration for images and videos
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Search & Filters** - Find campaigns by category, funding type, and keywords
- **Payment Ready** - Razorpay integration (requires setup)

### 🎨 UI/UX
- Modern, professional design inspired by Kickstarter and Indiegogo
- Animated splash screen on first visit
- Dynamic navbar with scroll effects
- Campaign cards with progress bars and goal tracking
- Interactive funding model cards
- Smooth transitions and hover effects

### 🤖 AI Features
- Weighted scoring algorithm for funding model recommendations
- 6-question smart assessment
- Confidence scoring with primary and alternative suggestions
- Visual analytics dashboard

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Heroicons** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Cloudinary** - Media storage
- **Razorpay** - Payment gateway
- **bcryptjs** - Password hashing

### Database
- **PostgreSQL** (NeonDB supported)
- Structured schemas for users, campaigns, transactions
- SQL migrations included

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- PostgreSQL database
- Cloudinary account (optional for images)
- Razorpay account (optional for payments)

### Installation

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
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
PORT=5000
```

3. **Frontend Setup**
```bash
cd Frontend
npm install

# Create .env file
VITE_API_URL=http://localhost:5000/api
```

4. **Run the Application**

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

5. **Open Browser**
```
http://localhost:5173
```

📚 **For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

---

## 💰 Funding Models

### 1. 💝 Donation-Based
Perfect for personal causes, charities, and community projects.
- No repayment required
- Quick setup
- Emotional storytelling
- **Use Cases:** Medical bills, education, disaster relief

### 2. 🎁 Reward-Based
Ideal for creative projects and product launches.
- Pre-sell products
- Offer exclusive perks
- Build community
- **Use Cases:** Tech gadgets, games, creative arts

### 3. 📈 Equity-Based
For startups seeking serious investors.
- Offer company shares
- Long-term growth potential
- Strategic partnerships
- **Use Cases:** Startups, scale-ups, growth companies

### 4. 🏦 Debt-Based
Peer-to-peer lending for businesses.
- Fixed interest returns
- Structured repayment
- Retain ownership
- **Use Cases:** Business loans, expansion capital

---

## 🤖 AI Recommendation System

Our smart recommendation engine analyzes user needs through:

1. **Purpose Assessment** - What are you funding?
2. **Amount Analysis** - How much do you need?
3. **Timeline Evaluation** - When do you need it?
4. **Return Offerings** - What can you offer backers?
5. **Risk Tolerance** - What's your commitment level?
6. **Stage Analysis** - What's your business stage?

**Algorithm:**
- Weighted scoring system
- Confidence percentages
- Primary and alternative suggestions
- Visual breakdown of all models

**Future:** Upgrade to TensorFlow/scikit-learn ML model

---

## 📁 Project Structure

```
CrowdFundingASV/
├── Backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── Routes/           # API routes
│   ├── middleware/       # Auth & validation
│   ├── config/           # Configuration files
│   ├── migrations/       # Database migrations
│   └── server.js         # Entry point
│
├── Frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── context/      # React Context
│   │   └── App.jsx       # Main app
│   ├── public/           # Static assets
│   └── index.html        # Entry HTML
│
├── SETUP_GUIDE.md        # Complete setup guide
├── RUN_INSTRUCTIONS.md   # How to run
├── CHANGELOG.md          # Version history
└── README.md             # This file
```

---

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[RUN_INSTRUCTIONS.md](RUN_INSTRUCTIONS.md)** - How to run backend/frontend
- **[PAYMENT_DISABLED.md](PAYMENT_DISABLED.md)** - Payment feature status
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and updates

---

## 🖼 Screenshots

### Home Page
- Hero section with 4 funding model cards
- Trending campaigns showcase
- AI recommendation call-to-action

### AI Funding Advisor
- 6-question smart questionnaire
- Progress tracking
- Personalized recommendations with confidence scores

### Campaign Detail
- Full campaign information
- Progress tracking with visual bars
- Contribution buttons (payment coming soon)

### Campaign Creation
- Multi-step form
- Image upload
- Funding type selection
- Rich text description

---

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- SQL injection protection
- CORS configuration
- Input validation
- Secure file uploads

---

## 🚧 Payment Status

Payment infrastructure is **built but temporarily disabled**.

**Included:**
- Razorpay SDK integration
- Payment controller with order creation
- Payment verification
- Transaction database schema
- Success/failure pages

**To Enable:**
1. Get Razorpay test credentials
2. Add to .env files
3. Uncomment payment routes
4. Run payment migrations

See [PAYMENT_DISABLED.md](PAYMENT_DISABLED.md) for details.

---

## 🛣 Roadmap

### v1.1.0 - Payment & Dashboard
- [ ] Enable Razorpay payments
- [ ] User transaction dashboard
- [ ] Campaign analytics
- [ ] Email notifications

### v1.2.0 - Enhanced Features
- [ ] Upgrade to ML-based recommendations
- [ ] Campaign updates & communication
- [ ] Comments and Q&A
- [ ] Advanced search filters

### v2.0.0 - Scale Up
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] KYC verification
- [ ] Multi-currency support
- [ ] Admin dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

**ASV Team**

---

## 🙏 Acknowledgments

- Inspired by Kickstarter, Indiegogo, and GoFundMe
- Built with modern web technologies
- Thanks to the open-source community

---

## 📞 Support

For support, email support@crowdfund.com or open an issue.

---

**⭐ If you like this project, please give it a star!**

---

Built with ❤️ using React, Node.js, PostgreSQL, and Tailwind CSS

