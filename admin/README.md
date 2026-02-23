STORE/
├── admin/                 # Admin panel React application
│   ├── src/
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx             # Main layout wrapper for admin pages
│   │   │   └── Sidebar.jsx                  # Admin sidebar navigation component
│   │   ├── components/
│   │   │   ├── common/                      # Reusable common components
│   │   │   │   ├── Header.jsx               # Admin header with user menu
│   │   │   │   ├── SearchBar.jsx            # Search input component
│   │   │   │   ├── DataTable.jsx            # Reusable table with sorting/pagination
│   │   │   │   ├── ActionButtons.jsx        # Edit/delete/view action buttons
│   │   │   │   ├── StatusBadge.jsx          # Status indicator (active/paid/pending)
│   │   │   │   └── LoadingSkeleto.jsx       # Loading indicator
│   │   │   ├── modals/                       # Modal components
│   │   │   │   ├── DebtPaymentModal.jsx     # Modal for processing debt payments
│   │   │   │   ├── ConfirmModal.jsx         # Confirmation dialog modal
│   │   │   │   └── ProductModal.jsx         # Product add/edit modal
│   │   │   └── forms/                        # Form components
│   │   │       ├── ProductForm.jsx          # Product creation/editing form
│   │   │       └── DebtorForm.jsx           # Debtor information form
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx            # Admin dashboard overview
│   │   │   ├── ProductsPage.jsx             # Product management list view
│   │   │   ├── AddProductPage.jsx           # Add new product page
│   │   │   ├── EditProductPage.jsx          # Edit existing product page
│   │   │   ├── DebtorsPage.jsx              # Main debt management page
│   │   │   ├── ActiveDebtsPage.jsx          # View active debts only
│   │   │   ├── SettledDebtsPage.jsx         # View settled/paid debts
│   │   │   ├── DebtorDetailsPage.jsx        # Individual debtor details
│   │   │   └── LoginPage.jsx                # Admin login page
│   │   ├── hooks/
│   │   │   ├── useProducts.js               # Custom hook for product operations
│   │   │   ├── useDebtors.js                # Custom hook for debtor operations
│   │   │   └── useAuth.js                    # Custom hook for authentication
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── axiosConfig.js           # Axios configuration and interceptors
│   │   │   │   ├── productApi.js            # Product API service calls
│   │   │   │   ├── debtorApi.js             # Debtor API service calls
│   │   │   │   └── authApi.js               # Authentication API calls
│   │   │   └── socket/
│   │   │       └── socketService.js         # WebSocket service for real-time updates
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── productSlice.js          # Redux slice for products
│   │   │   │   ├── debtorSlice.js           # Redux slice for debtors
│   │   │   │   └── authSlice.js             # Redux slice for authentication
│   │   │   └── store.js                      # Redux store configuration
│   │   ├── utils/
│   │   │   ├── debtHelpers.js               # Helper functions for debt calculations
│   │   │   ├── formatters.js                # Date/currency formatters
│   │   │   └── constants.js                  # Admin panel constants
│   │   ├── routes/
│   │   │   ├── AdminRoutes.jsx              # Admin route definitions
│   │   │   └── ProtectedRoute.jsx           # Protected route wrapper component
│   │   ├── App.jsx                           # Main admin app component
│   │   └── main.jsx                          # Admin app entry point
│   ├── package.json                          # Admin dependencies and scripts
│   ├── .env                                  # Admin environment variables
│   └── vite.config.js                         # Vite build configuration
│
├── client/                # Customer-facing React application
│   ├── public/
│   │   ├── index.html                        # Main HTML entry point for client
│   │   └── images/                            # Client images and assets
│   ├── src/
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx                # Main client layout wrapper
│   │   │   ├── Header.jsx                     # Client header with navigation
│   │   │   └── Footer.jsx                     # Client footer component
│   │   ├── components/
│   │   │   ├── common/                         # Reusable client components
│   │   │   │   ├── Navbar.jsx                  # Navigation bar
│   │   │   │   ├── ProductCard.jsx             # Product display card
│   │   │   │   ├── CategoryList.jsx            # Category navigation list
│   │   │   │   ├── CartIcon.jsx                # Shopping cart icon with count
│   │   │   │   ├── LoadingSpinner.jsx          # Loading indicator
│   │   │   │   └── ErrorBoundary.jsx           # Error boundary component
│   │   │   ├── modals/                          # Client modal components
│   │   │   │   ├── CartModal.jsx                # Shopping cart modal
│   │   │   │   ├── CheckoutModal.jsx            # Checkout confirmation modal
│   │   │   │   ├── LoginModal.jsx               # Login/signup modal
│   │   │   │   └── DebtPaymentModal.jsx         # Customer debt payment modal
│   │   │   └── forms/                            # Client form components
│   │   │       ├── LoginForm.jsx                 # Login form
│   │   │       ├── RegisterForm.jsx              # Registration form
│   │   │       └── CheckoutForm.jsx              # Checkout form
│   │   ├── pages/
│   │   │   ├── HomePage.jsx                      # Client home page
│   │   │   ├── ProductsPage.jsx                  # Product listing page
│   │   │   ├── ProductDetailsPage.jsx            # Single product details
│   │   │   ├── CartPage.jsx                       # Shopping cart page
│   │   │   ├── CheckoutPage.jsx                   # Checkout process page
│   │   │   ├── MyAccountPage.jsx                  # Customer account dashboard
│   │   │   ├── MyDebtsPage.jsx                    # Customer debt overview
│   │   │   ├── PaymentPage.jsx                     # Payment processing page
│   │   │   ├── PaymentHistoryPage.jsx              # Payment history view
│   │   │   └── ContactPage.jsx                     # Contact information page
│   │   ├── hooks/
│   │   │   ├── useProducts.js                     # Custom hook for product data
│   │   │   ├── useCart.js                          # Custom hook for cart operations
│   │   │   ├── useAuth.js                          # Custom hook for client auth
│   │   │   └── useMyDebts.js                       # Custom hook for personal debts
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── axiosConfig.js                 # Axios client configuration
│   │   │   │   ├── productApi.js                   # Client product API calls
│   │   │   │   ├── cartApi.js                      # Cart API calls
│   │   │   │   ├── orderApi.js                     # Order API calls
│   │   │   │   ├── paymentApi.js                   # Payment API calls
│   │   │   │   └── authApi.js                      # Client authentication API
│   │   │   └── socket/
│   │   │       └── socketService.js                # Client WebSocket service
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── productSlice.js                 # Client product state
│   │   │   │   ├── cartSlice.js                    # Shopping cart state
│   │   │   │   ├── orderSlice.js                   # Order state management
│   │   │   │   ├── authSlice.js                    # Client auth state
│   │   │   │   └── debtSlice.js                    # Personal debt state
│   │   │   └── store.js                             # Client Redux store
│   │   ├── utils/
│   │   │   ├── cartHelpers.js                      # Cart utility functions
│   │   │   ├── formatters.js                       # Client-side formatters
│   │   │   └── constants.js                         # Client constants
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx                       # Client route definitions
│   │   │   └── ProtectedRoute.jsx                  # Protected client routes
│   │   ├── styles/
│   │   │   ├── global.css                          # Global styles
│   │   │   └── themes/                              # Theme configurations
│   │   ├── App.jsx                                  # Main client app component
│   │   └── main.jsx                                 # Client app entry point
│   ├── package.json                                 # Client dependencies
│   ├── .env                                         # Client environment variables
│   └── vite.config.js                               # Client Vite config
│
├── backend/                         # Backend Node.js/Express application
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js                         # MongoDB connection setup
│   │   │   ├── auth.js                              # JWT authentication config
│   │   │   ├── constants.js                          # Backend constants
│   │   │   └── roles.js                              # User role definitions
│   │   ├── models/
│   │   │   ├── Product.model.js                      # Product schema
│   │   │   ├── Debtor.model.js                       # Debtor schema
│   │   │   ├── Payment.model.js                      # Payment transaction schema
│   │   │   ├── User.model.js                         # Combined user model
│   │   │   ├── Order.model.js                        # Customer order schema
│   │   │   ├── Cart.model.js                         # Shopping cart schema
│   │   │   └── AuditLog.model.js                     # Activity audit log
│   │   ├── controllers/
│   │   │   ├── admin/
│   │   │   │   ├── productController.js              # Admin product management
│   │   │   │   ├── debtorController.js               # Admin debtor management
│   │   │   │   ├── paymentController.js              # Admin payment processing
│   │   │   │   ├── userController.js                 # Admin user management
│   │   │   │   └── reportController.js               # Report generation
│   │   │   └── client/
│   │   │       ├── productController.js              # Client product access
│   │   │       ├── cartController.js                 # Client cart operations
│   │   │       ├── orderController.js                # Client order management
│   │   │       ├── paymentController.js              # Client payment processing
│   │   │       └── authController.js                 # Client authentication
│   │   ├── routes/
│   │   │   ├── admin/
│   │   │   │   ├── productRoutes.js                  # Admin product routes
│   │   │   │   ├── debtorRoutes.js                   # Admin debtor routes
│   │   │   │   ├── paymentRoutes.js                  # Admin payment routes
│   │   │   │   ├── userRoutes.js                     # Admin user routes
│   │   │   │   └── reportRoutes.js                   # Report routes
│   │   │   └── client/
│   │   │       ├── productRoutes.js                  # Client product routes
│   │   │       ├── cartRoutes.js                     # Client cart routes
│   │   │       ├── orderRoutes.js                    # Client order routes
│   │   │       ├── paymentRoutes.js                   # Client payment routes
│   │   │       └── authRoutes.js                      # Client auth routes
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js                      # JWT verification
│   │   │   ├── roleMiddleware.js                      # Role-based access control
│   │   │   ├── validationMiddleware.js                # Input validation
│   │   │   ├── errorMiddleware.js                     # Error handling
│   │   │   └── rateLimitMiddleware.js                 # Rate limiting
│   │   ├── services/
│   │   │   ├── admin/
│   │   │   │   ├── debtorService.js                   # Admin debt business logic
│   │   │   │   ├── paymentService.js                  # Admin payment logic
│   │   │   │   └── reportService.js                   # Report generation logic
│   │   │   └── client/
│   │   │       ├── cartService.js                     # Cart business logic
│   │   │       ├── orderService.js                    # Order business logic
│   │   │       └── paymentService.js                  # Client payment logic
│   │   ├── utils/
│   │   │   ├── debtCalculator.js                      # Debt calculation utilities
│   │   │   ├── validators.js                          # Data validators
│   │   │   ├── helpers.js                             # General helpers
│   │   │   └── emailService.js                        # Email notification service
│   │   └── app.js                                      # Express app setup
│   ├── server.js                                       # Server entry point
│   ├── package.json                                    # Backend dependencies
│   └── .env                                            # Backend environment variables
│
├── docker-compose.yml                                   # Docker services configuration
└── README.md   


