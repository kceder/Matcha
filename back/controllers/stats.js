import db from "../config/db";

const addView = async (request, response) => {
	const viewer = request.user.id;
	const target = request.body.target;



	response.send("OK");
};

module.exports = {
	addView,
}