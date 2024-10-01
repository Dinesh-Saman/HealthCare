import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './customer_header.css';

function CusHeader() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const { email, exp} = decodedToken;

                console.log(email);
                console.log(exp);

                // Check if token is expired
                if (exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                } else {
                    setUsername('Dear User');
                    setEmail(email);
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login page after logging out
    };

    const handleProtectedNavigation = (path) => {
        if (username && email) {
            navigate(path);
        } else {
            // Store the intended path before navigating to login
            localStorage.setItem('redirectAfterLogin', path);
            navigate('/login');
        }
    };

    const handleLoginNavigation = () => {
        // Navigate directly to the intended page if the user is logged in
        if (username && email) {
            navigate('/make-appointment'); // Change this to any desired authenticated page
        } else {
            navigate('/login');
        }
    };

    return (
        <nav className="header-nav">
            <div className="header-container">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tenet_Health_logo.png" alt="Logo" className="header-logo" />

                <div className="header-links">
                    <a href="/">Home</a>
                    <span style={{color:'white', marginTop:'1px', fontSize:'17px', cursor:'pointer'}} onClick={() => handleProtectedNavigation('/make-appointment')}>Appointments</span>
                    <span style={{color:'white', marginTop:'1px', fontSize:'17px', cursor:'pointer'}}onClick={() => handleProtectedNavigation('/view-articles')}>Education Resources</span>
                    <a href="/view-services">Services</a>
                    <a href="/about-us">About Us</a>
                    <a href="/contact-us">Contact Us</a>
                </div>

                <div className="header-auth">
                    {username && email ? (
                        <>
                            <span className="header-username">Hello, {username}</span>
                            <span className="header-logout" onClick={handleLogout}>Logout</span>
                        </>
                    ) : (
                        <span onClick={handleLoginNavigation} className="header-login">Login</span>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default CusHeader;