Complete E-commerce Project Explanation
PROJECT OVERVIEW
This is a complete e-commerce solution that serves two types of users: customers who can browse products and shop, and admins who manage products and track customer debts. The system combines traditional e-commerce with a built-in credit/debt management system, allowing businesses to sell on credit and track payments efficiently.

CORE FUNCTIONALITY
For Customers:
Customers can browse products by categories, search and filter items, and manage their shopping cart by adding or removing products. The platform offers credit purchase options, allowing customers to buy now and pay later. Each customer has a personal debt dashboard where they can view their total outstanding balance, complete payment history, and individual purchase records. Customers can make partial or full payments online through the self-service payment portal, and manage their account settings and order history.

For Admins:
Administrators have full control over product management with complete CRUD operations. The debt management system allows admins to add new debtors with purchase details, track active, partial, and settled debts separately, and process both full and partial payments. When processing payments, the system automatically updates debtor statuses and calculates remaining balances. Admins can access a comprehensive dashboard showing sales overviews, active debts, and business performance metrics. A complete audit trail tracks all critical actions within the system.

DEBT MANAGEMENT WORKFLOW
The debt management process begins when an admin adds a customer with purchase details, and the system calculates the total debt and creates a record with an "active" status. When payments are made either by admin or customer online, the system calculates the new balance. If fully paid, the debtor moves to "settled" status; if partially paid, the status becomes "partial". Every payment transaction is recorded in the payment history, and the system maintains three distinct categories: active debts for people who owe money, partial debts for people with remaining balances, and settled debts as a payment history archive.

