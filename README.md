# Fashion_E-commerce

A modern full-stack fashion e-commerce web application with a React frontend and Node.js/Express backend.

---

## Tech Stack
- **Frontend:** React, Tailwind CSS, Swiper.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT, Google OAuth 2.0
- **State Management:** React Context API
- **API Communication:** RESTful APIs, Fetch API
- **Other:** Cookie-based sessions, CORS, dotenv for environment variables

---

## Implemented Features

### Frontend (React)
- **User Authentication**
  - Email/password login and signup
  - Google OAuth login (Google sign-in)
- **Product Browsing**
  - Home page with product collections (Winter, Summer, Accessories)
  - Product detail page with images, details, reviews, and similar products
  - Search results page with modern product cards
- **Cart & Orders**
  - Add to cart from product cards and detail page
  - Cart page with quantity management and checkout
  - Buy Now option for direct purchase
  - Orders page with order history, status, and "Buy it again"
- **Profile Management**
  - View and edit user profile (name, email, phone, gender, DOB, address)
  - Change password and log out
- **Customer Reviews**
  - View and submit product reviews with star ratings
  - Ratings summary and review breakdown on product page
- **UI/UX**
  - Modern, responsive design with light color scheme
  - Animated loading spinners and error states
  - Navbar with search, cart, orders, and profile (with hover effects)
  - Consistent branding and creative layouts

### Backend (Node.js/Express/MongoDB)
- **User Management**
  - Signup, login, Google OAuth, profile update, password change
- **Product Management**
  - Fetch products by category, search, and detail
  - Product reviews and ratings (if backend is updated)
- **Cart & Orders**
  - Add to cart, remove from cart, view cart
  - Place orders, view order history
- **Security**
  - JWT authentication, protected routes
  - CORS and cookie management

---

## Detailed Feature List

### Authentication & User Management
- **Email/Password Signup & Login:** Secure registration and login with hashed passwords.
- **Google OAuth Login:** One-click sign-in with Google.
- **JWT-based Session Management:** Secure, persistent login using cookies.
- **Profile Management:** View and edit profile (name, email, phone, gender, DOB, address), change password, and log out.

### Product Catalog & Search
- **Home Page:** Displays curated product collections (Winter, Summer, Accessories) with modern cards and hero banners.
- **Product Detail Page:** Shows product images, details, available sizes, offers, and similar products.
- **Search:** Full-text product search with filter options (price, category, gender, season, stock, rating).
- **Related Products:** See similar items on each product page.

### Cart & Checkout
- **Add to Cart:** Add products to cart from anywhere (home, search, product detail, similar products).
- **Cart Page:** View, update quantity, and remove items. See total price and proceed to checkout.
- **Buy Now:** Direct purchase of a single product.
- **Checkout:** Enter shipping and payment details, see order summary, and place order.

### Order Management
- **Order Placement:** Place orders from cart or buy now.
- **Order History:** View all past orders, with details, status, and delivery info.
- **Order Status:** See processing, shipped, delivered, or cancelled status.
- **Buy It Again:** Reorder previous items with one click.

### Customer Reviews & Ratings
- **Submit Reviews:** Authenticated users can submit star ratings and written reviews for products.
- **Review Display:** Product pages show all reviews, average rating, and a breakdown of star ratings.
- **Review Validation:** Prevents empty or invalid reviews.

### Admin Features
- **Admin Dashboard:** (If enabled) View/manage all orders and products, add/edit/delete products, paginate results.
- **Admin Route Protection:** Only admin users can access admin dashboard.

### UI/UX & Design
- **Modern Responsive Design:** Clean, mobile-friendly layouts with Tailwind CSS and Swiper for carousels.
- **Animated Loaders & Error States:** Consistent feedback for loading and errors.
- **Navbar:** Search, cart, orders, and profile icons with interactive hover effects.
- **Consistent Branding:** "ShopEase" branding, color scheme, and creative layouts.
- **Accessibility:** Keyboard navigation and focus states.

### Security
- **Protected Routes:** Only authenticated users can access cart, orders, profile, and checkout.
- **CORS & Cookie Management:** Secure cross-origin requests and session handling.
- **Input Validation:** Both frontend and backend validation for forms and API requests.

### Other Notable Features
- **Persistent Cart:** Cart items are stored per user in the backend.
- **Discounts & Offers:** Displayed on product and checkout pages.
- **Shipping Info:** Estimated delivery and free shipping info on product and checkout pages.
- **Logout:** Secure logout with session invalidation.

---

## How to Download and Run the Code

### 1. Clone the Repository
```bash
git clone <repo-url>
cd Fashion_E-commerce
```

### 2. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

### 3. Set Up Environment Variables
- Copy the example `.env` files (if provided) or create your own in both `server` and `client` directories.
- Add your MongoDB URI, JWT secret, and Google OAuth credentials as needed.

#### Example for `server/.env`:
```
MONGO_URI=your-mongodb-uri
JWT_Secret=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Example for `client/.env`:
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4. Start the Backend Server
```bash
cd server
npm start
```
- The backend will run on `http://localhost:4000` by default.

### 5. Start the Frontend (React)
```bash
cd ../client
npm run dev
```
- The frontend will run on `http://localhost:5173` (or another port).

### 6. Open in Browser
- Go to `http://localhost:5173` to use the app.

---

## Notes
- Google OAuth and some features require correct environment variables and Google Cloud setup.
- For test payments, you can integrate Razorpay or another gateway in test mode (see their docs for latest KYC requirements).
- Make sure MongoDB is running and accessible.