DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	id INT AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NULL,
	department_name VARCHAR(30) NULL,
	price DEC(5,2) NULL,
	stock_quantity INT(5) NULL,
	PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
    ("Flying Monkey", "Pet Toys", 10, 500),
    ("Squeaky T-Rex", "Pet Toys", 15, 500),
    ("Sock-Scented Plush", "Pet Toys", 20, 800),
    ("Talking Babbel Ball", "Pet Toys", 18, 100),
    ("Interactive Squirrel", "Pet Toys", 22, 1000),
    ("Anova Culinary Sous Vide", "Kitchen", 159, 1000),
    ("Test Kitchen Sous Vide Cookbook", "Kitchen", 15, 200),
    ("Sousvide Vacuum Sealer", "Kitchen", 30, 300),
    ("Node.js in Action", "Books", 11, 70),
    ("A Smarter Way to Learn JavaScript", "Books", 3, 50);

SELECT * FROM products;