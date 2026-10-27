# Socktales — Full-Stack E-Commerce Platform

> **College Submission Project ID / Repository:** `25070521014`  
> **Brand Name:** Socktales  
> **Aesthetic:** Editorial Fashion Atelier (Luxury Dark Theme with Gold Accents)  
> **Specialization:** Movie-Inspired Merchandise Socks & Haute Footwear  

---

## 1. Executive Summary & Architectural Overview

**Socktales** is a full-stack e-commerce web platform specializing in cinematic, movie-inspired merchandise socks alongside Dark Stories, Formal occasion wear, and Everyday casual lines.

### Technology Stack Constraints & Compliance:
1. **Frontend:** React.js 18, React Router DOM v6, Vanilla CSS3 (Custom Luxury Design System), Lucide Icons, and Vite.
2. **Backend:** Node.js built-in `http` module **only**.
   - **Zero Framework Rule:** Express.js, Fastify, NestJS, Koa, and all other backend frameworks are **strictly absent**.
   - Custom native routing, request body parsing with 1MB payload protection, sliding-window rate limiting, and centralized error handling are all written directly on top of native Node.js APIs.
3. **Database:** MongoDB via the **official MongoDB Node.js Driver** (`mongodb`).
4. **Database GUI:** **MongoDB Compass** is fully supported and documented for live record inspection and verification.
5. **Transactions:** Stock decrements, order creation, and cart emptying are executed within atomic MongoDB sessions/transactions.

---

## 2. Visual Design System

The visual design is inspired by high-fashion editorial shop themes with original Socktales branding:

| Design Token | Hex / Spec | Usage |
| :--- | :--- | :--- |
| **Main Background** | `#10100F` | Near-black rich background |
| **Surface / Cards** | `#191715` | Elevated editorial product cards |
| **Primary Text** | `#F5F0E8` | Warm ivory headings and values |
| **Secondary Text** | `#B8AA9A` | Muted beige body and meta details |
| **Accent / Gold** | `#C6A77A` | Borders, highlights, badges, buttons |
| **Border Dark** | `#36312D` | Tailored borders |
| **Input Background**| `#211F1C` | Form inputs, select dropdowns |
| **Editorial Headings**| `Cormorant Garamond` | Elegant serif typography |
| **Body Typography** | `Inter` | Clean modern sans-serif |

---

## 3. Pre-Seeded Accounts for Evaluation

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Curator / Admin** | `admin@socktales.com` | `Admin@12345` | Full product CRUD, inventory stock editing, order status management, analytics |
| **Customer** | `customer@socktales.com` | `Customer@12345` | Product browsing, size/color cart additions, address checkout, order history |

> **Tip:** The `/login` page includes **"One-Click Fill"** buttons for both accounts for instant evaluation.

---

## 4. Repository & Project Structure

```
25070521014/
├── client/                     # React.js + Vite Frontend
│   ├── public/
│   │   └── favicon.svg         # Socktales brand monogram
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, CartDrawer, CollectionCircle
│   │   ├── context/            # AuthContext (sessions), CartContext (shopping bag)
│   │   ├── pages/              # Home, Shop, Collections, Details, Login, Cart, Checkout, Orders, Profile, Admin, About, Contact, 404
│   │   ├── services/           # api.js (dedicated fetch service with credentials)
│   │   ├── App.jsx             # React Router routing configuration
│   │   ├── index.css           # Custom luxury editorial CSS tokens
│   │   └── main.jsx            # DOM entry
│   ├── index.html              # Head metadata and Cormorant Garamond Google Fonts
│   ├── vite.config.js          # Vite config with /api proxy to port 5000
│   ├── package.json
│   └── .env.example
├── server/                     # Native Node.js HTTP Backend
│   ├── config/
│   │   ├── db.js               # Official MongoDB driver connection, indexes, and transactions
│   │   └── env.js              # Environment defaults loader
│   ├── controllers/            # Auth, Product, Category, Cart, Order, User controllers
│   ├── middleware/             # Native CORS, bodyParser (1MB), rateLimiter, auth & role guards
│   ├── routes/
│   │   ├── router.js           # Native URL regex router with middleware pipeline
│   │   └── api.js              # Route registry under /api/v1
│   ├── services/               # AuthService, ProductService, CartService, OrderService
│   ├── utils/                  # scrypt hashing, SHA-256 tokens, cookies, validators
│   ├── scripts/
│   │   ├── seed.js             # Catalogue, admin, and customer MongoDB seeding
│   │   └── start-db.js         # Embedded MongoDB replica set runner
│   ├── tests/                  # Native Node.js test suites (auth, products, cart/orders)
│   ├── server.js               # Native http.createServer instance
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

---

## 5. Quick Start & Execution Guide

### Prerequisites:
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **MongoDB Compass**: For verifying actual database records

---

### Step 1: Install Dependencies
Open a terminal in the root project folder:

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

---

### Step 2: Seed the MongoDB Database
Socktales includes a dedicated seeding script that inserts the Movie-Inspired catalogue and administrative accounts into MongoDB:

```bash
cd server
npm run seed
```

*Output:*
```
[Seed] Starting Socktales database seeding...
[DB] Deployment replica set detected: rs0
[DB] Indexes verified and initialized successfully.
[Seed] Seeding administrative & customer accounts...
[Seed] Seeding brand collections and categories...
[Seed] Seeding movie-inspired, dark stories, formal & casual sock catalogue...
[Seed] Seeding complete! Database is primed with products, categories, and verified accounts.
```

---

### Step 3: Start the Backend Server
Run the native Node.js HTTP server:

```bash
cd server
npm start
```

*The server will start on port 5000:*
```
=======================================================
🚀 Socktales Native HTTP Server running on port 5000
📡 API Base URL: http://localhost:5000/api/v1
🛡️  Backend: Built-in Node.js 'http' module ONLY (Zero Express)
💾 Database: MongoDB via Official Node.js Driver
=======================================================
```

---

### Step 4: Start the Frontend Client
In a separate terminal window, launch the Vite dev server:

```bash
cd client
npm run dev
```

*The frontend will be available at:*  
**`http://localhost:5173`**

