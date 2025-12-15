-- Add customer columns to orders table
ALTER TABLE orders ADD COLUMN customer_name TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN customer_email TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN customer_phone TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN customer_address TEXT NOT NULL DEFAULT '';

-- Remove foreign key constraint from order_items (SQLite doesn't support dropping FK directly)
-- We'll need to recreate the table
CREATE TABLE order_items_new (
    id text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) NOT NULL,
    order_id text,
    product_id text,
    size_label text,
    quantity integer NOT NULL,
    price_at_purchase real NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Copy data from old table
INSERT INTO order_items_new SELECT * FROM order_items;

-- Drop old table and rename new one
DROP TABLE order_items;
ALTER TABLE order_items_new RENAME TO order_items;
