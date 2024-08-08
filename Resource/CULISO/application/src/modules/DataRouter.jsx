import { Cookies } from "react-cookie";
import moment from 'moment';
// + "login"
//13.209.80.79
//
const host = "https://culiso.duckdns.org"; // 추후에 Let's Encrypt 와 같은 사이트에서 SSL 발급받아서 https로 접근해서 보안을 강화해야 함
const port = "443";
const url = host  + "/";
const cookies = new Cookies();

export function SignUpDataSend(data) {
  const sendData = {
    id: data.id,
    pw: data.pw,
    name: data.name,
    nickName: data.nickName,
    sex: data.sex,
    address: data.address,
    postNum: data.postNum,
    phoneNum: data.phoneNum,
  };

  fetch(url + "signUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  });
}
export async function LoginDataSend(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const id = formData.get("id");
  const pw = formData.get("pw");

  const data = { id, pw };
  fetch(url + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      if (response.success) {
        cookies.set("token", response.token);
        alert(response.message);
        window.location.href = "/afterMain";
      } else {
        alert(response.message);
      }
    })
    .catch(err => console.log(err));
}
export async function RequestUserData(path, data = null) {
  const token = cookies.get("token");

  if (!token) {
    console.log("토큰 없음");
    return;
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
  };
  try {
    const response = await fetch(url + path, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(),
    });

    const resData = await response.json();

    if (resData.success) {
      switch (path) {
        case "addrReq":
          return resData.address;
        case "sexReq":
          const imgName = resData.sex === 'M' ? "profile-man.png" : "profile-woman.png";
          console.log(imgName);
          return imgName;
        case "nameReq":
          return resData.name;
        default:
          return;
      }
    } else {
      console.log("데이터 받기 실패");
      return null;
    }
  } catch (error) {
    console.error("데이터 요청 중 오류 발생:", error);
    return null;
  }
}
export async function GetAddress() {
  return await RequestUserData("addrReq");
}
export async function GetSex() {
  return await RequestUserData("sexReq");
}
export async function GetName() {
  return await RequestUserData("nameReq");
}

export async function SaveProfileImgURL(url){
  fetch(url + "saveProfileImgUrl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(url),
  });
}

export async function PWCheck(event){
  event.preventDefault();
  const token = cookies.get("token");

  if (!token) {
    console.log("토큰 없음");
    return;
  }
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
  };

  const formData = new FormData(event.target);
  const pw = formData.get("pw");
  
  try {
    const response = await fetch(url + "updateProfile", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ pw }),
    });

    const data = await response.json();

    if (data.success) {
      return data.flag;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    return false;
  }
}
export async function GetUserData(event) {
  event.preventDefault();
  const token = cookies.get("token");

  if (!token) {
    console.log("토큰 없음");
    return false; // 토큰이 없을 때 false 반환
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
  };

  try {
    const response = await fetch(url + "getUserData", {
      method: "POST",
      headers: headers,
    });

    const data = await response.json();

    if (data.success) {
      const row = data.row;
      const createDate = moment(row.createDate).format('YYYY년 MM월 DD일');
      
      const formValues = {
        id: row.userID,
        pw: row.userPW,
        name: row.userName,
        nickName: row.userNickName,
        address: row.address,
        postNum: row.postNum,
        sex: row.sex,
        phoneNum: row.userPhoneNum,
        createDate: createDate
      }
      return formValues;
    } else {
      return false; // 성공하지 않은 경우 false 반환
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    return false; // 에러 발생 시 false 반환
  }
}
export async function ProfileUpdate(data) {
  const token = cookies.get("token");
  if (!token) {
    console.log("토큰 없음");
    return false; // 토큰이 없을 때 false 반환
  }
  const formValues = {
    id: data.id,
    pw: data.pw,
    name: data.name,
    nickName: data.nickName,
    address: data.address,
    postNum: data.postNum,
    sex: data.sex,
    phoneNum: data.phoneNum,
    createDate: data.createDate
  }
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
  };

  try {
    const response = await fetch(url + "updateProfileData", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(formValues),
    });
    const data = await response.json();

    if (data.success) {
      alert("회원정보를 수정하였습니다.");
      window.location.href = "/myPage";
    } 
    else {
      alert("회원정보 수정에 실패하였습니다.");
      window.location.href = "/myPage";
    }
  } 
  catch (error) {
    console.error("Error during fetch:", error);
    return false; // 에러 발생 시 false 반환
  }
}
export async function GetChatLog(){
  const token = cookies.get("token");
  if (!token) {
    console.log("토큰 없음");
    return false; // 토큰이 없을 때 false 반환
  }

  try {
    const response = await fetch(url + "getChatLog", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();

    if (data.success) {
      return data.log;
    } 
    else {
    }
  } 
  catch (error) {
    console.error("Error during fetch:", error);
    return false; // 에러 발생 시 false 반환
  }
}

export async function FindingDataSend(phoneNum) {

  const data = { phoneNum };

  try {
      const response = await fetch(url + "findingID", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Server response:', result);

      if (result.success) {
          return result.message;
      } else {
          throw new Error(result.message || "전화번호 인증에 실패했습니다.");
      }
  } catch (error) {
      console.error("Error:", error); // 오류 로그 출력
      return { success: false, message: error.message };
  }
}

export async function verifyPhoneNum(phoneNum, id) {
  const data = { phoneNum, id };
  try {
      const response = await fetch(url + "verifyPhoneNum", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('Server response:', result);
      return result;
  } catch (error) {
      console.error("Error:", error);
      return { success: false, message: "전화번호 인증에 실패했습니다." };
  }
}

export async function resetPassword(id, phoneNum, newPassword) {
  const data = { id, phoneNum, newPassword };
  try {
      const response = await fetch(url + "resetPassword", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('Server response:', result);
      return result;
  } catch (error) {
      console.error("Error:", error);
      return { success: false, message: "비밀번호 재설정에 실패했습니다." };
  }
}