const database = require("./database.js");

async function User_Insert(id, pw, name, nickName, sex, phoneNum, address, postNum) {
  let query;
  let values;
  let result;

  query = `INSERT INTO user(userID, userPW, userName, userNickName, sex, userPhoneNum, address, postNum, adminID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  values = [id, pw, name, nickName, sex, phoneNum, address, postNum, 'admin'];
  
  try{
    result = await database.Query(query, values);

    console.log("회원가입에 성공했습니다.");
  }
  catch(error){
    console.log("회원가입에 실패했습니다: ", error.message);
  }
}

module.exports = {
  Add_NewUser: User_Insert,
};
