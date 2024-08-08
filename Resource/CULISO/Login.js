const database = require('./database.js');

async function Login(id, pw){
    let query;
    let values;

    query = `SELECT COUNT(*) as count FROM user
                    WHERE userID = ? AND userPW = ?`;
    values = [id, pw];

    const result = await database.Query(query, values);
    const count = result[0].count;

    if (result instanceof Error) {
        return;
    }
    return count ? true:false;
}

module.exports = {
    Check: Login
};
