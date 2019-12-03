import React from 'react';
import UserProvider, { UserContext } from '../contexts/UserProvider';
import FormData from './FormData';

const FormFilled = () => (
    <UserProvider>
        <UserContext.Consumer>
            {(context) => <FormData context={context} />}
        </UserContext.Consumer>
    </UserProvider>
)


export default FormFilled;
