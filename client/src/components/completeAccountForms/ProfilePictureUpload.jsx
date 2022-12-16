import React, { useState } from 'react'
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'
import { setProfilePicture } from '../../services/photos';
import { useNavigate } from 'react-router-dom';
import {validator} from '../../services/validator'
import { checkActiStat } from '../../services/users';

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
		let croppedImageUrl;
		try {
			croppedImageUrl = await getCroppedImg(url, croppedArePixels);
		} catch (e) {
			alert('image invalid')
		}

		if (croppedImageUrl === undefined || croppedImageUrl === null || croppedImageUrl === "invalid") {
			alert('image invalid')
			window.location.reload(false);
		} else {
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

		let allowed_file_types = {
			"iVBORw0KGgo": "image/png",
			"/9j/": "image/jpg",
		  };

		const getBase64 = (file) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = error => reject(error);
			});
		}
		getBase64(event.target.files[0]).then(base64 => {
			let valid = false;
			base64 = base64.split(',')[1];
			for (let i in allowed_file_types) {
				if (base64.indexOf(i) === 0) {
					if (event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/png" || event.target.files[0].type === "image/jpg") {

						setUrl(URL.createObjectURL(event.target.files[0]));
						valid = true;
					}
				}
			}
			if (valid === false) {
				alert('File not allowed. Only png, jpg and jpeg are allowed')
			}


		}).catch(err => {
			alert('Spend more time with the family')
		});
	}

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