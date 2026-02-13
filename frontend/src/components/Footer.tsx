import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer style={{ backgroundColor: '#111', color: 'white', marginTop: '0', padding: '8rem 0 4rem', borderTop: '4px solid var(--primary)' }}>
            <div className="container footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '6rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'white', letterSpacing: '3px' }}>AUTOHUB <span style={{ color: 'var(--primary)' }}>ENTERPRISE EDITION</span></h2>
                    <p style={{ color: '#666', lineHeight: '2', fontSize: '0.85rem', maxWidth: '400px' }}>
                        The standalone, boxed software solution for multi-brand dealerships in Kazakhstan. Take control of your data, eliminate subscriptions, and scale your import business with professional-grade infrastructure.
                    </p>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', color: '#444', fontSize: '1.2rem' }}>
                        <i className="ri-shield-check-line"></i>
                        <i className="ri-database-2-line"></i>
                        <i className="ri-global-line"></i>
                    </div>
                </div>
                <div>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2.5rem', color: 'white' }}>Solution</h3>
                    <ul style={{ listStyle: 'none', padding: 0, color: '#666', lineHeight: '2.5', fontSize: '0.8rem' }}>
                        <li><Link to="/about">License Model</Link></li>
                        <li><Link to="/contact">Support Center</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2.5rem', color: 'white' }}>Enterprise</h3>
                    <ul style={{ listStyle: 'none', padding: 0, color: '#666', lineHeight: '2.5', fontSize: '0.8rem' }}>
                        <li><Link to="/register">Merchant Portal</Link></li>
                        <li><Link to="/about">API Documentation</Link></li>
                        <li><Link to="/contact">Compliance</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2.5rem', color: 'white' }}>License Support</h3>
                    <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.8rem', lineHeight: '1.8' }}>
                        Subscribe to technical updates and emergency patches.
                    </p>
                    <div style={{ display: 'flex', gap: '0' }}>
                        <input type="email" placeholder="System Administrator Email" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: 'white', padding: '0.75rem 0', borderRadius: 0, fontSize: '0.8rem', width: '100%' }} />
                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', borderBottom: '1px solid #333', padding: '0 1rem', cursor: 'pointer' }}>
                            <i className="ri-terminal-box-line"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="container" style={{ borderTop: '1px solid #222', marginTop: '8rem', paddingTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: '#444', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    © 2026 AutoHub Enterprise Edition. NO MONTHLY FEES. STANDALONE DEPLOYMENT.
                </p>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <span style={{ color: '#444', fontSize: '0.7rem' }}>KAZAKHSTAN REGIONAL BUILD v2.4.0</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
