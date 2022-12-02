import ProfileCard from "./ProfileCard";
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import { Toast } from 'react-bootstrap';


const SortOptions = ({ setSorting }) => {
	const handleSort = (e) => {
		setSorting(e.target.value)
	}
	return (
		<div>
			<Form.Select className='mb-1' size='sm' onChange={handleSort} aria-label="Sort by">
				<option value={'distance'} onClick={(e) =>  handleSort(e)}>Sort by Distance</option>
				<option value={'age'} onClick={(e) =>  handleSort(e)}>Sort by Age</option>
				<option value={'tags'} onClick={(e) =>  handleSort(e)}>Sort by Tags</option>
				<option value={'score'} onClick={(e) =>  handleSort(e)}>Sort by Rating</option>
			</Form.Select>
		</div>
	)
}

const PopUp = ({show, setShow}) => {
	return (
		<Toast onClose={() => setShow(false)} show={show} delay={4000} autohide style={{ maxHeight: '100px', position: 'absolute', top: 0, right: 0, zIndex: 1000}}>
			<Toast.Header>
				<i className="fa-solid fa-heart-circle-check"></i>
				<strong className="me-auto">Match!</strong>
				<small>Just Now</small>
			</Toast.Header>
			<Toast.Body>{show.message}</Toast.Body>
		</Toast>
	)
}

const UsersGallery = ({ setUsers, users, displayUsers, setDisplayUsers,setSorting }) => {

	const [show, setShow] = useState({show: false, message: null});
	
	const filteredUsers = displayUsers.map(( user )=> {
		if (show.show === true) {
			return (
				<div key={user.id}>
					{show.show} <PopUp show={show} setShow={setShow}/>
					<ProfileCard show={show} setShow={setShow} setDisplayUsers={setDisplayUsers} displayUsers={displayUsers} setUsers={setUsers} users={users} commontags={user.commontags} distance={user.distance} target={user.id} />
				</div>
			)
		}
		else {
			return (
				<div key={user.id}>
					<ProfileCard show={show} setShow={setShow} setDisplayUsers={setDisplayUsers} displayUsers={displayUsers} setUsers={setUsers} users={users} commontags={user.commontags} distance={user.distance} target={user.id} />
				</div>
			)
		}
	}) 
	
	
	if (filteredUsers) {
		return (
			<>
				<SortOptions setSorting={setSorting}/>
				{filteredUsers}
			</>
		)

	}
}

export default UsersGallery;