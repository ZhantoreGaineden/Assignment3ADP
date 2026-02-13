import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    return (
        <div>
            <section className="hero">
                <div className="container hero-content">
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 style={{ color: 'var(--primary)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>AutoHub Enterprise Edition</h3>
                        <h1>Premium Multi-Brand <span>Portfolio</span></h1>
                        <p>
                            The gold standard for independent dealerships in Kazakhstan. Curating premium imports from China, Korea, and the UAE with complete transparency and localized excellence.
                        </p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <Link to="/about" className="btn-primary" style={{ display: 'inline-block' }}>
                                Import Logics
                            </Link>
                            <Link to="/contact" className="btn-secondary" style={{ display: 'inline-block' }}>
                                Establish Connection
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        className="hero-image"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <img
                            src="https://i.pinimg.com/736x/ce/db/f7/cedbf7732beaaaf35ee740cbf7f96138.jpg"
                            alt="Luxury Dealership"
                            style={{ width: '100%', height: '500px', objectFit: 'cover', borderLeft: '1px solid var(--border)' }}
                        />
                    </motion.div>
                </div>
            </section>

            <section style={{ background: '#f9f9f9', padding: '8rem 0', borderTop: '1px solid var(--border)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <img src="https://flagcdn.com/w40/cn.png" alt="China Flag" style={{ width: '28px', height: 'auto', borderRadius: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0 }}>The China Direct</h4>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                Access the newest EV and Luxury models directly from Shanghai and Shenzhen hubs. Fully localized for Kazakhstan.
                            </p>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <img src="https://flagcdn.com/w40/ae.png" alt="UAE Flag" style={{ width: '28px', height: 'auto', borderRadius: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0 }}>Gulf Excellence</h4>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                Desert-spec performance vehicles sourced from our partners in the UAE. Maximum reliability for our climate.
                            </p>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <img src="https://flagcdn.com/w40/kr.png" alt="South Korea Flag" style={{ width: '28px', height: 'auto', borderRadius: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0 }}>Seoul Precision</h4>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                Premium sedans and SUVs from Korea's domestic market. Unmatched interior quality and tech packages.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
