import React, { useState, useRef, useCallback, useEffect } from "react";
import GetIcon from "./modules/GetIcon";
import { TimerNavigate } from "./modules/Navigate";
import { SignUpDataSend } from "./modules/DataRouter";
import DaumPostcode from "react-daum-postcode";
import "./style.css";
import styled from 'styled-components';

// css
const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;


const culiMsg = {
  0: "지금부터 회원가입을\n도와드릴게요!",
  1: "먼저 아이디와 비밀번호를\n입력해 주세요!",
  2: "이번에는 이름과 별명,\n그리고 성별을 선택해 주세요!",
  3: "마지막으로 주소와 전화번호를\n입력하고 인증을 받아주세요!",
  4: "회원가입이 완료되었습니다!\n다시 한 번 환영합니다!",
  5: "로그인 화면으로 안내해 드릴게요!\n잠시만 기다려주세요",
};

// 회원가입
export const SignUp = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [openPostcode, setOpenPostcode] = useState(false);
  const [msg, setMsg] = useState("안녕하세요!\n저는 당신을 도와드릴 큐리에요");
  const [currentMsgIdx, setcurrentMsgIdx] = useState(0);
  const [isForm, setIsForm] = useState(false);
  const [isInputCheck, setIsInputCheck] = useState(false);
  const btn = useRef();
  const [pageIdx, setPageIdx] = useState(0);
  const [pBtnColor, setPBtnColor] = useState();
  const [pBtnMsg, setPBtnMsg] = useState("전화번호 인증");
  const formValues = useRef({
    id: null,
    pw: null,
    name: null,
    nickName: null,
    address: null,
    postNum: null,
    sex: null,
    phoneNum: null,
  });
  const [addExplanArr, setAddExplanArr] = useState({
    id: {
      msg: "6-15자 이내, 영문/숫자 사용 가능",
      color: "#a5a5a5",
      flag: false,
    },
    pw: {
      msg: "8-30자 이내, 영문/숫자/기호 사용 가능",
      color: "#a5a5a5",
      flag: false,
    },
    cpw: {
      msg: "8-30자 이내, 영문/숫자/기호 사용 가능",
      color: "#a5a5a5",
      flag: false,
    },
    name: {
      msg: "1-20자 이내, 영문/한글 사용 가능",
      color: "#a5a5a5",
      flag: false,
    },
    nickName: {
      msg: "1-30자 이내, 영문/한글/숫자 사용 가능",
      color: "#a5a5a5",
      flag: false,
    },
    sex: {
      msg: "",
      color: "#a5a5a5",
      flag: false,
    },
    address: {
      msg: "30자 이내, 영문/한글/숫자 사용 가능",
      color: "#a5a5a5",
      flag: false,
    },
    postNum: {
      msg: "5자, 숫자만 사용 가능",
      color: "#a5a5a5",
      flag: false,
    },
    phoneNum: { msg: "", color: "#a5a5a5", flag: false },
  });
  const inputBGData = [
    {
      iconSrc: GetIcon("profile-gray.png"),
      placeholder: "아이디",
      name: "id",
      maxLength: 15,
    },
    {
      iconSrc: GetIcon("padlock-web-gray.png"),
      placeholder: "비밀번호",
      name: "pw",
      maxLength: 30,
    },
    {
      iconSrc: GetIcon("padlock-web-gray.png"),
      placeholder: "비밀번호 확인",
      name: "cpw",
      maxLength: 30,
    },
    {
      iconSrc: GetIcon("N-gray.png"),
      placeholder: "이름",
      name: "name",
      maxLength: 20,
    },
    {
      iconSrc: GetIcon("N-gray.png"),
      placeholder: "별명",
      name: "nickName",
      maxLength: 30,
    },
    {
      iconSrc: GetIcon("man.png"),
      placeholder: "남자",
      name: "sex",
      id: "man",
    },
    {
      iconSrc: GetIcon("location-gray.png"),
      placeholder: "주소",
      id: "iAddress",
      name: "address",
      maxLength: 30,
    },
    {
      iconSrc: GetIcon("location-gray.png"),
      placeholder: "우편번호",
      id: "iPostNum",
      name: "postNum",
      maxLength: 5,
    },
    {
      iconSrc: GetIcon("phone-gray.png"),
      placeholder: "전화번호 (- 없이 숫자만 입력)",
      name: "phoneNum",
      maxLength: 13,
    },
    {
      iconSrc: GetIcon("confirm-white.png"),
      placeholder: "전화번호 인증하기",
      name: "phoneID",
      button: true,
    },
  ];

  useEffect(() => {
    console.log("addExplanArr 상태가 변경되었습니다.");
    console.log(addExplanArr);
    InputNullCheck();
  }, [addExplanArr]);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  // 카카오 우편번호 메소드
  const kakaoHandler = {
    // 버튼 클릭
    clickButton: () => {
      setOpenPostcode(true);
    },
    // 주소 선택
    selectAddress: (data) => {
      var addr = "";

      if (data.userSelectedType === "R") {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }
      setOpenPostcode(false);
      ValidationStateChange(
        null,
        "올바른 주소 형식입니다.",
        "#5BBCFF",
        true,
        "address"
      );
      ValidationStateChange(
        null,
        "올바른 우편번호 형식입니다.",
        "#5BBCFF",
        true,
        "postNum"
      );

      formValues["address"] = addr;
      formValues["postNum"] = data.zonecode;
      console.log("주소: " + addr);
      console.log("우편번호: " + data.zonecode);
      console.log(formValues);
    },
  };

  // 유효성 텍스트 및 상태 변경
  const ValidationStateChange = (e, msg, color, flag, name = null) => {
    setAddExplanArr((prev) => ({
      ...prev,
      [e !== null ? e.target.name : name]: { msg, color, flag },
    }));
  };

  // 유효성 검사
  const ValidationManager = (e) => {
    if (e.target.name === "id") IDValidation(e);
    else if (e.target.name === "pw") PWValidation(e);
    else if (e.target.name === "cpw") CPWDValidation(e);
    else if (e.target.name === "name") NameValidation(e);
    else if (e.target.name === "nickName") NickNameValidation(e);
    else if (e.target.name === "sex") SexValidation(e);
    else if (e.target.name === "address") AddressValidation(e);
    else if (e.target.name === "postNum") PostNumValidation(e);
    //else if (e.target.name === "phoneNum") PhoneNumValidation(e);
  };
  // 유효성 모듈
  const IDValidation = useCallback((e) => {
    const idPattern = /^[a-zA-Z0-9]{6,30}$/;

    if (!idPattern.test(e.target.value))
      ValidationStateChange(
        e,
        "6-30자 이내의 영문/숫자를 포함해야 함",
        "#FF8E8F",
        false
      );
    else ValidationStateChange(e, "올바른 아이디 형식입니다.", "#5BBCFF", true);

    if (e.target.value === "")
      ValidationStateChange(
        e,
        "6-30자 이내, 영문/숫자 사용 가능",
        "#a5a5a5",
        false
      );
  }, []);

  const PWValidation = useCallback((e) => {
    const idPattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,30}$/;

    if (!idPattern.test(e.target.value))
      ValidationStateChange(
        e,
        "6-30자 이내의 영문/숫자/특수문자를 포함해야 함",
        "#FF8E8F",
        false
      );
    else
      ValidationStateChange(e, "올바른 비밀번호 형식입니다.", "#5BBCFF", true);

    if (e.target.value === "")
      ValidationStateChange(
        e,
        "8-30자 이내, 영문/숫자/기호 사용 가능",
        "#a5a5a5",
        false
      );
  }, []);

  const CPWDValidation = useCallback((e) => {
    if (formValues["pw"] !== e.target.value)
      ValidationStateChange(
        e,
        "비밀번호 입력과 값이 같아야 함",
        "#FF8E8F",
        false
      );
    else ValidationStateChange(e, "비밀번호가 동일합니다.", "#5BBCFF", true);

    if (e.target.value === "")
      ValidationStateChange(
        e,
        "8-30자 이내, 영문/숫자/기호 사용 가능",
        "#a5a5a5",
        false
      );
  }, []);

  const NameValidation = useCallback((e) => {
    const namePattern = /^[a-zA-Z가-힣]{1,20}$/;

    if (!namePattern.test(e.target.value))
      ValidationStateChange(
        e,
        "1-20자 이내의 영문 또는 한글 사용 가능",
        "#FF8E8F",
        false
      );
    else ValidationStateChange(e, "올바른 이름 형식입니다.", "#5BBCFF", true);

    if (e.target.value === "")
      ValidationStateChange(
        e,
        "1-20자 이내, 영문/한글 사용 가능",
        "#a5a5a5",
        false
      );
  }, []);

  const NickNameValidation = useCallback((e) => {
    const nickNamePattern = /^[a-zA-Z가-힣0-9]{1,30}$/;

    if (!nickNamePattern.test(e.target.value))
      ValidationStateChange(
        e,
        "1-30자 이내의 영문/한글/숫자 사용 가능",
        "#FF8E8F",
        false
      );
    else ValidationStateChange(e, "올바른 닉네임 형식입니다.", "#5BBCFF", true);

    if (e.target.value === "")
      ValidationStateChange(
        e,
        "1-30자 이내, 영문/한글/숫자 사용 가능",
        "#a5a5a5",
        false
      );
  }, []);
  const SexValidation = useCallback((e) => {
    ValidationStateChange(e, "", "#5BBCFF", true);
  }, []);
  const AddressValidation = useCallback((e) => {
    const addressPattern = /^[a-zA-Z가-힣0-9]{1,30}$/;

    if (!addressPattern.test(e.target.value))
      ValidationStateChange(
        e,
        "1-30자 이내의 영문/한글/숫자 사용 가능",
        "#FF8E8F",
        false
      );
    else ValidationStateChange(e, "올바른 주소 형식입니다.", "#5BBCFF", true);

    if (e.target.value === "")
      ValidationStateChange(
        e,
        "1-30자 이내, 영문/한글/숫자 사용 가능",
        "#a5a5a5",
        false
      );
  }, []);
  const PostNumValidation = useCallback((e) => {
    const postNumPattern = /^[0-9]{5}$/;

    if (!postNumPattern.test(e.target.value))
      ValidationStateChange(e, "숫자만 입력 가능", "#a5a5a5", false);
    else
      ValidationStateChange(e, "올바른 우편번호 형식입니다.", "#5BBCFF", true);

    if (e.target.value === "")
      ValidationStateChange(e, "5글자", "#a5a5a5", false);
  }, []);
  const PhoneNumValidation = useCallback(() => {
    const phonePattern = /^010[0-9]{8}$/;

    if (phonePattern.test(formValues.phoneNum)) {
      setAddExplanArr((prev) => ({
        ...prev,
        ["phoneNum"]: { msg: "", color: "", flag: true },
      }));
      setPBtnColor("#359eff");
      setPBtnMsg("전화번호 인증 완료");
      alert("휴대폰 인증이 완료되었습니다.");
    } else {
      setAddExplanArr((prev) => ({
        ...prev,
        ["phoneNum"]: { msg: "", color: "", flag: false },
      }));
      setPBtnColor("#b1dbfa");
      setPBtnMsg("전화번호 인증");
      alert("휴대폰 번호를 다시 확인해주세요");
    }
  }, []);
  const PhoneNumFormat = useCallback((e) => {
    if (e.target.value.length === 11) {
      e.target.value = e.target.value.replace(
        /(\d{3})(\d{4})(\d{4})/,
        "$1-$2-$3"
      );
    } else e.target.value = e.target.value.replace(/-/g, "");
  }, []);
  const InputNullCheck = () => {
    console.log("널체크");
    console.log(addExplanArr);
    const inputText = document.getElementsByClassName("inputText");
    if (inputText.length === 0) return;
    for (let i = 0; i < inputText.length; i++) {
      if (!addExplanArr[inputText[i].name]?.flag) return;
    }
    console.log("모든 정규식을 통과함");
    setIsInputCheck(true);
    btn.current.style.opacity = isInputCheck ? 1.0 : 0.5;
  };

  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNum") PhoneNumFormat(e);
    formValues[name] = value;
    console.log(formValues);
  };
  // 매니저
  const SignUpManager = () => {
    if (!isForm) {
      SignUpMsg();
      console.log(currentMsgIdx);
      if (currentMsgIdx === 5) {
        formValues.current = formValues;
        console.log(formValues.current);
        SignUpDataSend(formValues.current);
      }
    }
  };
  const SetPage = () => {
    setPageIdx(pageIdx + 3);
  };
  const SetFormDisplay = (state) => {
    setIsForm(state);
  };
  const SignUpMsg = () => {
    const cnt = Object.keys(culiMsg).length;
    if (currentMsgIdx < cnt) {
      setMsg(culiMsg[currentMsgIdx]);
      setcurrentMsgIdx(currentMsgIdx + 1);
      if (currentMsgIdx === cnt - 1) TimerNavigate(2, "login");
    }
    if ([1, 2, 3].includes(currentMsgIdx)) {
      SetFormDisplay(true);
    } else {
      SetFormDisplay(false);
    }
  };
  const BoxStyleChangeOn = (e, style) => {
    e.target.parentNode.style.outline = style;
  };
  const BoxStyleChangeOff = (e, style) => {
    e.target.parentNode.style.outline = "none";
  };
  const SetBoxHeight = () => {
    const boxHeight = document.getElementsByClassName("parentBox");
    let totalHeight = 0;
    for (let i = 0; i < boxHeight.length; i++) {
      totalHeight += parseInt(boxHeight[i].style.height) + 7;
    }
    return totalHeight;
  };
  const OnBlurHandler = (e) => {
    BoxStyleChangeOff(e);
    ValidationManager(e);
    console.log(formValues);
  };

  let add = 3;
  const RenderInputs = () => {
    const inputGroups = [];
    for (let i = pageIdx; i < pageIdx + add && i < inputBGData.length; i++) {
      const name = inputBGData[i].name;

      if (inputBGData[i].id === "man") {
        inputGroups.push(
          <div className="parentBox" style={{ display: "flex" }}>
            <label
              className="labelBG"
              htmlFor="man"
              style={{
                color: selectedGender === "M" ? "#359eff" : "#939393",
                border: selectedGender === "M" ? "1px solid #359eff" : "none",
              }}
              onClick={() => handleGenderSelect("M")}
            >
              <img
                className="inputImg"
                src={inputBGData[i].iconSrc}
                style={{
                  filter:
                    selectedGender === "M"
                      ? "opacity(0.5) drop-shadow(0 0 0 #359eff)"
                      : "opacity(0.5) drop-shadow(0 0 0 #939393)",
                }}
                alt=""
              />
              <input
                className="inputRadio"
                type="radio"
                name="sex"
                id="man"
                value="M"
                placeholder="남자"
                onChange={OnChangeHandler}
                onFocus={(e) => BoxStyleChangeOn(e, "2px solid #bebebe")}
                onBlur={OnBlurHandler} // 여기에 유효성 검사하는 함수도 추가해야함. 입력이 끝나면 판단 가능하게
              />
              남자
            </label>
            <label
              className="labelBG"
              htmlFor="woman"
              style={{
                marginLeft: "14px",
                color: selectedGender === "F" ? "#ff4b93" : "#939393",
                border: selectedGender === "F" ? "1px solid #ff4b93" : "none",
              }}
              onClick={() => handleGenderSelect("F")}
            >
              <img
                className="inputImg"
                src={GetIcon("woman.png")}
                alt=""
                style={{
                  filter:
                    selectedGender === "F"
                      ? "opacity(0.5) drop-shadow(0 0 0 #ff4b93)"
                      : "opacity(0.5) drop-shadow(0 0 0 #939393)",
                }}
              />
              <input
                className="inputRadio"
                type="radio"
                name="sex"
                id="woman"
                value="F"
                placeholder="여자"
                onChange={OnChangeHandler}
                onFocus={(e) => BoxStyleChangeOn(e, "2px solid #bebebe")}
                onBlur={OnBlurHandler} // 여기에 유효성 검사하는 함수도 추가해야함. 입력이 끝나면 판단 가능하게
              />
              여자
            </label>
          </div>
        );
        continue;
      } else if (inputBGData[i].name === "postNum") {
        inputGroups.push(
          <div
            className="parentBox"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div className="inputBG" key={i}>
              <img
                className="inputImg"
                src={inputBGData[i].iconSrc}
                style={{ marginLeft: "30px" }}
                alt=""
              />
              <input
                className="inputText"
                type={i === 1 || i === 2 ? "password" : "text"}
                name={name}
                defaultValue={formValues[name]}
                placeholder={inputBGData[i].placeholder}
                onChange={OnChangeHandler}
                onFocus={(e) => BoxStyleChangeOn(e, "2px solid #bebebe")}
                onBlur={OnBlurHandler}
                maxLength={inputBGData[i].maxLength}
                id="iPostNum"
              />
              <input
                className="postBG"
                type="button"
                onClick={kakaoHandler.clickButton}
                value={"우편번호 찾기"}
              />
              {openPostcode && (
                <DaumPostcode
                  style={{
                    width: "100%", // 팝업이 화면 너비에 맞추어지도록 설정
                    height: "100%", // 팝업이 화면 높이에 맞추어지도록 설정
                    position: "fixed", // 팝업이 고정 위치에 나타나도록 설정
                    top: 0, // 화면 맨 위에 팝업이 나타나도록 설정
                    left: 0, // 화면 왼쪽에 팝업이 나타나도록 설정
                    zIndex: 9999, // 다른 요소 위에 팝업이 나타나도록 설정
                  }}
                  onComplete={kakaoHandler.selectAddress} // 값을 선택할 경우 실행되는 이벤트
                  autoClose={false}
                  defaultQuery=""
                />
              )}
            </div>
            <p
              className="addExplan"
              style={{ color: addExplanArr[name]?.color, marginTop: "0px" }}
            >
              {addExplanArr[name]?.msg}
            </p>
          </div>
        );
        continue;
      }
      if (pageIdx >= 6) add = 4;
      if (i < inputBGData.length - 1) {
        inputGroups.push(
          <div className="parentBox">
            <div className="inputBG" key={i}>
              <img className="inputImg" src={inputBGData[i].iconSrc} alt="" />
              <input
                className="inputText"
                type={i === 1 || i === 2 ? "password" : "text"}
                name={name}
                defaultValue={formValues[name]}
                placeholder={inputBGData[i].placeholder}
                onChange={OnChangeHandler}
                onFocus={(e) => BoxStyleChangeOn(e, "2px solid #bebebe")}
                onBlur={OnBlurHandler}
                maxLength={inputBGData[i].maxLength}
                id={inputBGData[i].id === "iAddress" ? "iAddress" : null}
              />
            </div>
            {i < inputBGData.length - 2 && (
              <p
                className="addExplan"
                style={{ color: addExplanArr[name]?.color }}
              >
                {addExplanArr[name]?.msg}
              </p>
            )}
          </div>
        );
      } else {
        inputGroups.push(
          <div
            className="inputBGBtn"
            key={i}
            style={{ backgroundColor: pBtnColor }}
          >
            <img className="inputImg" src={inputBGData[i].iconSrc} alt="" />
            <input
              className="inputBtn"
              type="button"
              name="phone"
              value={pBtnMsg}
              onClick={PhoneNumValidation}
            />
          </div>
        );
      }
    }
    return inputGroups;
  };
  const NextPage = () => {
    if (!isInputCheck) {
      return; // 버튼이 비활성화된 경우 클릭 이벤트 처리하지 않음
    }
    SignUpMsg();
    SetPage();
    setIsInputCheck(false);
    btn.current.style.opacity = isInputCheck ? 1.0 : 0.5;
    console.log(formValues);
    console.log("다음");
  };
  return (
    <div className="signUp">
      <div className="div" onClick={() => SignUpManager()}>
        <CenterBox>
          <div className="overlap-group">
            <div className="rectangle">
              <img
                className="polygon"
                alt="Polygon"
                src={GetIcon("polygon.png")}
              />
              <span id="signUpText">{msg}</span>
            </div>
            <img className="robot" alt="Robot" src={GetIcon("chatbot-white7.png")} />
          </div>
          <div className="box">
            {isForm && (
              <form className="signUpForm" id="signUpForm">
                <div
                  className="inputBoxBG1"
                  style={{
                    height: SetBoxHeight,
                    paddingTop: "15px",
                    paddingBottom: "15px",
                  }}
                >
                  {<RenderInputs />}
                </div>
                <input
                  id="submitBtn"
                  type="button"
                  value="다음으로"
                  ref={btn}
                  style={{ opacity: isInputCheck ? 1.0 : 0.5 }}
                  onClick={NextPage}
                />
              </form>
            )}
          </div>
        </CenterBox>
        
      </div>
    </div>
  );
};
