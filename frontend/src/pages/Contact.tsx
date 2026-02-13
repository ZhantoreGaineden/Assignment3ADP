import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Contact: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('sent');
            toast.success('Message synchronized with local node.');
        }, 1500);
    };

    return (
        <div className="container" style={{ padding: '8rem 2rem' }}>
            <Toaster position="top-right" />
            <motion.div
                style={{ textAlign: 'center', marginBottom: '6rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 style={{ color: 'var(--primary)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>Establish Connection</h3>
                <h1 style={{ fontSize: '3rem', fontWeight: 300 }}>Merchant Support <span style={{ fontStyle: 'italic' }}>& Licensing</span></h1>
            </motion.div>

            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8rem', alignItems: 'start' }}>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div style={{ marginBottom: '4rem' }}>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '1.5rem' }}>Direct Reach</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: '#f9f9f9', padding: '1rem', border: '1px solid var(--border)' }}><Phone size={20} /></div>
                            <div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Hotline</p>
                                <p style={{ fontWeight: 600 }}>+7 (701) 000 00 00</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ background: '#f9f9f9', padding: '1rem', border: '1px solid var(--border)' }}><Mail size={20} /></div>
                            <div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Secure Email</p>
                                <p style={{ fontWeight: 600 }}>enterprise@autohub.kz</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '1.5rem' }}>Local Node HQ</h4>
                        <div style={{ display: 'flex', alignItems: 'start', gap: '1.5rem' }}>
                            <div style={{ background: '#f9f9f9', padding: '1rem', border: '1px solid var(--border)' }}><MapPin size={20} /></div>
                            <div>
                                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Astana IT University</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    Expo Center, Mangilik El 55/11<br />
                                    Astana, Kazakhstan
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    style={{ background: '#fff', border: '1px solid var(--secondary)', padding: '4rem', boxShadow: '20px 20px 0px rgba(197, 160, 89, 0.05)' }}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {status === 'sent' ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '1rem' }}>Message Transmitted</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>Our technician will establish a secure connection with you within one business hour.</p>
                            <button onClick={() => setStatus('idle')} style={{ background: 'none', borderBottom: '1px solid currentColor', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginTop: '2.5rem', color: 'var(--primary)', fontWeight: 700 }}>Send New Packet</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <h3 style={{ marginBottom: '2.5rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>Encrypted Inquiry</h3>
                            <div className="form-group">
                                <label>Operator Identity</label>
                                <input type="text" placeholder="Full Name" required />
                            </div>
                            <div className="form-group">
                                <label>Return Vector (Email)</label>
                                <input type="email" placeholder="official@company.kz" required />
                            </div>
                            <div className="form-group">
                                <label>Data Packet / Message</label>
                                <textarea placeholder="How can we assist with your standalone deployment?" required style={{ width: '100%', minHeight: '150px', padding: '1rem', border: '1px solid #eee', marginTop: '0.5rem', fontFamily: 'inherit' }}></textarea>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }} disabled={status === 'sending'}>
                                {status === 'sending' ? 'TRANSMITTING...' : 'INITIATE CONTACT'} <Send size={16} />
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
