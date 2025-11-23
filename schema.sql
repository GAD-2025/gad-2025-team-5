-- Bookdam Project DB Schema

-- Users Table: Stores user information for login and identification.
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL, -- Should be stored as a hash
  `nickname` VARCHAR(100) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table: Stores information about the books being sold.
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `seller_id` INT NOT NULL,
  `book_title` VARCHAR(255) NOT NULL,
  `book_description` TEXT,
  `one_line_review` VARCHAR(255),
  `price` INT NOT NULL,
  `grade` VARCHAR(50), -- e.g., 'S급 - 새 책 수준'
  `images` JSON, -- Storing a list of image URLs as a JSON array
  `allow_price_suggestion` BOOLEAN DEFAULT FALSE,
  `allow_direct_transaction` BOOLEAN DEFAULT FALSE,
  `shipping_option` VARCHAR(50), -- e.g., 'included' or 'extra'
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