TECHNICAL ARCHITECTURE
Frontend Structure:
The frontend consists of two separate React applications. The admin panel includes pages for dashboard overview, product management, debtor tracking, and payment processing, with components like data tables, modals, forms, and charts. The customer store features pages for home, product listing, product details, cart, checkout, and personal debt management, with components like product cards, navigation bars, and checkout forms. Both applications use Redux for state management, with the admin panel handling products, debtors, and authentication, while the customer store manages products, cart, orders, authentication, and personal debts.

Backend Structure:
The backend is built with Node.js and Express, featuring separate API routes for admin and client operations. RESTful endpoints are protected with JWT authentication and role-based access control. The MongoDB database includes collections for users (combined model for admins and customers), products with inventory and pricing, debtors tracking purchases and balances, payments with complete transaction history, customer orders, and audit logs tracking all critical actions. The system includes middleware for authentication, role verification, input validation, error handling, and rate limiting.

PROJECT STRUCTURE
The project is organized into three main folders. The admin folder contains the React admin panel application with its own public assets, source code with layouts, components, pages, hooks, services, store, and routes. The client folder holds the customer-facing React application with similar structure but focused on shopping experience. The backend folder contains the Node.js server with configuration files, MongoDB models, controllers separated for admin and client, routes, middleware, services, and utilities.

