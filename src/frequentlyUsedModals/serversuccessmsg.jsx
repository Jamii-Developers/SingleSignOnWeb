import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import success icon

function ServerSuccMsg(props) {
    const { vertical, horizontal } = {
        vertical: 'top',
        horizontal: 'center'
    };

    return (
        <Snackbar
            {...props}
            autoHideDuration={4000}
            anchorOrigin={{ vertical, horizontal }}
            sx={{
                '.MuiSnackbar-root': {
                    borderRadius: '12px', // Rounded corners for a smoother look
                    boxShadow: 6, // Enhanced shadow for better visibility
                    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Slightly transparent background for depth
                    padding: '8px', // Padding to avoid it feeling too tight
                }
            }}
        >
            <Alert
                onClose={props.onClose}
                severity="success"
                sx={{
                    width: '100%',
                    height: 'auto',
                    padding: '20px 24px', // More spacious padding for better balance
                    backgroundColor: '#388e3c', // Darker green for better contrast
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    borderRadius: '12px', // Consistent rounded corners
                    boxShadow: 3,
                    transition: 'all 0.3s ease', // Smooth transition for color changes or hover effects
                    '& .MuiAlert-message': {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '12px', // Increased gap for readability
                    }
                }}
                iconMapping={{
                    success: <CheckCircleIcon sx={{ fontSize: '1.75rem', marginRight: '12px', color: '#fff' }} />
                }}
            >
                <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: '1.5' }}>{props.ui_subject}</p>
                    <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>{props.ui_message}</p>
                </div>
            </Alert>
        </Snackbar>
    );
}

export default ServerSuccMsg;
