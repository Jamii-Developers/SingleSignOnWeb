import React from 'react';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';

const FieldValidationError = ({ show, message }) => (
    <Collapse in={show}>
        <Alert variant="filled" severity="warning" className="mb-3">
            {message}
        </Alert>
    </Collapse>
);

export default FieldValidationError;
