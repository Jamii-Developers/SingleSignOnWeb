import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grow from '@mui/material/Grow';

function Servererrormsg(props ) {

	const { vertical, horizontal, transition } = ( { 
		vertical : 'top', 
		horizontal : 'center',
		transition : Grow  });

	return(
		<Snackbar { ...props } autoHideDuration={4000} anchorOrigin={ { vertical, horizontal } } TransitionComponent={transition} >
			<Alert onClose={props.onClose} severity="error" sx={ { width: '100%'  } } variant="filled">
				<p><b>{props.errorsubject}</b></p>
				<p>{props.errormessage}</p>
				<p>Error code : {props.errorcode}</p>
			</Alert>
		</Snackbar>
	);
}

export default Servererrormsg;