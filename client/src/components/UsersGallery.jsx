import ProfileCard from "./ProfileCard";
import Form from 'react-bootstrap/Form';
import { useEffect } from "react";
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
		<Toast onClose={() => setShow(false)} show={show} delay={3000} autohide style={{ width: '200px', position: 'absolute', top: 0, right: 0, zIndex: 1000}}>
			<Toast.Header>
				<strong className="mr-auto">{show.message}</strong>
			</Toast.Header>
			<Toast.Body>{show.message}</Toast.Body>
		</Toast>
	)
}

const UsersGallery = ({ setUsers, users, displayUsers, setDisplayUsers,setSorting }) => {

	const [show, setShow] = useState({show: false, message: null});

	console.log(displayUsers)
	
	
	const filteredUsers = displayUsers.map(user => {
		return (
			<>
				{show.show} : <PopUp show={show} setShow={setShow}/>
				<ProfileCard show={show} setShow={setShow} setDisplayUsers={setDisplayUsers} displayUsers={displayUsers} setUsers={setUsers} users={users} commontags={user.commontags} distance={user.distance} target={user.id} key={user.id} />
			</>
		)
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