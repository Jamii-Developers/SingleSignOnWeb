import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grow from '@mui/material/Grow';

function ServerSuccMsg( props ) {

    const { vertical, horizontal, transition } = ( { 
		vertical : 'top', 
		horizontal : 'center',
		transition : Grow  });

	return(
		<Snackbar { ...props } autoHideDuration={3000} anchorOrigin={ { vertical, horizontal } } TransitionComponent={transition} variant="filled" >
			<Alert onClose={props.onClose} severity="success" sx={ { width: '100%', height: '100%'  } }>
				<p><b>{props.ui_subject}</b></p>
				<p>{props.ui_message}</p>
			</Alert>
		</Snackbar>
	);
}

export default ServerSuccMsg;