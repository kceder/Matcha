import ProfileCard from "./ProfileCard";
import { useState } from "react";
import Form from 'react-bootstrap/Form';


const SortOptions = ({ setSorting}) => {
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

const UsersGallery = ({ users }) => {
	const [sorting, setSorting] = useState('distance')

	const sortedUsers = users.sort((a, b) => {
		if (sorting === "age") {
			return a.age - b.age;
		} else if (sorting === "distance") {
			return a.distance - b.distance;
		} else if (sorting === "score") {
			return b.score - a.score;
		} else if (sorting === "tags") {
			return b.commontags	- a.commontags;
		}
		return null;
	})

	const filteredUsers = sortedUsers.map(user => {
			return <ProfileCard commontags={user.commontags} distance={user.distance} target={user.id} key={user.id} />
		}) 

	
	return (

		<>
			<SortOptions setSorting={setSorting}/>
			{filteredUsers}
		</>
	)
}

export default UsersGallery;