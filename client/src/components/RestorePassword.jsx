import { useState } from 'react';
import React from 'react';
import { sendRestore } from "../services/settings";
// import { sendRecoveryMail } from '../back/utils/sendEmail';

const RestorePassword = () => {
    const [email, setEmail] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [showError, setShowError] = useState(false);
    
    const handleSubmit = (e) => {
        setShowMessage(false);
        setShowError(false);
        e.preventDefault();
        console.log('EMAIL:', email)
        sendRestore({'email' : email}).then(response => {
            console.log(response);
            if (response.data === 'ok') {
                    setShowMessage(true)
                    // sendRecoveryMail();
            }
            else if (response.data === 'no') {

                    setShowError(true)
            }
        })
    }

    return (
        <>
        <h3 className='d-flex align-items-center justify-content-center text-center' style={{marginTop : '8rem'}}>Oh no, not again !</h3>
        <div className='d-flex align-items-center justify-content-center text-center'style={{fontSize: '1rem', color: 'gray'}}>I can send you a link to restrore you password</div>
        <form onSubmit={(e) => handleSubmit(e)} className='d-flex align-items-center justify-content-center text-center' style={{marginBottom: 'revert', marginTop: '2rem', padding: 25, borderStyle : 'solid',
													borderWidth : '0px', borderColor : 'lightgray', backgroundColor : 'white', borderRadius : 10}}>
            <input type="text" placeholder='Email Addres' value={email} onChange={e => setEmail(e.target.value)} style={{maxWidth: '90%'}} />
            <br />
            <button className="btn btn-secondary" type="submit" style={{height: '2.2rem', marginLeft : '5px'}} >Send</button>
        </form>
        {showMessage && <div className="error"><div className='d-flex align-items-center justify-content-center text-center' style={{marginTop : '1rem'}}>Your reset password email is heading your way!</div></div>}
        {showError && <div className="error"><div className='d-flex align-items-center justify-content-center text-center' style={{marginTop : '1rem'}}>Are you fucking kidding me?</div></div>}
        </>
    )
}

export default RestorePassword;