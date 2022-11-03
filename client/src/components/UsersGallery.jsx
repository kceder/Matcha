import ProfileCard from "./ProfileCard";
import { useState } from "react";
import Form from 'react-bootstrap/Form';
import { useEffect } from "react";


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

const UsersGallery = ({ users, displayUsers, setSorting }) => {

	console.log('dislay users', displayUsers.length)

	const filteredUsers = displayUsers.map(user => {
		return <ProfileCard users={users} commontags={user.commontags} distance={user.distance} target={user.id} key={user.id} />
	}) 

	

	
	return (

		<>
			<SortOptions setSorting={setSorting}/>
			{filteredUsers}
		</>
	)
}

export default UsersGallery;