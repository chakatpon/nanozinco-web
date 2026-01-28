# Nano Zinco Web Application

A modern web application for ordering premium zinc supplements online, built with Next.js 14, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- **OTP Authentication** - Secure login via SMS OTP using DeeSMS API
- **PIN Authentication** - Quick login with 6-digit PIN
- **Product Catalog** - Browse and search zinc supplement products
- **Shopping Cart** - Add products to cart with quantity management
- **Multi-language Support** - Thai, English, and Chinese
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Docker Support** - Easy deployment with Docker and Docker Compose

## 📋 Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0 (or Node.js >= 20.9.0)
- Docker and Docker Compose (for containerized deployment)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **State Management:** React Context API
- **Package Manager:** Bun
- **Deployment:** Docker, Vercel, or Standalone

## 📦 Getting Started

### Local Development

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your DeeSMS API credentials:
   ```env
   NEXT_PUBLIC_OTP_API_KEY=your_api_key_here
   NEXT_PUBLIC_OTP_SECRET_KEY=your_secret_key_here
   NEXT_PUBLIC_OTP_SENDER_NAME=YOUR-SENDER-NAME
   ```

3. **Start development server**
   ```bash
   bun dev
   ```

4. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
nanozinco-web/
├── src/
│   └── app/                    # Next.js App Router pages
│       ├── login/              # Login page with phone input
│       ├── otp/                # OTP verification page
│       ├── set-pin/            # Set 6-digit PIN page
│       ├── enter-pin/          # Enter PIN for quick login
│       ├── products/           # Product catalog page
│       ├── cart/               # Shopping cart page
│       ├── profile/            # User profile page
│       ├── layout.tsx          # Root layout with providers
│       └── page.tsx            # Home page (redirect)
├── contexts/
│   ├── AuthContext.tsx         # Authentication state
│   ├── LanguageContext.tsx     # Multi-language support
│   └── CartContext.tsx         # Shopping cart state
├── services/
│   └── otpService.ts           # OTP API integration
├── types/
│   └── index.ts                # TypeScript type definitions
├── constants/
│   └── products.ts             # Product data
├── public/                     # Static assets
├── Dockerfile                  # Docker build configuration
├── docker-compose.yml          # Docker Compose setup
└── next.config.mjs             # Next.js configuration
```

## 🔐 Authentication Flow

1. **Login Page** - User enters phone number (Thai format: 0XXXXXXXXX)
2. **OTP Verification** - 6-digit OTP sent via SMS, user verifies
3. **PIN Setup** - First-time users create a 6-digit PIN
4. **Quick Login** - Returning users can use PIN for faster login

## 🌍 Multi-language Support

The app supports three languages:
- 🇹🇭 **Thai (ไทย)** - Default language
- 🇬🇧 **English (EN)**
- 🇨🇳 **Chinese (中文)**

Language selection is persisted in localStorage and available on all pages.

## 🛒 Shopping Features

- Browse product catalog with images and descriptions
- Search products by name or description
- Add items to cart with quantity selection
- View cart with total price calculation
- Update quantities or remove items

## 📱 OTP API Configuration

The application uses DeeSMS API for OTP authentication. Configure your API credentials using environment variables:

**Required Environment Variables:**
```env
NEXT_PUBLIC_OTP_API_URL=https://apicall.deesmsx.com/v1
NEXT_PUBLIC_OTP_API_KEY=your_api_key_here
NEXT_PUBLIC_OTP_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_OTP_SENDER_NAME=YOUR-SENDER-NAME
```

Get your API credentials from [DeeSMS](https://www.deesmsx.com/).

Phone numbers are automatically formatted from Thai format (0XXXXXXXXX) to international format (66XXXXXXXXX).

## 🔐 Environment Variables

Create a `.env.local` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env.local
```

**Available Environment Variables:**

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_OTP_API_URL` | DeeSMS API base URL | `https://apicall.deesmsx.com/v1` |
| `NEXT_PUBLIC_OTP_API_KEY` | Your DeeSMS API key | Required |
| `NEXT_PUBLIC_OTP_SECRET_KEY` | Your DeeSMS secret key | Required |
| `NEXT_PUBLIC_OTP_SENDER_NAME` | SMS sender name | `NANO-ZINCO` |

⚠️ **Security Note:** Never commit `.env.local` to version control. The `.env.example` file is provided as a template.

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_OTP_API_KEY`
   - `NEXT_PUBLIC_OTP_SECRET_KEY`
   - `NEXT_PUBLIC_OTP_SENDER_NAME`
4. Deploy automatically

### Standalone Build
```bash
bun build
bun start
```

### Docker
1. **Ensure `.env.local` exists with your credentials**
2. **Build and run:**
   ```bash
   docker-compose up -d
   ```
3. **Or build with specific environment variables:**
   ```bash
   docker build \
     --build-arg NEXT_PUBLIC_OTP_API_KEY=your_key \
     --build-arg NEXT_PUBLIC_OTP_SECRET_KEY=your_secret \
     -t nanozinco-web .
   
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_OTP_API_KEY=your_key \
     -e NEXT_PUBLIC_OTP_SECRET_KEY=your_secret \
     nanozinco-web
   ```

## 📝 Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint

## 🤝 Related Projects

- **Mobile App:** React Native + Expo (nanozinco-228)
- **Web App:** Next.js + React (nanozinco-web) ← You are here

## 📄 License

Private - Nano Zinco

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
