import { useNavigate } from 'react-router-dom';

// project imports
import { GuardProps } from 'types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }: GuardProps) => {
    const navigate = useNavigate();
    const isValidToken: string = localStorage.getItem('refreshToken') || '';
    const isLoggedIn: string = localStorage.getItem('isLoggedIn') || '';
    // const isBrowserVerified = useSelector((state: any) => state.auth.isBrowserVerified);
    const isBrowserVerified = true;
    const userDetails = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        if (!isLoggedIn && !isValidToken) {
            navigate('/login', { replace: true });
        }
        if (!isBrowserVerified && isLoggedIn) {
            navigate('/code-verification', { replace: true });
        }
    }, [isLoggedIn, isValidToken, isBrowserVerified, navigate]);

    console.log('children', children);

    return children;
};

export default AuthGuard;
