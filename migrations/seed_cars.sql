TRUNCATE cars CASCADE;

INSERT INTO cars (make, model, price_usd, status, image_url, vin) VALUES
-- Sport Cars (Category 1)
('Porsche', '911 GT3', 161000, 'available', 'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_SPORT_001'),
('Ferrari', 'F8 Tributo', 276000, 'available', 'https://images.unsplash.com/photo-1617814086906-d847a8bc6fca?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_SPORT_002'),
('Lamborghini', 'Huracan EVO', 261000, 'available', 'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_SPORT_003'),
('McLaren', '720S', 299000, 'available', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_SPORT_004'),
('Audi', 'R8 V10', 142000, 'available', 'https://images.unsplash.com/photo-1580881647059-923632b8fd75?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_SPORT_005'),
('Chevrolet', 'Corvette C8', 68000, 'available', 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_SPORT_006'),
('Nissan', 'GT-R Nismo', 210000, 'available', 'https://images.unsplash.com/photo-1580654712603-eb43273aff33?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_SPORT_007'),

-- Premium Cars (Category 2)
('Rolls-Royce', 'Ghost', 311000, 'available', 'https://images.unsplash.com/photo-1580679568899-be51739ba2df?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_PREM_001'),
('Bentley', 'Continental GT', 202000, 'available', 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_PREM_002'),
('Mercedes-Benz', 'S-Class', 111000, 'available', 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_PREM_003'),
('BMW', '7 Series', 95000, 'available', 'https://images.unsplash.com/photo-1535448580089-c7f9490c78b1?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_PREM_004'),
('Audi', 'A8', 87000, 'available', 'https://images.unsplash.com/photo-1592853625601-bb9d23da12fc?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_PREM_005'),
('Lexus', 'LS 500', 76000, 'available', 'https://images.unsplash.com/photo-1532988633349-d3dfb28ee834?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_PREM_006'),
('Range Rover', 'Autobiography', 152000, 'available', 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_PREM_007'),

-- Middle Class Cars (Category 3)
('Toyota', 'Camry', 26000, 'available', 'https://images.unsplash.com/photo-1601929862217-f1bf94503333?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_MID_001'), 
('Honda', 'Accord', 27000, 'available', 'https://images.unsplash.com/photo-1541348263662-e068662d82af?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_MID_002'),
('Tesla', 'Model 3', 39000, 'available', 'https://images.unsplash.com/photo-1610099610040-ab19f3a5ec35?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_MID_003'),
('Volkswagen', 'Passat', 24000, 'available', 'https://images.unsplash.com/photo-1698249173956-43c9c3dcd2f3?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_MID_004'),
('Hyundai', 'Sonata', 25000, 'available', 'https://images.unsplash.com/photo-1508974576580-36a2f92ad3bc?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_MID_005'),
('Kia', 'K5', 24000, 'available', 'https://images.unsplash.com/photo-1627667928346-5fc86d099a5c?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_MID_006'),
('Mazda', '6', 23000, 'available', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?fm=jpg&q=60&w=3000&auto=format&fit=crop', 'VIN_MID_007');
