import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ borderBottom: '1px solid var(--border)' }}>
            <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginRight: '6rem' }}>
                <span style={{ background: 'var(--secondary)', color: 'white', padding: '0.2rem 0.6rem', fontSize: '0.9rem', fontWeight: 800 }}>AH</span>
                AUTOHUB <span style={{ color: 'var(--primary)', fontStyle: 'italic', opacity: 0.8 }}>ENTERPRISE</span>
            </Link>

            <div className="nav-links">
                <Link to="/about" className="nav-link">Digital License</Link>
                <Link to="/contact" className="nav-link">Establish Connection</Link>
            </div>

            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                {isAuthenticated ? (
                    <>
                        <Link to="/admin" className="nav-link" style={{ fontWeight: 600, color: 'var(--primary)' }}>
                            System OS
                        </Link>
                        <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem', background: 'var(--primary)', borderColor: 'var(--primary)' }}>
                            Terminate session
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">
                            System Access
                        </Link>
                        <Link to="/register" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>
                            Get License
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
