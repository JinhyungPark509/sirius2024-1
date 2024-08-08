const database = require('../database.js');

async function _Login(id, pw){
    let query;
    let values;

    if (id === "admin") {
        query = `SELECT COUNT(*) as count FROM admin
                    WHERE id = ? AND password = ?`;
        values = [id, pw];
    }
    else {
        query = `SELECT COUNT(*) as count FROM(
                    SELECT id
                    FROM user
                    WHERE id = ? AND password = ?
                    UNION
                    SELECT id
                    FROM expert
                    WHERE id = ? AND password = ?) as unionTable`;
        values = [id, pw, id, pw];
    }

    const result = await database.Query(query, values);
    const user_id = result[0].count;

    if (result instanceof Error) {
        return;
    }
    const type = await User_Type_Check(id);

    const arr = [user_id, type.userType, type.waitOk];
    console.log(arr);
    return arr;
}
async function User_Type_Check(id){
    let query;
    let values;

    if (id === "admin") {
        query = `SELECT userType, waitOk FROM admin
                    WHERE id = ?`;
        values = [id, id];
    } 
    else {
        query = `SELECT userType, waitOk FROM user
                    WHERE id = ?
                    UNION
                    SELECT userType, waitOk FROM expert
                    WHERE id = ?`;
        values = [id, id];
    }
    try{
        const result = await database.Query(query, values);
        
        return result[0];
    }
    catch(error){
        console.log(error);
    }
}
module.exports = {
    Login: _Login
};
