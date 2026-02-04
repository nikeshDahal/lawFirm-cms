import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGQL } from './hooks/useGQL';
import CustomLoader from 'components/loader';
import { FaqPath } from 'routes/PageManagementRoutes';

// ==============================|| FAQ MANAGEMENT REDIRECT ||============================== //

const FaqManagement = () => {
    const navigate = useNavigate();
    const { GET_FAQS_LIST } = useGQL();
    const { loading, data } = GET_FAQS_LIST();

    useEffect(() => {
        if (!loading && data?.findAllfaqs?.page?._id) {
            // Always redirect to edit mode since there's always one FAQ document
            navigate(`${FaqPath}/edit/${data.findAllfaqs.page._id}`, { replace: true });
        }
    }, [loading, data, navigate]);

    return <CustomLoader />;
};

export default FaqManagement;
