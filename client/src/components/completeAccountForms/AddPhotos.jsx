import React, { useState } from 'react'
import {setUpPictures} from '../../services/register'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getUserPhotos } from '../../services/photos'
// import Row from 'react-bootstrap/Row';
import { Row, Col, Container } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import placeholder from '../../images/Placeholder.png'
// import Cropper from 'react-easy-crop'

const ImagePreview = ({picture}) => {
	console.log(picture)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	if ( picture !== "empty") {
		return (
			<>
			<Col xs={6} md={3}>
				<Image src={picture} width="150" thumbnail />
			</Col>
			</>
		)
	}
	else {
		return (
				<>
				<Col xs={6} md={3}>
					<Image src={placeholder} width="150" thumbnail />
				</Col>
				</>
			)
		}
}

const AddPhotos = ({target}) => {
	console.log('15', target)
	const [pic_1, setPic_1] = useState();
	const [pic_2, setPic_2] = useState();
	const [pic_3, setPic_3] = useState();
	const [pic_4, setPic_4] = useState();
	const [pic_5, setPic_5] = useState();
	const [url_1, setUrl_1] = useState("");
	const [url_2, setUrl_2] = useState("");
	const [url_3, setUrl_3] = useState("");
	const [url_4, setUrl_4] = useState("");
	const [url_5, setUrl_5] = useState("");
	const [pictures, setPictures] = useState([])
	const Navigate = useNavigate();

	useEffect(() => {
		const obj = {"target" : "self"}
		getUserPhotos(obj).then(response => {
			let array = [...pictures];
			response.data.pic_1 ? array.push(response.data.pic_1) : array.push('empty');
			response.data.pic_2 ? array.push(response.data.pic_2) : array.push('empty');
			response.data.pic_3 ? array.push(response.data.pic_3) : array.push('empty');
			response.data.pic_4 ? array.push(response.data.pic_4) : array.push('empty');
			response.data.pic_5 ? array.push(response.data.pic_5) : array.push('empty');
			setPictures(array)
		})
	}, []);

	const handleSubmit = (event) => {
		
		event.preventDefault();

		let pictures = new FormData();

		if (url_1 !== "")
			pictures.append('images', pic_1);
		if (url_2 !== "")
			pictures.append('images', pic_2);
		if (url_3 !== "")
			pictures.append('images', pic_3);
		if (url_4 !== "")
			pictures.append('images', pic_4);
		if (url_5 !== "")
			pictures.append('images', pic_5);
	}
	if (target === 3) {
		return (
			<></>
		)
	} else if (target === 9) {
		return (
			<div>
				<Container className="d-flex flex-column align-items-center">
				{pictures.map((pic, value) => <ImagePreview key = {value} picture={pic}/>)}
				</Container>
				<div>
					<input
						type="file"
						onChange={(event) => {
						console.log(event.target.files[0]);
						setUrl_2(URL.createObjectURL(event.target.files[0]));
						setPic_2(event.target.files[0]);
						}}
					/> <br></br>
					{/* <ImagePreview url={url_2} /> */}
				</div>
				{/*}	<div>
						<input
							type="file"
							onChange={(event) => {
							console.log(event.target.files[0]);
							setUrl_3(URL.createObjectURL(event.target.files[0]));
							setPic_3(event.target.files[0]);
							}}
						/> <br></br>
						<Preview url={url_3} />
					</div>
				<div>
				<input
					type="file"
					onChange={(event) => {
					console.log(event.target.files[0]);
					setUrl_3(URL.createObjectURL(event.target.files[0]));
					setPic_3(event.target.files[0]);
					}}
				/> <br></br>
				<Preview url={url_3} />
				</div>
				<div>
				<input
					type="file"
					onChange={(event) => {
					console.log(event.target.files[0]);
					setUrl_3(URL.createObjectURL(event.target.files[0]));
					setPic_3(event.target.files[0]);
					}}
				/> <br></br>
				<Preview url={url_3} />
				</div>*/}
			</div> 
		)
	}
}

export default AddPhotos;