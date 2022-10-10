import React, { useState } from 'react'

const AddPhotos = () => {

	const [pic_1, setPic_1] = useState();
	const [pic_2, setPic_2] = useState();
	const [pic_3, setPic_3] = useState();
	const [pic_4, setPic_4] = useState();
	const [pic_5, setPic_5] = useState();
	const [url_1, setUrl_1] = useState();
	const [url_2, setUrl_2] = useState();
	const [url_3, setUrl_3] = useState();
	const [url_4, setUrl_4] = useState();
	const [url_5, setUrl_5] = useState();


	return (
		<>
			<h1>
				Add pictures to your profile
			</h1>
			<form className='d-flex flex-wrap'>
			<div>
				<input
					type="file"
					onChange={(event) => {
					console.log(event.target.files[0]);
					setUrl_1(URL.createObjectURL(event.target.files[0]));
					setPic_1(event.target.files[0]);
					}}
				/> <br></br>
				<img style={{width: "300px"}} src={url_1} ></img>
			</div>
			<div>
				<input
					type="file"
					onChange={(event) => {
					console.log(event.target.files[0]);
					setUrl_2(URL.createObjectURL(event.target.files[0]));
					setPic_2(event.target.files[0]);
					}}
				/> <br></br>
				<img style={{width: "300px"}} src={url_2} ></img>
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
				<img style={{width: "300px"}} src={url_3} ></img>
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
				<img style={{width: "300px"}} src={url_4} ></img>
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
				<img style={{width: "300px"}} src={url_5} ></img>
			</div>
			<input type="submit"></input>
			</form>
		</>
	)
}

export default AddPhotos;