---

### Step 5: Run Automated Test Suites
Run the native Node.js test runner covering auth, security, product CRUD, and transactional checkout:

```bash
cd server
npm test
```

*Test Results Summary:*
- `auth.test.js`: Password hashing with salt, timing-safe equality, registration, duplicate checks, login, logout, and session revocation (**6/6 tests passed**).
- `products.test.js`: Product creation, search, collection filtering, stock adjustment, and deletion (**4/4 tests passed**).
- `cart-order.test.js`: Cart price hydration, inventory capping, transactional order placement, atomic stock reduction, and cart clearance (**3/3 tests passed**).
- **Total: 16/16 tests passing.**

---

## 6. Inspecting Records with MongoDB Compass

To verify actual persistent records in MongoDB Compass:
1. Open **MongoDB Compass**.
2. Connect to the connection string:
   ```
   mongodb://127.0.0.1:27017/socktales?replicaSet=rs0
   ```
   *(Or if running on a custom port, use the URI printed during server startup).*
3. Inspect the `socktales` database collections:
   - `users`: Hashed passwords (`salt:derivedKey`), roles (`admin`, `customer`).
   - `sessions`: Opaque hashed session tokens (`tokenHash`) with TTL expiration.
   - `products`: Movie references (`The Matrix`, `Interstellar`, `The Godfather`), stock counts, prices, collections.
   - `categories`: Brand collection metadata.
   - `carts`: User shopping cart references and quantities.
   - `orders`: Transactional orders with full item snapshots, delivery addresses, and tracking numbers.

---

## 7. Complete REST API Documentation (`/api/v1`)

### Authentication & Sessions
- `POST /api/v1/auth/register` — Create account, hash password via `crypto.scrypt`, generate session, set `HttpOnly` cookie.
- `POST /api/v1/auth/login` — Verify credentials with timing-safe comparison, issue session cookie.
- `POST /api/v1/auth/logout` — Revoke session in MongoDB, clear cookie.
- `GET /api/v1/auth/me` — Retrieve active authenticated session user.

### Products Catalogue
- `GET /api/v1/products` — Filter products by `collection`, `category`, `size`, `color`, `inStock`, `search`, and `sort`.
- `GET /api/v1/products/:id` — Product details by MongoDB `_id` or `slug`.
- `POST /api/v1/products` — *(Admin only)* Add new design piece.
- `PUT /api/v1/products/:id` — *(Admin only)* Update product details.
- `DELETE /api/v1/products/:id` — *(Admin only)* Delete product.
- `PATCH /api/v1/products/:id/stock` — *(Admin only)* Real-time inventory adjustment.

### Collections & Categories
- `GET /api/v1/categories` — List active collections.
- `POST /api/v1/categories` — *(Admin only)* Create new category.

### Shopping Cart
- `GET /api/v1/cart` — Hydrate items with fresh database prices and stock levels.
- `POST /api/v1/cart/items` — Add item (productId, size, color, quantity).
- `PUT /api/v1/cart/items/:id` — Update quantity.
- `DELETE /api/v1/cart/items/:id` — Remove item.
- `DELETE /api/v1/cart` — Clear cart.

### Orders & Checkout
- `POST /api/v1/orders` — Atomically validate inventory, recalculate pricing from database records, deduct stock, create order, and clear cart inside a **MongoDB Transaction**.
- `GET /api/v1/orders` — List current user's past orders.
- `GET /api/v1/orders/:id` — Detailed invoice and tracking itinerary.

### Admin Console
- `GET /api/v1/admin/stats` — Revenue, order counts, product catalogue count, customer count.
- `GET /api/v1/admin/orders` — Comprehensive list of all customer orders.
- `PATCH /api/v1/admin/orders/:id/status` — Update order fulfillment status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).

---

## 8. Security Specifications

1. **Password Hashing:** Implemented via `crypto.scrypt` with a cryptographically secure 16-byte random salt per user and 64-byte derived keys. Verification uses `crypto.timingSafeEqual` to prevent timing attacks.
2. **Session Security:** 32-byte opaque tokens generated via `crypto.randomBytes`. Tokens are SHA-256 hashed before storage in MongoDB. Transmitted exclusively via `HttpOnly`, `SameSite=Lax` cookies.
3. **Role Authorization:** Distinct roles (`customer` and `admin`) validated at the middleware layer.
4. **Input Sanitization & Limits:** Body parser enforces a strict 1MB payload ceiling. Sensitive endpoints (Login, Register) feature an in-memory sliding-window rate limiter.
5. **No Client Price Trust:** All prices, discounts, and order subtotals are computed directly from database records during checkout.
#   2 5 0 7 0 5 2 1 0 1 4 - C A - 0 3  
 