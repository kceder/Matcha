import { useState } from 'react';
import React from 'react';
import { sendRestore } from "../services/settings";
import { useParams } from 'react-router-dom';
import { passwordRestore } from '../services/settings';
import { useNavigate } from 'react-router-dom';

const RestoreForm = ({token}) => {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== password2) {
            setError('Passwords do not match!');
            return;
        }
        const regex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,13}$')
		if(regex.test(password) === false) {
			setError('Password should have 8 - 13 characters including lower and upper case letters and a number!')
            return;
        }
        setLoading(true);
        passwordRestore({password, token}).then(response => {
            if (response.data === 'ok') {
                setSuccess('Password changed successfully !');
                setLoading(false);
                setError('');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
            else {
                setError('Something went wrong !');
                setLoading(false);
            }
        })
    }

    return (
        <div style={{marginTop : '8rem'}} className="container">
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <div className="card" style={{borderWidth : '0px'}}>
                    <div className="card-body">
                    <h3 className="card-title">Restore Password</h3>
                        <div className='d-flex align-items-center 'style={{fontSize: '1rem', color: 'gray'}}>You can now choose a new password</div>
                        <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password2">Confirm password</label>
                                    <input type="password" className="form-control" id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                                </div>
                                <button className="btn btn-secondary" type="submit" style={{height: '2.2rem', marginTop : '1rem'}} >Restore</button>
                        </form>
                        {error && <div className="alert alert-secondary mt-3">{error}</div>}
                        {success && <div className="alert alert-secondary mt-3">{success}</div>}
                        {loading && <div className="alert alert-secondary mt-3">Loading...</div>}
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}


const RestorePassword = () => {
    const [email, setEmail] = useState('');
    const [showMessage, setShowMessage] = useState('');
    const [showError, setShowError] = useState('');
    const { token } = useParams();
    let parsedToken = 'undefined';

    const handleSubmit = (e) => {
        setShowMessage('');
        setShowError('');
        e.preventDefault();
        sendRestore({'email' : email}).then(response => {
            if (response.data === 'ok') {
                    setShowMessage('Your reset password email is heading your way!')
            }
            else if (response.data === 'no') {

                    setShowError('Email not found !')
            }
        })
    }

    if (token === undefined) {

    return (
        <>
        <div style={{marginTop : '8rem'}} className="container">
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <div className="card" style={{borderWidth : '0px'}}>
                    <div className="card-body">
                    <h3 className="card-title">Oh no, not again !</h3>
                        <div className='d-flex align-items-center 'style={{fontSize: '1rem', color: 'gray'}}>I can send you a link to restrore your password</div>
                        <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
                            <div className="form-group">
                                <input type="email" placeholder='Email Addres' className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <button className="btn btn-secondary" type="submit" style={{height: '2.2rem', marginTop : '1rem'}} >Restore</button>
                        </form>
                        {showError && <div className="alert alert-secondary mt-3">{showError}</div>}
                        {showMessage && <div className="alert alert-secondary mt-3">{showMessage}</div>}
                    </div>
                </div>
            </div>
        </div>
        </div>
        </>
    )
    }
    else {
        if (token !== undefined) {
            parsedToken = token.split('=')[1];
        }
        return (
            <>
                <RestoreForm token={parsedToken} />
            </>
        )
    }
}

export default RestorePassword;