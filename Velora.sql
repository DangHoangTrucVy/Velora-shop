CREATE DATABASE VeloraShop;
USE VeloraShop;

CREATE TABLE users(
	id INT PRIMARY KEY IDENTITY(1,1),
	name NVARCHAR(100),
	email NVARCHAR(100) UNIQUE,
	password NVARCHAR(255),
	phone NVARCHAR(20),
	address NVARCHAR(255),
	role NVARCHAR(20) DEFAULT 'user',
	created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE categories (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL
);

CREATE TABLE products (
	id INT PRIMARY KEY IDENTITY(1,1),
	name NVARCHAR(255) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	old_price DECIMAL(10,2),
	description NVARCHAR(MAX),
    stock INT DEFAULT 0,
    image NVARCHAR(255),
    category_id INT,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE product_images (
    id INT PRIMARY KEY IDENTITY(1,1),
    product_id INT NOT NULL,
    image_url NVARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE cart_items (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO categories (name)
VALUES 
(N'Váy'),
(N'Đầm'),
(N'Áo'),
(N'Set đồ');


INSERT INTO products (name, price, old_price, description, stock, image, category_id)
VALUES
(N'Váy trắng tiểu thư', 450000, 520000, N'Váy trắng phong cách nữ tính', 10, 'dress1.jpg', 1),
(N'Đầm hoa xanh', 390000, 450000, N'Đầm hoa mặc đi chơi', 15, 'dress2.jpg', 2),
(N'Áo kiểu công sở', 250000, 300000, N'Áo kiểu thanh lịch', 20, 'shirt1.jpg', 3);