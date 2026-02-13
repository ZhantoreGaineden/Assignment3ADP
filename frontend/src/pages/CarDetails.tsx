import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api, { getAssetUrl } from '../api/client';
import { Car, ApiError } from '../types';

const CarDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await api.get(`/cars/${id}`);
                setCar(response.data);
            } catch (error: unknown) {
                if ((error as ApiError).response?.status === 404) {
                    toast.error('Asset not found');
                }
                console.error('Error fetching car:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!car) return;

        setSubmitting(true);
        try {
            await api.post('/leads', {
                car_model: `${car.make} ${car.model}`,
                name: formData.name,
                phone: formData.phone
            });
            setSubmitted(true);
            toast.success('Inquiry registered! Our sales team will contact you.');
        } catch {
            toast.error('Failed to submit. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '8rem 0', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '2px' }}>VERIFYING ASSET SPECIFICATIONS...</div>;
    if (!car) return <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>Asset not found in current inventory.</div>;

    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>
            <Toaster position="top-right" />
            <motion.button
                onClick={() => navigate(-1)}
                style={{ background: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}
                whileHover={{ x: -10 }}
            >
                <ChevronLeft size={16} /> Back to Inventory
            </motion.button>

            <div className="car-details-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '6rem', alignItems: 'start' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="car-image-container" style={{ aspectRatio: '16/9', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img
                            src={getAssetUrl(car.image_url) || 'https://images.unsplash.com/photo-1542362567-b055002b97f4?auto=format&fit=crop&q=80&w=1200'}
                            alt={car.model}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542362567-b055002b97f4?auto=format&fit=crop&q=80&w=800';
                            }}
                        />
                    </div>

                    <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Region of Origin</p>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Asia-Pacific Market</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Ownership Status</p>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Available for Purchase</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Stock Status</p>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem', textTransform: 'capitalize' }}>{car.status === 'available' ? 'In Stock' : car.status}</p>
                        </div>
                    </div>

                    {car.vin && (
                        <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid var(--border)', background: '#fcfcfc', display: 'block' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Unique Asset Identifier (VIN)</p>
                            <p style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '3px', fontWeight: 600 }}>{car.vin}</p>
                        </div>
                    )}

                    <div style={{ marginTop: '3rem', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                        <h4 style={{ color: 'var(--text)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Investment Overview</h4>
                        This premium vehicle is part of our Enterprise Portfolio. Sourced from preferred multi-brand hubs, it represents the highest standards of automotive excellence. All customs duties for Kazakhstan have been processed and the vehicle is ready for legal transfer.
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '3px' }}>Asset Acquisition</span>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 400, margin: '1rem 0 2rem', color: 'var(--text)' }}>{car.make} <span style={{ fontStyle: 'italic' }}>{car.model}</span></h1>

                    <div style={{ marginBottom: '3.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                            <span style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>${car.price_usd?.toLocaleString()}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '1px' }}>US DOLLARS</span>
                        </div>
                        {car.price_kzt && (
                            <div style={{ color: 'var(--primary)', fontWeight: 600, marginTop: '0.75rem', fontSize: '1.25rem' }}>
                                ₸ {car.price_kzt.toLocaleString()} KZT
                            </div>
                        )}
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Price includes all localized taxes and fees.</p>
                    </div>

                    <div style={{ background: '#fff', padding: '3rem', border: '1px solid var(--secondary)', boxShadow: '20px 20px 0px rgba(0,0,0,0.02)' }}>
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><CheckCircle2 size={48} /></div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 400 }}>Acquisition Request Logged</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>A senior investment advisor will review your request and contact you for a private viewing.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    style={{ marginTop: '2.5rem', color: 'var(--secondary)', fontWeight: 600, background: 'none', borderBottom: '1px solid currentColor', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}
                                >
                                    Inquire on another asset
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h3 style={{ marginBottom: '2rem', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Express Interest</h3>
                                <div className="form-group">
                                    <label>Customer Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Primary Contact</label>
                                    <input
                                        type="tel"
                                        placeholder="+7 (___) ___ __ __"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', padding: '1.25rem' }} disabled={submitting}>
                                    {submitting ? 'PROCESSING...' : 'REQUEST ACQUISITION DATA'}
                                </button>
                                <p style={{ fontSize: '0.65rem', color: '#999', marginTop: '2rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Your data is encrypted and managed via AutoHub Enterprise.
                                </p>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CarDetails;
