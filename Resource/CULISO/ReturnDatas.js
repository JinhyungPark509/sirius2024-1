const database = require("./database.js");

async function ReqResData(id) {
  let query;
  let values;
  let result;

  query = `SELECT address FROM user WHERE userID = ?`;
  values = [id];

  try {
    result = await database.Query(query, values);

    console.log("반환된 주소: " + result[0].address);
    return result[0].address;
  } catch (error) {
    console.log("데이터 수색 중 오류: ", error.message);
  }
}

module.exports = {
  ReqResData: ReqResData,
};
