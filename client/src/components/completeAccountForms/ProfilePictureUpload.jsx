import React, { useState } from 'react'
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'
import { setProfilePicture } from '../../services/photos';
import { useNavigate } from 'react-router-dom';
import {validator} from '../../services/validator'


const ImageCropDialog = ({url}) => {
	const Navigate = useNavigate();
	const [zoom, setZoom] = useState(1);
	const [crop, setCrop] = useState({x:0, y:0});
	// const [aspectRatio, setAspectRatio] = useState({value:3/4, text: "3/4"});
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
			<div className='controls' style={{position:"fixed", bottom:"0px"}}>
				<div className='button-area'>
					<button onClick={onSubmit}>Save</button>
				</div>
			</div>
			</div>
		</div>
	)
}


const ProfilePictureUpload = () => {
	const navigate = useNavigate()
	validator().then((response) => {
		console.log((response.data))
		if (response.data === 'token invalid' || response.data === 'no token') {
			navigate('/')
		}
	})
	const [url, setUrl] = useState('');
	return (
		<div>
			<div>
				<form>
					<input
						type="file"
						onChange={(event) => {
						setUrl(URL.createObjectURL(event.target.files[0]));
						}}
					/>
				</form>
				{url ? <> <ImageCropDialog url={url}/></> : null}
			</div>
		</div> 
	)
	}


export default ProfilePictureUpload;