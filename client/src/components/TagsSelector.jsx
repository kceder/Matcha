import { useState } from "react";
import Badge from "react-bootstrap/esm/Badge";


const TagsSelector = ({ tags, setTags, interests, setInterests }) => {

	const [newTag, setNewTag] = useState('');
	const currentPage = window.location.pathname;
	function containsWhitespace(str) {
		return /\s|\t/.test(str);
	}

	const removeInterest = (event, tag) => {

		setInterests(interests.filter((interest) => interest !== tag));
	};

	const handleTextInput = (event) => {
		if (event.target.value === ' ') {
			return;
		} else {
			const last = event.target.value.charAt(event.target.value.length - 1);
			if (containsWhitespace(last) === false) {
				if (event.target.value.length > 30) {
					alert('Tag must be less than 30 characters');
				} else {
					setNewTag(event.target.value.replace(/(<([^>]+)>)/ig, ''));
				}
			} else {
				setInterests([...interests, newTag.replace(/(<([^>]+)>)/ig, '')]);
				setNewTag('');
			}
		}
		
	};

	const handleInterestsChange = (event) => {
		
		if (interests.includes(event)) {
			return null;
		} else {
			setInterests(interests.concat(event));
		}
	}
	const submitTag = (event, newTag) => {
		if (newTag === '') {
			return null;
		} else if (interests.includes(newTag)) {
			setNewTag('');
			return null;
		} else {
			setInterests([...interests, newTag]);
			setNewTag('');
		}
	}
	const options = tags.map((tag) => <option key={tag.id} value={tag.tag}>{tag.tag}</option>)
	const selectedTags = interests.map((tag, i) => {
		return (
			<Badge style={{cursor : 'pointer'}} onClick={(event) => removeInterest(event, tag)} key={i} value={tag} bg="dark" className="m-1">{tag}	
			</Badge>
		)
	})
	return (
		<div>
			<select id='tags' className="form-select" defaultValue={''} onChange={(e) => handleInterestsChange(e.target.value)} required>
				<option value="" disabled>-- select --</option>
				{options}
			</select>
			<div className='mt-1 mb-1'>
				<Badge bg="warning" >
					{currentPage === '/home' ? null : (<><input value={newTag} style={{ outline: 'none', border: 'none', borderRadius: '2px'}} type='text' onChange={(e) => handleTextInput(e)}></input><Badge className="m-1" bg="success" value={newTag} onClick={(event) => submitTag(event, newTag)}>+</Badge></>)}
				</Badge>{selectedTags}
			</div>
		</div>
	);
}

export default TagsSelector;