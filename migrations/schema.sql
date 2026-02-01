-- 1. Clean up existing tables (for development/testing)
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS users;

-- 2. Create 'users' table (Admins & Sales Managers)
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(100) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager')),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create 'cars' table (Inventory)
CREATE TABLE cars (
                      id SERIAL PRIMARY KEY,
                      vin VARCHAR(50) UNIQUE NOT NULL,
                      make VARCHAR(50) NOT NULL,
                      model VARCHAR(50) NOT NULL,

    -- Prices
                      price_usd DECIMAL(12, 2) NOT NULL,       -- Base price in USD
                      price_kzt DECIMAL(15, 2) DEFAULT 0,      -- Calculated price in KZT

    -- Status Enum constraint
                      status VARCHAR(20) NOT NULL DEFAULT 'transit'
                          CHECK (status IN ('available', 'transit', 'reserved', 'sold')),

    -- Location (e.g., 'Almaty', 'Khorgos', 'Dubai')
                      location VARCHAR(100),

    -- Who reserved this car? (Nullable)
                      user_id INT REFERENCES users(id) ON DELETE SET NULL,

                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create 'leads' table (CRM / Customer Requests)
CREATE TABLE leads (
                       id SERIAL PRIMARY KEY,

    -- Which car is the customer interested in?
                       car_id INT REFERENCES cars(id) ON DELETE CASCADE,

    -- Which manager is handling this lead? (Optional at first)
                       assigned_user_id INT REFERENCES users(id) ON DELETE SET NULL,

                       customer_name VARCHAR(100),
                       customer_phone VARCHAR(20) NOT NULL,

    -- Type of inquiry
                       inquiry_type VARCHAR(50) NOT NULL
                           CHECK (inquiry_type IN ('test_drive', 'trade_in', 'credit', 'purchase')),

    -- Pipeline Status
                       status VARCHAR(20) DEFAULT 'new'
                           CHECK (status IN ('new', 'contacted', 'negotiation', 'closed_won', 'closed_lost')),

                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Indexes for Performance
-- Faster search for available cars
CREATE INDEX idx_cars_status ON cars(status);
-- Faster search for leads by phone number
CREATE INDEX idx_leads_phone ON leads(customer_phone);

-- 6. Insert Mock Data (Optional - for testing)
INSERT INTO users (username, password_hash, role)
VALUES ('admin', 'secret_hash', 'admin'),
       ('manager1', 'secret_hash', 'manager');

INSERT INTO cars (vin, make, model, price_usd, status, location)
VALUES
    ('VIN111', 'Toyota', 'Camry', 25000.00, 'available', 'Almaty'),
    ('VIN222', 'Zeekr', '001', 38000.00, 'transit', 'Khorgos'),
    ('VIN333', 'Lixiang', 'L7', 42000.00, 'sold', 'Astana');