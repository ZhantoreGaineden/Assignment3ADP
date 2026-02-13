import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Computer } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';
import { ApiError } from '../types';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/login', { username, password });
            login(response.data.token);
            toast.success('Session Authenticated');
            navigate('/admin');
        } catch (error: unknown) {
            toast.error((error as ApiError).response?.data?.error || 'System Access Denied');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 90px)' }}>
            <Toaster position="top-right" />
            <motion.div
                style={{ width: '100%', maxWidth: '480px', padding: '5rem', border: '1px solid var(--secondary)', background: '#fff', boxShadow: '30px 30px 0px rgba(0,0,0,0.05)' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <ShieldCheck size={40} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.75rem', letterSpacing: '1px' }}>SYSTEM <span style={{ fontWeight: 700 }}>LOGIN</span></h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 700 }}>AutoHub Enterprise Layer</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>Operator Credential</label>
                        <input
                            type="text"
                            placeholder="Operator ID"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ borderRadius: 0, border: '1px solid #eee', padding: '1.25rem' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>Security Passkey</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ borderRadius: 0, border: '1px solid #eee', padding: '1.25rem' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '3rem', justifyContent: 'center', padding: '1.25rem', background: '#000', border: 'none' }} disabled={loading}>
                        {loading ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
                    </button>
                    <div style={{ marginTop: '4rem', padding: '1.5rem', border: '1px solid #f9f9f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Computer size={18} color="#ccc" />
                        <p style={{ fontSize: '0.65rem', color: '#bbb', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>
                            Standalone Node Access. Secure Local DB Connection.
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
