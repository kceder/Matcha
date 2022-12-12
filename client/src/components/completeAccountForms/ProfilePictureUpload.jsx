import React, { useState, useContext } from 'react'
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'
import { setProfilePicture } from '../../services/photos';
import { useNavigate } from 'react-router-dom';
import {validator} from '../../services/validator'
import { checkActiStat } from '../../services/users';
import { logOut } from '../../services/login';
import SocketContext from '../../contexts/socketContext';
import LoginContext from '../../contexts/loginContext';


const ImageCropDialog = ({setUrl, url}) => {
	const Navigate = useNavigate();
	const [zoom, setZoom] = useState(1);
	const [crop, setCrop] = useState({x:0, y:0});
	const aspectRatio = {value:4/4, text: "3/4"}
	const [croppedArePixels, setCroppedAreaPixels] = useState(null);
	const onCropChange = (crop) => {
		setCrop(crop);
	}


	const onZoomChange = (zoom) => {
		setZoom(zoom);
	}
	
	const onSubmit = async() => {
		const croppedImageUrl = await getCroppedImg(url, croppedArePixels);
	
		const size = croppedImageUrl.length;
		if (size * (3/4) > 52428800 / 5){
			alert('file too big')
		} else {
			const obj = { base64 : croppedImageUrl };
			setProfilePicture(obj).then(response => {
				if (response.data === 'file too big') {
					alert('file too big!');
				} else if (response.data === "good") {
					Navigate('../profile')
				}
			})
		
		}
	};

const onCropComplete = (croppedArea, croppedArePixels) => {
	setCroppedAreaPixels(croppedArePixels);
}

	return (
		<div>
			<div className="backdrop"></div>
			<div className='crop-container'>
				<Cropper image={url} zoom={zoom} crop={crop} aspect={aspectRatio.value}
				onCropChange={onCropChange}
				onCropComplete={onCropComplete}
				onZoomChange={onZoomChange} />
			</div>
				<div className='controls d-flex' style={{position:"absolute", width: '100%', bottom: '5%', left: '0', marginLeft : '20%'}}>
					<button style={{width: '60%'}} className="btn btn-light" onClick={onSubmit}>Save</button>
				</div>
				<div className='controls d-flex' style={{position:"absolute",  width: '100%', top: '5%', left: '0', marginLeft : '20%'}}>
					<button style={{width: '60%'}} className="btn btn-light" onClick={() => setUrl('')}>Cancel</button>
				</div>
		</div>
	)
}


const ProfilePictureUpload = () => {
	const navigate = useNavigate()
	const { socket } = useContext(SocketContext);
	const [login, setLogin] = useContext(LoginContext);
	const Navigate = useNavigate();
	validator().then((response) => {
		if (response.data === 'token invalid' || response.data === 'no token') {
			navigate('/')
		} else {
			checkActiStat().then((response) => {
				if (response.data.acti_stat === 3)
					navigate('/profile')
			})
		}
	})
	const [url, setUrl] = useState('');

	const handleFileChange = (event) => {
		if (event.target.files[0]) {
			if (event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/png" || event.target.files[0].type === "image/jpg") 
				setUrl(URL.createObjectURL(event.target.files[0]));
			else
				alert("file must be a picture")
			}
		}

	const handleLogout = (e) => {
		e.preventDefault()
		logOut().then(response => {
			setLogin(false);
			Navigate('/');
			socket.emit('login');
		})
	};

	return (
		<div>
			<div className='container'>
				<h3 style={{color : 'GrayText', marginTop : '2rem'}} className="text-center">Upload Profile Picture</h3>
				<input type="file" className="form-control mt-5" accept=".jpg, .jpeg, .png" id="customFile" onChange={(event)=>handleFileChange(event)}/>
				{url ? <> <ImageCropDialog setUrl={setUrl} url={url}/></> : null}
			</div>
		</div> 
	)
}


export default ProfilePictureUpload;