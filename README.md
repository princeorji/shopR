# shopy

Shopy is an e-commerce application.

## Repository overview

```
shopy
├─ .gitignore
├─ .prettierrc
├─ @types
│  └─ session.d.ts
├─ package-lock.json
├─ package.json
├─ README.md
├─ shopy.yaml
├─ src
│  ├─ app.ts
│  ├─ controllers
│  │  ├─ cart.ts
│  │  ├─ order.ts
│  │  ├─ product.ts
│  │  └─ user.ts
│  ├─ enums
│  │  └─ orderStatus.ts
│  ├─ index.ts
│  ├─ middlewares
│  │  ├─ auth.ts
│  │  └─ rate-limit.ts
│  ├─ models
│  │  ├─ cart.ts
│  │  ├─ cartItem.ts
│  │  ├─ category.ts
│  │  ├─ order.ts
│  │  ├─ orderItem.ts
│  │  ├─ product.ts
│  │  └─ user.ts
│  ├─ routes
│  │  ├─ cart.routes.ts
│  │  ├─ order.routes.ts
│  │  ├─ product.routes.ts
│  │  └─ user.routes.ts
│  └─ utils
│     └─ validateEnv.ts
└─ tsconfig.json

```

## Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/princeorji/shopy.git
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and define the following environment variables:

   ```
   PORT=port
   DATABASE=mongodb://host:port/db_name
   SESSION_SECRET=session_secret_key
   STRIPE_SECRET=stripe_secret_key
   ```

4. **Start the server:**

   ```
   npm start
   ```

## Usage

- The API documentation is available in the `.yaml` file.

## API Endpoints

### Users

- **POST** `/api/users/signup` - Sign up a new user.
- **POST** `/api/users/login` - Log in a user.
- **GET** `/api/users` - Get user profile.
- **GET** `/api/users/logout` - Log out a user.

### Products

- **GET** `/api/products` - Get all products.
- **GET** `/api/products/{productId}` - Get a product by Id.

### Cart

- **POST** `/api/cart` - Add an item to the cart.
- **GET** `/api/cart` - Get all items in the cart.
- **DELETE** `/api/cart/{itemId}` - Remove an item from the cart.
- **POST** `/api/cart/{cartId}/checkout` - Initiate checkout for the cart.
- **POST** `/api/cart/{cartId}/order` - Finalize the order.

### Orders

- **GET** `/api/orders` - Get all orders.
- **GET** `/api/orders/{orderId}` - Get an order by Id.

<!-- ## Run tests

```bash
# unit tests
$ npm run test
``` -->
