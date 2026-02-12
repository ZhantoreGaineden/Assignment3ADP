-- 1. Clean up existing tables
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS users;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create 'users' table
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       username VARCHAR(100) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager')),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create 'cars' table (Updated with image_url)
CREATE TABLE cars (
                      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                      vin VARCHAR(50) UNIQUE NOT NULL,
                      make VARCHAR(50) NOT NULL,
                      model VARCHAR(50) NOT NULL,
                      price_usd DECIMAL(12, 2) NOT NULL,
                      price_kzt DECIMAL(15, 2) DEFAULT 0,
                      status VARCHAR(20) NOT NULL DEFAULT 'transit'
                          CHECK (status IN ('available', 'transit', 'reserved', 'sold')),

    -- NEW: Image URL Column
                      image_url VARCHAR(255),

                      location VARCHAR(100),
                      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create 'leads' table
CREATE TABLE leads (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       car_model varchar(50),
                       assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
                       customer_name VARCHAR(100),
                       customer_phone VARCHAR(20) NOT NULL,
                       inquiry_type VARCHAR(50) NOT NULL,
                       status VARCHAR(20) DEFAULT 'new',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_leads_phone ON leads(customer_phone);

-- 6. Insert Mock Data (With Images)
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2a$12$YourHashedPasswordHere', 'admin');

INSERT INTO cars (vin, make, model, price_usd, status, location, image_url)
VALUES
    ('VIN111', 'Toyota', 'Camry', 25000.00, 'available', 'Almaty', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg'),
    ('VIN222', 'Zeekr', '001', 38000.00, 'transit', 'Khorgos', 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Zeekr_001_2024051001.jpg');