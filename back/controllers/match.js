const db = require('../config/db.js');

const likeDislike = (request, response) => {
    console.log(request.body);
    console.log(request.user);
    const sql = "INSERT INTO matches (user1, user2, like1, like2, match)"
    response.send('likeDislike');
}

module.exports = {
	likeDislike
}