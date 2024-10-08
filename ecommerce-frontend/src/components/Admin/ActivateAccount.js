import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { activateAccount } from '../../redux/Admin/actions/adminAction';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const ActivateAccount = () => {

    const [activationEmail, setActivationEmail] = useState("");

    const dispatch = useDispatch();
    const backend = useSelector((state) => state.authentication.backend);

    const activateAccountHandler = () => {
        dispatch(activateAccount(activationEmail));
    };

return (
    <div style={{ padding: '20px' }}>
        <h2>Activate Account</h2>
        <form className="p-fluid">
            <div className="p-field">
                <label htmlFor="email">Email</label>
                <InputText
                    id="email"
                    type="email"
                    value={activationEmail}
                    onChange={(e) => setActivationEmail(e.target.value)}
                    placeholder="Enter email for activation"
                />
            </div>
            <Button label="Activate Account" className="p-button-primary" onClick={() => activateAccountHandler()} />
        </form>
    </div>
)
}

export default ActivateAccount