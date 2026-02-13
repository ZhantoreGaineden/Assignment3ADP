// frontend/src/pages/Catalog.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api, { getAssetUrl } from '../api/client';
import { Car } from '../types';

const Catalog: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                // Assuming your backend has a public GET /cars endpoint
                const response = await api.get('/cars');
                setCars(response.data);
            } catch (error) {
                console.error('Error fetching catalog:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '4px' }}>
        RETRIEVING ASSET PORTFOLIO...
        </div>
    );
    }

    return (
        <div className="container" style={{ padding: '4rem 2rem 8rem' }}>
    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
    <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '1rem' }}>
    GLOBAL <span style={{ fontWeight: 700 }}>PORTFOLIO</span>
    </h1>
    <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
    Browse our curated selection of premium vehicles
    </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
    {cars.length > 0 ? (
            cars.map((car, index) => (
                <motion.div
                    key={car.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        style={{ border: '1px solid var(--border)', background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
        <div style={{ height: '220px', overflow: 'hidden' }}>
        <img
            src={getAssetUrl(car.image_url)}
        alt={`${car.make} ${car.model}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542362567-b055002b97f4?auto=format&fit=crop&q=80&w=800';
    }}
        />
        </div>
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>{car.make}</h3>
    <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontStyle: 'italic' }}>{car.model}</p>
    </div>
    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
        ₸ {car.price_kzt?.toLocaleString()}
        </span>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <Link
            to={`/cars/${car.id}`}
        className="btn-primary"
        style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0.8rem', background: '#000' }}
    >
        VIEW ASSET DETAILS
    </Link>
    </div>
    </div>
    </motion.div>
    ))
    ) : (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        No assets currently available in the public portfolio.
    </div>
    )}
    </div>
    </div>
);
};

export default Catalog;