import React, { useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getUserPhotos } from '../../services/photos';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import { addPicture } from '../../services/photos';


import { Col, Container } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import placeholder from '../../images/Placeholder.png'

const ImageCropDialog = ({i, url, setData, picture, setReloadGallery, reloadGallery}) => {
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
	
	const onSubmit = async () => {
		let croppedImageUrl;
	
		try {
			croppedImageUrl = await getCroppedImg(url, croppedArePixels);
		} catch (e) {
		}
	
		if (croppedImageUrl !== undefined && croppedImageUrl !== null && croppedImageUrl !== "invalid") {
			const size = croppedImageUrl.length;
			if (size * (3/4) > 52428800 / 5){
				alert('file too big')
			} else {
				const obj = { base64 : croppedImageUrl, old : picture };
				addPicture(obj).then(response => {
					if (response.data === 'file too big') {
						alert('file too big!');
					} else if (response.data === "good") {
						Navigate('../profile')
					}
					setData("");
					setReloadGallery(reloadGallery + 1);
				})
			}
		} else {
			alert('image invalid')
			window.location.reload(false);
		}
	};

const onCropComplete = (croppedArea, croppedArePixels) => {
	setCroppedAreaPixels(croppedArePixels);
}

	return (<div>
				<div className="backdrop"></div>
				<div className='crop-container'>
					<Cropper image={url} zoom={zoom} crop={crop} aspect={aspectRatio.value}
					onCropChange={onCropChange}
					onCropComplete={onCropComplete}
					onZoomChange={onZoomChange} />
				
				</div>
				<div className='controls d-flex' style={{position:"absolute", bottom: '5%', width: '100%', left: '0', marginLeft : '20%'}}>
					<button style={{width: '60%'}} className="btn btn-light" onClick={onSubmit}>Save</button>
				</div>
			</div>)
}

const ImagePreview = ({picture, i, setReloadGallery, reloadGallery}) => {
	const ref = useRef();
	const [data, setData] = useState('');

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [data])
	
	const handleClick = () => {
		ref.current.click()
	}
	const handleChangePicture = (event)	=> {

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

						setData(URL.createObjectURL(event.target.files[0]));
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

	if ( picture !== "empty") {
		return (
			<>
				<Col>
					<button>
							<Image onClick={() => handleClick()} src={picture} width="300" thumbnail />
							<input hidden ref={ref} type="file" 
							accept=".jpg, .jpeg, .png"
							onChange={(event) => handleChangePicture(event)}></input>
					</button>
							{data ? <ImageCropDialog i={i} url={data} setData={setData} setReloadGallery={setReloadGallery} reloadGallery={reloadGallery} picture={picture} /> : null}
				</Col>
			</>
		)
	} else {
		return (
				<>
					<Col>
					<button>
							<Image onClick={() => handleClick()} src={placeholder} width="300" thumbnail />
							<input hidden ref={ref} type="file" accept=".jpg, .jpeg, .png" onChange={(event) => handleChangePicture(event)}></input>
					</button>
							{data ? <ImageCropDialog i={i} url={data} setData={setData} setReloadGallery={setReloadGallery} reloadGallery={reloadGallery} /> : null}
					</Col>
				</>
			)
		}
}

const AddPhotos = () => {
	
	const [pictures, setPictures] = useState([])
	const [reloadGallery, setReloadGallery] = useState(0);

	useEffect(() => {

		const obj = {"target" : "self"}
		getUserPhotos(obj).then(response => {
			let array = [];
			response.data.pic_1 ? array.push(response.data.pic_1) : array.push('empty');
			response.data.pic_2 ? array.push(response.data.pic_2) : array.push('empty');
			response.data.pic_3 ? array.push(response.data.pic_3) : array.push('empty');
			response.data.pic_4 ? array.push(response.data.pic_4) : array.push('empty');
			response.data.pic_5 ? array.push(response.data.pic_5) : array.push('empty');
			setPictures(array)
		})
	}, [reloadGallery]);

		return (
			<div>
				<Container className="d-flex flex-column align-items-center">
				{pictures.map((pic, i) => <ImagePreview key={i} i={i} picture={pic} setReloadGallery={setReloadGallery} reloadGallery={reloadGallery}/>)}
				</Container>
			</div>
		)
}

export default AddPhotos;