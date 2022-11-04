import ProfileCard from "./ProfileCard";
import Form from 'react-bootstrap/Form';
import { useEffect } from "react";
import { useState } from "react";


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

const UsersGallery = ({ setUsers, users, displayUsers, setDisplayUsers,setSorting }) => {


	console.log(displayUsers)

	const filteredUsers = displayUsers.map(user => {
		return <ProfileCard setDisplayUsers={setDisplayUsers} displayUsers={displayUsers} setUsers={setUsers} users={users} commontags={user.commontags} distance={user.distance} target={user.id} key={user.id} />
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