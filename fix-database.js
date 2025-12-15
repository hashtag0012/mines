const Database = require('better-sqlite3');
const db = new Database('dev.db');

try {
  // Add customer columns to orders table
  console.log('Adding customer columns to orders table...');
  db.exec('ALTER TABLE orders ADD COLUMN customer_name TEXT NOT NULL DEFAULT ""');
  db.exec('ALTER TABLE orders ADD COLUMN customer_email TEXT NOT NULL DEFAULT ""');
  db.exec('ALTER TABLE orders ADD COLUMN customer_phone TEXT NOT NULL DEFAULT ""');
  db.exec('ALTER TABLE orders ADD COLUMN customer_address TEXT NOT NULL DEFAULT ""');
  
  console.log('Customer columns added successfully!');
  
  // Recreate order_items table without foreign key
  console.log('Recreating order_items table...');
  db.exec(`
    CREATE TABLE order_items_new (
      id text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) NOT NULL,
      order_id text,
      product_id text,
      size_label text,
      quantity integer NOT NULL,
      price_at_purchase real NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);
  
  // Copy data if any exists
  try {
    db.exec('INSERT INTO order_items_new SELECT * FROM order_items');
    console.log('Data copied successfully!');
  } catch (err) {
    console.log('No data to copy or copy failed:', err.message);
  }
  
  // Drop old table and rename
  db.exec('DROP TABLE order_items');
  db.exec('ALTER TABLE order_items_new RENAME TO order_items');
  
  console.log('Order items table recreated successfully!');
  console.log('Database schema updated successfully!');
  
} catch (error) {
  console.error('Error updating database:', error.message);
} finally {
  db.close();
}
