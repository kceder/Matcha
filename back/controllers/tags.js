const db = require('../config/db.js');

const getTags = (request, response) => {
    const sql = 'SELECT * FROM tags';
    db.query(sql, function (error, result) {
        if (error) throw error;
        else {
            response.send(result);
        }
    })
}

module.exports = {
    getTags
}