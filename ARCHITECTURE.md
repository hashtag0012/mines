# MINES CLOTHING - Architecture & Design Documentation

## Design & UI/UX Decisions

### Art Direction
- **Philosophy**: "Control. Silence. Form." A brutalist yet refined aesthetic that emphasizes negative space and high-contrast typography.
- **Typography**: 
  - **Display**: `Cormorant Garamond` (Serif) for editorial headlines and emotional resonance.
  - **Body**: `Inter` (Sans) for clean, readable UI elements.
  - **Technical**: `JetBrains Mono` for pricing, specs, and metadata.
- **Color Palette**: Strictly monochromatic. Off-whites (`#fafafa`), deep blacks (`#1a1a1a`), and concrete greys. No gradients or shadows unless functional.

### User Experience
- **Store Modes**:
  - **Closed (Default)**: Builds hype. Users can view the philosophy but cannot purchase. Capture phone numbers for drops.
  - **Open**: Full commerce functionality.
- **Mobile-First**: Touch targets are large (>44px). Navigation is simplified on mobile.
- **Animations**: 
  - Used `GSAP` for high-performance, timeline-based animations.
  - **Entry**: Staggered fade-ups for text and products.
  - **Scroll**: Parallax effects on hero images and reveal on scroll for product cards.
  - **Interaction**: Micro-interactions on buttons and links (hover states).

## Backend Architecture (Proposed)

Since this is a frontend prototype, the backend is simulated. However, for a production build, we recommend the following:

### Tech Stack
- **Framework**: Node.js with Express or NestJS.
- **Database**: PostgreSQL (Relational integrity is crucial for inventory).
- **ORM**: Drizzle ORM or Prisma.
- **Authentication**: Passport.js or Auth0.

### Database Schema

```sql
-- Users (Customers & Admins)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer', -- 'admin', 'customer'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft', -- 'active', 'archived', 'draft'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Product Sizes (Inventory Unit)
CREATE TABLE product_sizes (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  size_label VARCHAR(10) NOT NULL, -- 'S', 'M', 'L', 'XL'
  inventory_count INTEGER DEFAULT 0,
  UNIQUE(product_id, size_label)
);

-- Product Images
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id), -- Nullable for guest checkout
  guest_email VARCHAR(255),
  guest_phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending', -- 'paid', 'shipped', 'delivered', 'cancelled'
  total_amount DECIMAL(10, 2) NOT NULL,
  stripe_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  size_label VARCHAR(10),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- Drop Signups (Phone Numbers)
CREATE TABLE drop_signups (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Admin Workflows

1.  **Drop Management**:
    *   Admin toggles "Store Mode" globally.
    *   Before drop: Set products to `active`, ensure inventory is loaded.
    *   On drop time: Toggle Store to `Open`.
    *   System sends SMS to `drop_signups` table via Twilio/SNS.

2.  **Order Fulfillment**:
    *   Dashboard view of "Paid" orders.
    *   Print shipping labels (Shippo/EasyPost integration).
    *   Mark as "Shipped" -> triggers email/SMS to customer.

3.  **Inventory Control**:
    *   Real-time decrement of `product_sizes.inventory_count` on checkout.
    *   Hold inventory for 10 mins during checkout session (optional redis lock).

## GSAP Animation Strategy

We utilize `GSAP` + `ScrollTrigger` for performance and control.

*   **Timeline Control**: Complex sequences (like the Hero reveal) are managed via `gsap.timeline()` to ensure elements appear in the correct order regardless of loading speed.
*   **ScrollTrigger**: Used for "lazy loading" animations. Elements below the fold (Product Cards) have `opacity: 0` initially and animate to `opacity: 1, y: 0` when they enter the viewport.
*   **Performance**: We animate `transform` and `opacity` properties only to trigger GPU acceleration and avoid layout thrashing.
