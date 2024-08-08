const database = require('../database.js');

async function ID_Normalization_Check(value){
    
    // 반드시 영문으로 시작 숫자+언더바/하이픈 허용 4~20자리
    let id_normal = /^[A-Za-z]{1}[A-Za-z0-9_-]{3,29}$/;
    let bool;
    if(id_normal.test(value)){
        const query = `SELECT COUNT(*) as count FROM(
                        SELECT id
                        FROM user
                        WHERE id = ?
                        UNION
                        SELECT id
                        FROM expert
                        WHERE id = ?) as unionTable`;

        const values = [value, value];

        const result = await database.Query(query, values);
        if (result instanceof Error) {
            return;
        }
        bool = result[0].count === 0;
    };
    return bool;   
}
async function PW_Normalization_Check(pw){
    let pw_normal = /^.{4,50}$/;
    let bool = await pw_normal.test(pw);


    return bool;   
}
async function PW_Confirm_Check(pw, confirm_pw){
    let bool = await pw === confirm_pw;

    return bool;   
}
async function Nick_Name_Normalization_Check(value){
    let nick_name_normal = /^[A-Za-z0-9ㄱ-ㅎ가-힣]{1,19}$/;
    let bool;
    if(nick_name_normal.test(value)){
        const query = `SELECT COUNT(*) AS count FROM (
                        SELECT nick_name 
                        FROM user
                        WHERE nick_name = ?
                        UNION
                        SELECT name
                        FROM expert
                        WHERE name = ? ) as unionTable`;

        const values = [value, value];

        const result = await database.Query(query, values);
        
        if (result instanceof Error) {
            return;
        }
        bool = result[0].count === 0;
    };
    return bool;   
}
async function Phone_Num_Normalization_Check(value) {
    let bool;
    
    if (value) {
        const query = `SELECT COUNT(*) AS count FROM (
                        SELECT phone_num 
                        FROM user
                        WHERE phone_num = ?
                        UNION
                        SELECT phone_num
                        FROM expert
                        WHERE phone_num = ? ) as unionTable`;

        const values = [value, value];

        const result = await database.Query(query, values);

        if (result instanceof Error) {
            return;
        }
        bool = result[0].count === 0;

        if (value.startsWith("02")) {
            if (value.length == 12) {
                return bool;
            }
        }
        else {
            if (value.length == 13) {
                return bool;
            }
        }
    }
    
}
async function Email_Normalization_Check(value) {
    let email_normal = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z]){4,}@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z]){3,}\.[a-zA-Z]{2,3}$/i;
    let bool;
    
    if(email_normal.test(value)){
        const query = `SELECT COUNT(*) AS count FROM (
                        SELECT email 
                        FROM user
                        WHERE email = ?
                        UNION
                        SELECT email
                        FROM expert
                        WHERE email = ? ) as unionTable`;

        const values = [value, value];

        const result = await database.Query(query, values);
        
        if (result instanceof Error) {
            return;
        }
        bool = result[0].count === 0;
    };
    return bool;
}
async function Address_Normalization_Check(value) {
    return value;
}
async function FindId_Check(value) {
    let id_normal = /^[A-Za-z]{1}[A-Za-z0-9_-]{3,29}$/;
    let bool = await id_normal.test(value);

    return bool;
}
async function FindNickName_Check(value) {
    let nick_name_normal = /^[A-Za-z0-9ㄱ-ㅎ가-힣]{1,19}$/;
    let bool = await nick_name_normal.test(value);

    return bool;  
}
async function FindPhone_num_Check(value) {
    if (value) {
        if (value.startsWith("02")) {
            if (value.length == 12) {
                return true;
            }
        }
        else {
            if (value.length == 13) {
                return true;
            }
        }
    }
}
async function FindEmail_Check(value) {
    let email_normal = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z]){4,}@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z]){3,}\.[a-zA-Z]{2,3}$/i;
    let bool = await email_normal.test(value);

    return bool;
}


module.exports = {
    ID_Check: ID_Normalization_Check,
    PW_Check: PW_Normalization_Check,
    Confirm_Pw_Check: PW_Confirm_Check,
    Nick_Name_Check: Nick_Name_Normalization_Check,
    Phone_Num_Check: Phone_Num_Normalization_Check,
    Email_Check: Email_Normalization_Check,
    Address_Check: Address_Normalization_Check,
    FindId_Check: FindId_Check,
    FindNickName_Check: FindNickName_Check,
    FindPhone_num_Check: FindPhone_num_Check,
    FindEmail_Check: FindEmail_Check
};