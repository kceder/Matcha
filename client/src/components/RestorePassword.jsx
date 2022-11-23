import { useState } from 'react';
import React from 'react';
import { sendRestore } from "../services/settings";

const RestorePassword = () => {
    const [email, setEmail] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('EMAIL:', email)
        sendRestore(email).then(response => {
            console.log(response);
        })
    }

    return (
        <>
        <h3 className='d-flex align-items-center justify-content-center text-center' style={{marginTop : '8rem'}}>Restore Password</h3>
        <form onSubmit={(e) => handleSubmit(e)} className='d-flex align-items-center justify-content-center text-center' style={{marginBottom: 'revert', marginTop: '2rem', padding: 25, borderStyle : 'solid',
													borderWidth : '0px', borderColor : 'lightgray', backgroundColor : 'white', borderRadius : 10}}>
            <input type="text" placeholder='Email Addres' value={email} onChange={e => setEmail(e.target.value)} style={{maxWidth: '90%'}} />
            <button className="btn btn-secondary" type="submit" style={{height: '2.2rem', marginLeft : '5px'}} >Send</button>
        </form>
        </>
    )
}

export default RestorePassword;