KEY TECHNOLOGIES
The frontend uses React with Vite for fast development, Redux Toolkit for state management, Axios for API calls, and React Router for navigation. The backend employs Node.js with Express framework, MongoDB with Mongoose ODM, JWT for authentication, and Bcrypt for password security. Development and deployment tools include Docker for containerization, Git for version control, and environment-based configuration.

UNIQUE SELLING POINTS
The platform's main differentiator is its integrated credit system with built-in debt management, going beyond standard e-commerce functionality. It provides dual interfaces with separate optimized experiences for admins and customers. The system offers payment flexibility supporting partial payments and remaining balance tracking. Real-time updates through WebSocket integration provide live notifications, while complete audit trails maintain history of all debt-related actions. The scalable architecture with separated concerns makes it easy to add new features.

BUSINESS USE CASES
A small retail business can use this platform to sell products in-store with credit options, replacing manual payment tracking with a digital system. Wholesale distributors can provide credit to regular business customers and track bulk orders with payment schedules. Local grocery stores can allow regular customers to buy on credit with a simple interface for quick debt recording and payment processing.

DEVELOPMENT CHALLENGES AND SOLUTIONS
The complex debt status management was solved by implementing a state machine with active, partial, and settled statuses. Maintaining data consistency across admin and client interfaces was achieved through a single backend with role-based access control. Partial payment calculations are handled through automated remaining balance updates with each transaction.

FUTURE ENHANCEMENTS
Planned improvements include integrating payment gateways like Stripe or PayPal for online payments, implementing email notifications for automated receipts and payment reminders, developing a React Native mobile app for customers, adding advanced analytics dashboards with detailed reporting, enabling bulk operations for importing and exporting debtors via CSV, and integrating SMS functionality for payment reminders.

This comprehensive e-commerce platform successfully combines traditional online shopping with flexible credit management, providing businesses with a powerful tool to increase sales through credit options while maintaining complete control over debt tracking and payment collection.

# Project documentation