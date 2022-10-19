import React, { useState } from 'react'
import {setUpPictures} from '../../services/register'
import { useNavigate } from 'react-router-dom'


const Preview = ({url}) => {

	if (url)
		return <img style={{width: "300px"}} src={url} alt="preview"></img>
	else
		return null;
}

const AddPhotos = () => {

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
	const Navigate = useNavigate();

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

		setUpPictures(pictures).then(response => {
			if (response.data === 'good') {
				Navigate('/profile')
			}
		});
	}
	return (
		<>
			<h1>
				Add pictures to your profile
			</h1>
			<form id="form" className='d-flex flex-wrap' encType="multipart/form-data"  onSubmit={event => handleSubmit(event)}>
			<div>
				<label forhtml="files" className="btn btn-light" onClick={() => document.getElementById('files').click()}>Select a profile image</label>
				<input
					id="files"
					type="file"
					style={{"visibility":"hidden"}}
					onChange={(event) => {
					setUrl_1(URL.createObjectURL(event.target.files[0]));
					setPic_1(event.target.files[0]);
					}}
				/>
				 <br></br>
				<Preview url={url_1} />
			</div>
			{/* <div>
				<input
					type="file"
					onChange={(event) => {
					console.log(event.target.files[0]);
					setUrl_2(URL.createObjectURL(event.target.files[0]));
					setPic_2(event.target.files[0]);
					}}
				/> <br></br>
				<Preview url={url_2} />
			</div> */}
			{/* <div>
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
					setUrl_4(URL.createObjectURL(event.target.files[0]));
					setPic_4(event.target.files[0]);
					}}
				/> <br></br>
				<Preview url={url_4} />
			</div>
			<div>
				<input
					type="file"
					onChange={(event) => {
					console.log(event.target.files[0]);
					setUrl_5(URL.createObjectURL(event.target.files[0]));
					setPic_5(event.target.files[0]);
					}}
				/> <br></br>
				<Preview url={url_5} />
			</div> */}
			<button type="submit"> Upload </button>
			</form>
		</>
	)
}

export default AddPhotos;