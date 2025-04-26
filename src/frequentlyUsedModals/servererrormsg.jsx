import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grow from '@mui/material/Grow';
import ErrorIcon from '@mui/icons-material/Error';

function Servererrormsg(props) {

    const { vertical, horizontal, transition } = {
        vertical: 'top',
        horizontal: 'center',
        transition: Grow
    };

    return (
        <Snackbar {...props} autoHideDuration={4000} anchorOrigin={{ vertical, horizontal }} TransitionComponent={transition}>
            <Alert
                onClose={props.onClose}
                severity="error"
                sx={{
                    width: '100%',
                    backgroundColor: '#f44336', // Red background for error
                    color: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                }}
                variant="filled"
                iconMapping={{
                    error: <ErrorIcon sx={{ marginRight: '8px' }} />,
                }}
            >
                <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{props.errorsubject}</p>
                    <p>{props.errormessage}</p>
                </div>
            </Alert>
        </Snackbar>
    );
}

export default Servererrormsg;
