import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import { DASHBOARD_PATH } from 'config';
import { GuardProps } from 'types';
import { useEffect } from 'react';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }: GuardProps) => {
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') || '';
    //useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn && !resetToken) {
            navigate(DASHBOARD_PATH, { replace: true });
        }
    }, [isLoggedIn, navigate]);

    return children;
};

export default GuestGuard;
