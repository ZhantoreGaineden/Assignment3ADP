import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Database, Layout, Clock, Globe, Zap } from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="container" style={{ padding: '8rem 2rem' }}>
            <motion.section
                style={{ textAlign: 'center', marginBottom: '10rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h3 style={{ color: 'var(--primary)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>AutoHub Enterprise Edition</h3>
                <h1 style={{ fontSize: '4rem', fontWeight: 300, marginBottom: '2rem' }}>The <span style={{ fontStyle: 'italic' }}>Digital Dilemma</span> Solved.</h1>
                <p style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    Independent multi-brand dealerships in Kazakhstan face a critical choice: pay $5k+ for a custom build, or pay perpetual fees to a SaaS platform while sacrificing data privacy.
                    <br /><br />
                    <strong>AutoHub is the third way.</strong> A professional "boxed" solution that gives you complete control.
                </p>
            </motion.section>

            <section className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6rem', marginBottom: '10rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><Database size={32} /></div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 400 }}>Data Sovereignty</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                        You own the database. No third-party provider has access to your customer leads, inventory margins, or private dealership data.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><Clock size={32} /></div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 400 }}>Zero Retention Fees</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                        A standalone licensed product. No monthly subscriptions, no "per-listing" charges. Your digital infrastructure is an asset, not an expense.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><Shield size={32} /></div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 400 }}>Enterprise Security</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                        Standalone node deployment ensures your dealership's web portal is isolated and secure, running on your own preferred hardware.
                    </p>
                </motion.div>
            </section>

            <section className="about-grid-alt" style={{ background: '#fcfcfc', padding: '6rem', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '2rem' }}>Engineered for <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Growth</span></h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <Zap size={20} color="var(--primary)" />
                            <div>
                                <h4 style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>High Precision Imports</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Optimized workflows for tracking VINs and provenance from China, UAE, and Korea.</p>
                            </div>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <Globe size={20} color="var(--primary)" />
                            <div>
                                <h4 style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Localized Performance</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Hard-coded multi-currency engine for the Kazakhstan market (USD & KZT).</p>
                            </div>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem' }}>
                            <Layout size={20} color="var(--primary)" />
                            <div>
                                <h4 style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Excellence</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>A bespoke system control center for inventory management and client engagement.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100%', height: '100%', border: '1px solid var(--primary)', zIndex: 0 }}></div>
                    <img
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"
                        alt="Heritage"
                        style={{ width: '100%', position: 'relative', zIndex: 1, display: 'block' }}
                    />
                </div>
            </section>
        </div>
    );
};

export default About;
