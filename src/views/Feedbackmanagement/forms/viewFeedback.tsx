import { useEffect, useRef, useState } from 'react';
import useSnackbar from 'hooks/common/useSnackbar';
import { useNavigate, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import 'react-color-palette/css';
import { DateTime } from 'luxon';
import { Grid, Typography, Box, Stack, Paper, Tooltip, Dialog, DialogContent } from '@mui/material';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import CustomLoader from 'components/loader';
import { useGQL } from '../hooks/useGQL';
import { FeedbackBaseResponse } from '../constants/types';
import { getInitials } from 'utils/extractChar';

const FeedbackView = () => {
    const breadcrumbLinks = [{ title: 'Feedback management', to: '/feedback/list' }, { title: 'View feedback' }];
    /** states handling */
    const { id } = useParams();

    /** graphql hooks */
    const { GET_FEEDBACK_GQL } = useGQL();
    const { error: categoryError, loading: feedbackLoading, data: feedbackData, refetch } = GET_FEEDBACK_GQL(id!);
    const [feedback, setFeedback] = useState<Partial<FeedbackBaseResponse>>();
    const [imageError, setImageError] = useState(false);

    const [openPreview, setOpenPreview] = useState(false);

    const handleOpen = () => setOpenPreview(true);
    const handleClose = () => setOpenPreview(false);

    useEffect(() => {
        if (feedbackData?.findByIdFeedback?.feedback) {
            setFeedback(feedbackData?.findByIdFeedback?.feedback || {});
        }
    }, [feedbackData]);

    return (
        <div style={{ position: 'relative' }}>
            {feedbackLoading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}
                >
                    <CustomLoader />
                </div>
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <Stack className="custom-breadcrumb">
                    <Breadcrumbs rightAlign={false} custom title={false} links={breadcrumbLinks} />
                </Stack>
                <MainCard title={<Typography variant="h2">Feedback Details</Typography>}>
                    {/* User Info Section */}
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 4, backgroundColor: '#fafafa' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 1,
                                        fontWeight: 'bold',
                                        fontSize: '1.25rem',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {getInitials(feedback?.user?.fullName, feedback?.user?.email)}
                                </Box>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h3">{feedback?.user?.fullName}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feedback?.user?.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Submitted: {DateTime.fromJSDate(new Date(feedback?.createdAt!)).toFormat('MMMM d, yyyy h:mm a')}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Message & Screenshot Section */}
                    <Grid container spacing={3}>
                        {/* Message */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Message
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, minHeight: 180, backgroundColor: '#fff' }}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                    {feedback?.message || 'No message provided'}
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Screenshot */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Screenshot
                            </Typography>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: 180,
                                    borderRadius: 2,
                                    backgroundColor: '#fff',
                                    cursor: feedback?.imageUrl && !imageError ? 'pointer' : 'default'
                                }}
                            >
                                {feedback?.imageUrl && !imageError ? (
                                    <Tooltip title="Click here to preview" arrow>
                                        <Box
                                            component="img"
                                            src={feedback.imageUrl}
                                            alt="Screenshot"
                                            onClick={handleOpen}
                                            onError={() => setImageError(true)} // If image is broken
                                            sx={{
                                                width: '100%',
                                                maxHeight: 280,
                                                objectFit: 'contain',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'scale(1.02)'
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No screenshot provided
                                    </Typography>
                                )}
                            </Paper>

                            {/* Dialog Preview */}
                            <Dialog open={openPreview} onClose={handleClose} maxWidth="md" fullWidth>
                                <DialogContent sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box
                                        component="img"
                                        src={feedback?.imageUrl!}
                                        alt="Screenshot Preview"
                                        sx={{
                                            width: '100%',
                                            maxHeight: '80vh',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </DialogContent>
                            </Dialog>
                        </Grid>
                    </Grid>
                </MainCard>
            </div>
        </div>
    );
};
export default FeedbackView;
