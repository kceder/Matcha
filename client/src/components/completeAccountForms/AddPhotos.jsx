import React, { useState, useRef} from 'react';
import {setUpPictures} from '../../services/register';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getUserPhotos } from '../../services/photos';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import { addPicture } from '../../services/photos';
// import ImageCropDialog from '../ImageCrop' 


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
	
	const onSubmit = async() => {
		const croppedImageUrl = await getCroppedImg(url, croppedArePixels);
	
		const size = croppedImageUrl.length;
		if (size * (3/4) > 52428800 / 5){
			alert('file too big')
		} else {
			const obj = { base64 : croppedImageUrl, old : picture };
			addPicture(obj).then(response => {
				// console.log(response.data)
				if (response.data === 'file too big') {
					alert('file too big!');
				} else if (response.data === "good") {
					Navigate('../profile')
				}
				setData("");
				setReloadGallery(reloadGallery + 1);
			})
		
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
				<div className='controls d-flex' style={{position:"absolute", bottom: '5%'}} >
						<button  style={{width: '300px'}} class="btn btn-dark" onClick={onSubmit}>Save</button>
				</div>
				</div>
			</div>)
}

const ImagePreview = ({picture, i, setReloadGallery, reloadGallery}) => {
	const ref = useRef();
	const [pic, setPic] = useState();
	const [data, setData] = useState('');


	useEffect(() => {
		window.scrollTo(0, 0)
	}, [data])
	
	const handleClick = () => {
		ref.current.click()
	}
	const handleChangePicture = (event)	=> {
		console.log(event.target.files[0])
		// check if file is a picture //
		if (event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/png" || event.target.files[0].type === "image/jpg") 
			setData(URL.createObjectURL(event.target.files[0]));
		else
			alert("file must be a picture")
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
							{data ? <ImageCropDialog i={i} url={data} setData={setData} setReloadGallery={setReloadGallery} reloadGallery={reloadGallery} picture={picture} /> : null}
					</button>
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
							{data ? <ImageCropDialog i={i} url={data} setData={setData} setReloadGallery={setReloadGallery} reloadGallery={reloadGallery} /> : null}
					</button>
					</Col>
				</>
			)
		}
}

const AddPhotos = () => {
	
	const [pictures, setPictures] = useState([])
	const Navigate = useNavigate();
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