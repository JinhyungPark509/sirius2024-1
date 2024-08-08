const database = require('../database.js');

async function User_Insert(id, pw, nick_name, phone_num, email, address, userType){
    let query;
    let values;
    let result;

    if (userType == 'user') {
        query = `INSERT INTO user(id, password, nick_name, phone_num, email, address, admin_id) VALUES (?, ?, ?, ?, ?, ?, 'admin')`;
        values = [id, pw, nick_name, phone_num, email, address];
        
        result = await database.Query(query, values);

        if (result instanceof Error) {
            return;
        }
    }
    else {
        query = `INSERT INTO expert(id, password, name, phone_num, email, waitOk, address, admin_id) VALUES (?, ?, ?, ?, ?, 0, ?, 'admin')`;
        values = [id, pw, nick_name, phone_num, email, address];

        result = await database.Query(query, values);

        if (result instanceof Error) {
            return;
        }

    }
}

module.exports = {
    Add_User: User_Insert
};