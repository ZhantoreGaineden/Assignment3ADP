import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldPlus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/client';
import { ApiError } from '../types';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/register', { username, password });
            toast.success('License Identity Registered');
            navigate('/login');
        } catch (error: unknown) {
            toast.error((error as ApiError).response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 90px)' }}>
            <Toaster position="top-right" />
            <motion.div
                style={{ width: '100%', maxWidth: '480px', padding: '5rem', border: '1px solid var(--border)', background: '#fff', boxShadow: '30px 30px 0px rgba(197, 160, 89, 0.1)' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <ShieldPlus size={40} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.75rem', letterSpacing: '1px' }}>LICENSE <span style={{ fontWeight: 700 }}>SETUP</span></h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 700 }}>Initialize Local Admin Node</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>Define Operator ID</label>
                        <input
                            type="text"
                            placeholder="Unique Username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ borderRadius: 0, border: '1px solid #eee', padding: '1.25rem' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>System Passkey</label>
                        <input
                            type="password"
                            placeholder="Security Key"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ borderRadius: 0, border: '1px solid #eee', padding: '1.25rem' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '3rem', justifyContent: 'center', padding: '1.25rem' }} disabled={loading}>
                        {loading ? 'INITIALIZING...' : 'ACTIVATE LOCAL LICENSE'}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.75rem', letterSpacing: '1px' }}>
                        ALREADY HAVE A LICENSE? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>ACCESS SYSTEM</Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
