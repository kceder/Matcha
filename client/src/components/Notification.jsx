import { useEffect, useState } from "react"
import { getUserPhotos } from "../services/photos"

const Notification = ({props}) => {
	const [photo, setPhoto]	= useState('')
	const getDate = (date) => {
		const d = new Date(date)
		return d.toLocaleString()
	}
	const date = getDate(props.time)

	const handleNavigateToProfile = (event) => {
		window.location.href = `/user/${props.from}`
	}
	useEffect(() => {
		getUserPhotos({target: props.from}).then(response => {
			setPhoto(response.data.pic_1)
		})
	})

		return (
				<div className="notifications-box container">
					<div className="row">
						<div className="col-3">
							<img onClick={(e) => {handleNavigateToProfile(e)}} src={photo} key={props.id} alt="profile" className="img-thumbnail" />
						</div>
						<div className="col-9">
							<small>{props.content}</small><br></br>
							<small style={{fontSize: '0.5em' }}>{date}</small>
						</div>
					</div>
				</div>
		)
}

export default Notification