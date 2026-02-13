import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Plus, Trash2, ExternalLink } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api, { getAssetUrl } from '../api/client';
import { DashboardData, ApiError } from '../types';

const AdminDashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'inventory' | 'leads'>('inventory');
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [newCar, setNewCar] = useState({
        vin: '',
        model: '',
        price: 0,
        image_url: ''
    });
    const [uploading, setUploading] = useState(false);

    const fetchData = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setNewCar({ ...newCar, image_url: response.data.url });
            toast.success('Asset image verified and stored locally');
        } catch (error) {
            toast.error('Local upload failed');
            console.error('Upload Error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteCar = async (id: string) => {
        if (!window.confirm('Are you sure you want to write-off this asset? This action is permanent in your local DB.')) return;
        try {
            await api.delete(`/admin/cars/${id}`);
            toast.success('Asset removed');
            fetchData();
        } catch {
            toast.error('Removal failed');
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await api.put('/admin/cars/status', { id, status: newStatus });
            toast.success('Asset status updated');
            fetchData();
        } catch {
            toast.error('Status sync failed');
        }
    };

    const handleAddCar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/cars', newCar);
            toast.success('Asset registered successfully');
            setShowAddForm(false);
            setNewCar({ vin: '', model: '', price: 0, image_url: '' });
            fetchData();
        } catch (error: unknown) {
            const message = (error as ApiError).response?.data?.error || 'Registration failed';
            toast.error(message);
        }
    };

    if (loading) return <div className="container" style={{ padding: '8rem 0', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '4px' }}>ACCESSING SECURE ENTERPRISE LAYER...</div>;

    return (
        <div className="container" style={{ padding: '4rem 2rem 8rem' }}>
            <Toaster position="top-right" />

            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem', borderBottom: '1px solid var(--border)', paddingBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <ShieldCheck size={32} color="var(--primary)" />
                        SYSTEM <span style={{ fontWeight: 700 }}>CONTROL</span> CENTER
                    </h1>
                    <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.7rem', fontWeight: 700 }}>AutoHub Enterprise v2.4 | Standalone Node: KZ-ALA-01</p>
                </div>

                <div style={{ display: 'flex', gap: '3rem' }}>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        style={{
                            paddingBottom: '1rem',
                            borderBottom: activeTab === 'inventory' ? '3px solid var(--primary)' : '3px solid transparent',
                            color: activeTab === 'inventory' ? 'var(--text)' : 'var(--text-muted)',
                            textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 700, background: 'none'
                        }}
                    >
                        Asset Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('leads')}
                        style={{
                            paddingBottom: '1rem',
                            borderBottom: activeTab === 'leads' ? '3px solid var(--primary)' : '3px solid transparent',
                            color: activeTab === 'leads' ? 'var(--text)' : 'var(--text-muted)',
                            textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 700, background: 'none'
                        }}
                    >
                        Client Leads
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'inventory' ? (
                    <motion.div
                        key="inventory"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Portfolio Breakdown ({data?.inventory?.length || 0} Assets)</h3>
                            <button onClick={() => setShowAddForm(true)} className="btn-primary" style={{ padding: '1rem 2rem', background: '#000' }}>
                                <Plus size={18} /> REGISTER NEW ASSET
                            </button>
                        </div>

                        {showAddForm && (
                            <motion.div
                                style={{ padding: '4rem', border: '1px solid var(--border)', marginBottom: '4rem', background: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                            >
                                <form onSubmit={handleAddCar} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4rem' }}>
                                    <div className="form-group">
                                        <label>Asset VIN Designation</label>
                                        <input type="text" placeholder="Unique ID" required value={newCar.vin} onChange={e => setNewCar({ ...newCar, vin: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Make & Model Identity</label>
                                        <input type="text" placeholder="Full Brand Designation" required value={newCar.model} onChange={e => setNewCar({ ...newCar, model: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Acquisition Cost / Price (USD)</label>
                                        <input type="number" placeholder="Value in USD" required value={newCar.price} onChange={e => setNewCar({ ...newCar, price: Number(e.target.value) })} />
                                    </div>
                                    <div className="form-group">
                                        <label>{uploading ? 'Processing local upload...' : 'Reference Visual (PNG/JPG)'}</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            style={{ paddingTop: '1.5rem' }}
                                        />
                                        {newCar.image_url && <p style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '0.75rem', fontWeight: 600 }}>IMAGE ASSET SYNCED</p>}
                                    </div>
                                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '2.5rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                        <button type="button" onClick={() => setShowAddForm(false)} style={{ background: 'none', color: '#999', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: 600 }}>Discard session</button>
                                        <button type="submit" className="btn-primary" style={{ padding: '1rem 3rem' }}>Finalize Asset Entry</button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        <div className="table-container" style={{ border: '1px solid var(--border)' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Registered Asset</th>
                                        <th>Identifier (VIN)</th>
                                        <th>Valuation (USD)</th>
                                        <th>Portfolio Status</th>
                                        <th>System Ops</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.inventory?.map(car => (
                                        <tr key={car.id}>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                <img
                                                    src={getAssetUrl(car.image_url)}
                                                    alt=""
                                                    style={{ width: '100px', height: '60px', objectFit: 'cover', border: '1px solid var(--border)' }}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542362567-b055002b97f4?auto=format&fit=crop&q=80&w=800';
                                                    }}
                                                />
                                                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{car.make} {car.model}</div>
                                            </td>
                                            <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.95rem', letterSpacing: '1px' }}>{car.vin || 'AH-PENDING'}</td>
                                            <td style={{ fontWeight: 700, color: 'var(--text)' }}>${car.price_usd?.toLocaleString()}</td>
                                            <td>
                                                <select
                                                    value={car.status}
                                                    onChange={(e) => handleUpdateStatus(car.id, e.target.value)}
                                                    style={{
                                                        padding: '0.4rem 1rem',
                                                        fontSize: '0.7rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                        border: '1px solid var(--border)',
                                                        fontWeight: 700,
                                                        outline: 'none'
                                                    }}
                                                >
                                                    <option value="available">In Stock</option>
                                                    <option value="transit">In Transit</option>
                                                    <option value="reserved">Hold / Reserved</option>
                                                    <option value="sold">De-listed / Sold</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '2rem' }}>
                                                    <Link to={`/cars/${car.id}`} style={{ color: '#ccc' }}><ExternalLink size={20} /></Link>
                                                    <button
                                                        onClick={() => handleDeleteCar(car.id)}
                                                        style={{ background: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="leads"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3rem' }}>Acquisition Inquiry Log ({data?.leads?.length || 0} Clients)</h3>
                        <div className="table-container" style={{ border: '1px solid var(--border)' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Private Client</th>
                                        <th>Secure Contact</th>
                                        <th>Target Asset</th>
                                        <th>Engagement Date</th>
                                        <th>Lead Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.leads?.map(lead => (
                                        <tr key={lead.id}>
                                            <td style={{ fontWeight: 600 }}>{lead.customer_name}</td>
                                            <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{lead.customer_phone}</td>
                                            <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{lead.car_model}</td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                {lead.created_at ? new Date(lead.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'LOG_READ_FAIL'}
                                            </td>
                                            <td>
                                                <span style={{
                                                    color: 'white',
                                                    background: 'var(--primary)',
                                                    padding: '0.3rem 0.8rem',
                                                    fontSize: '0.6rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '2px',
                                                    fontWeight: 800
                                                }}>
                                                    NEW_INQUIRY
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
