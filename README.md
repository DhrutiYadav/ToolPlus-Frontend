# ToolPlus Frontend

ToolPlus is a production-ready SaaS marketplace for lifetime software deals. 

## Tech Stack
- React 18
- Vite
- Bootstrap & Tailwind CSS (for modern aesthetics)
- React Router DOM
- React Query & Axios
- React Hook Form
- Context API (Auth, Theme, Cart)

## Features
- **Modern UI/UX**: Dark/Light mode support, fluid animations, and premium design aesthetics.
- **Authentication**: JWT-based authentication with Refresh Token support and automated session management.
- **Marketplace Deals**: Search, browse, and filter active lifetime deals.
- **Shopping Cart**: Client-side cart management with persistence.
- **Checkout & Payments**: Integrated Razorpay payment processing.
- **Coupons & Discounts**: Real-time coupon validation and application.
- **Admin Dashboard**: Analytics, order management, deal management, and user controls.
- **Notifications**: Automated real-time alerts.

## Architecture
The frontend is built as a Single Page Application (SPA) communicating with the `.NET 10` REST API.
- `src/api`: Axios instance and API call definitions.
- `src/components`: Reusable UI components.
- `src/context`: Global state management.
- `src/pages`: Route-level views.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

## Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=https://localhost:7033/api
```

## Screenshots
*(Placeholder for project screenshots)*

## Implemented Modules
- Authentication (Login/Register)
- Deal Catalog & Details
- Admin Dashboard
- Cart & Checkout
- Order History
- Theme Management (Dark Mode)

## Pending Modules
- Advanced Admin Analytics
- User Profile Customization
- Deal Reviews functionality

## Future Enhancements
- Integration with Next.js for SSR & SEO
- Multi-currency support
- Webhooks for third-party integrations
