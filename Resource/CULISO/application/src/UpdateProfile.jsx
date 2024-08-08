import GetIcon from "./modules/GetIcon";
import styled from "styled-components";
import DaumPostcode from "react-daum-postcode";
import React, { useState, useEffect, useRef } from "react";
import { PWCheck, GetUserData, ProfileUpdate } from "./modules/DataRouter";
import "./style.css";
// css
const CenterBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const CuliImg = styled.img`
    height: 51px;
    left: 155px;
    object-fit: cover;
    top: 150px;
    width: 50px;
    margin-bottom: 7px;
`;
const CuliMsg = styled.div`
    height: 66px;
    left: 43px;
    top: 201px;
    width: 276px;
`;
const P = styled.p`
    white-space: pre-wrap;
    color: #8abfff;
    font-size: 16px;
    line-height: normal;
    position: absolute;
    text-align: center;
`;
const InputContainer = styled.div`
  width: 285px;
  height: 47px;
  border-radius: 6px;
  background: ${(props) => props.bg};
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;
const InputTag = styled.input`
  width: 210px;
  margin-left: 10px;
  border: none;
  background: ${(props) => props.bg};
  outline: none;
  color: #939393;
  ${props => props.cursor && `
    pointer-events: none;
    caret-color: transparent;
  `}
`
const InputImg = styled.img`
  width: 22px;
  margin-left: 20px;
  ${props => props.cursor && `
    pointer-events: none;
    caret-color: transparent;
  `}
`;
const Form = styled.form`
    margin-top: ${(props) => props.top};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;  
`;
const InContainer = styled.div`
    width: 285px;
`;
const Text = styled.p`
  text-align: ${(props) => props.align};
  width:320px;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
`;
const EmptyContainer = styled.div`
    margin-top: ${(props) => props.top};
    padding: 30px 0;
    background-color: #FAFAFA;
    width: 320px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;
const Input = ({ icon, t, n, ph, v, onChange, readFlag, max  }) => {
  return (
    <InputContainer bg={readFlag === true ? "#FAFAFA" : "#EAE8E8"}>
      <InputImg cursor={readFlag} src={GetIcon(icon)}/>
      <InputTag type={t} cursor={readFlag} name={n} bg={readFlag === true ? "#FAFAFA" : "#EAE8E8"} value={v} placeholder={ph} onChange={onChange} readOnly={readFlag} maxLength={max} />
    </InputContainer>
  );
};
const Culi = () => {
    return (
        <CenterBox>
            <CuliImg src={GetIcon("chatbot-white7.png")} />
            <CuliMsg>
                <div className="overlap-group-wrapper">
                    <div className="overlap-group-2">
                        <img className="polygon" alt="Polygon" src={GetIcon("polygon.png")}/>
                        <div className="rectangle">
                            <P>{"정보를 수정하기 위해\n비밀번호를 입력해 주세요 !"}</P>
                        </div>
                    </div>
                </div>
            </CuliMsg>
        </CenterBox>
    )
}


export const UpdateProfile = () => {
    const [flag, setFlag] = useState(false);
    const [msg, setMsg] = useState();
    const [openPostcode, setOpenPostcode] = useState(false);
    const [secFlag, setSecFlag] = useState(false);
    const [sexImgName, setSexImgName] = useState();

    const [formValues, setFormValues] = useState({
        id: null,
        pw: null,
        name: null,
        nickName: null,
        address: null,
        postNum: null,
        sex: null,
        phoneNum: null,
        createDate: null
    });
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

            formValues.address = addr;
            formValues.postNum = data.zonecode;
            console.log(formValues);
        },
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const InfoOn = async (event) => {
        const result = await PWCheck(event);
        if(result === false) setMsg("메세지를 다시 입력해 주세요.");
        else setMsg("");
        
        const userData = await GetUserData(event);
        setFormValues(userData);

        const sexImgName = formValues.sex === "M" ? "man.png" : "woman.png";
        setSexImgName(sexImgName);
        setFlag(result);
    }
    const InfoUpdate = async (event) => {
        event.preventDefault();
        const result = await PWCheck(event);
        if(result === false) setMsg("메세지를 다시 입력해 주세요.");
        else setMsg("");

        if(formValues.pw === event.target.pw.value){

            ProfileUpdate(formValues);
            console.log("비밀번호 같음");
        }
        else{
            console.log("비밀번호 다름");
        }
        
    }

    return (
        <div className="main">
            <div className="div">
                <CenterBox>
                    {!flag ? (
                        <div className="nanda">
                            <Culi/>
                            <Form onSubmit={InfoOn} method="post" top="50px">
                                <EmptyContainer top="30px">
                                    <InContainer>
                                        <Input icon={"closed-padlock-gray.png"} t={"password"} n={"pw"} ph={"비밀번호"}/>
                                        <span style={{color:"#FF8E8F", fontSize: "12px", marginLeft: "5px"}}>{msg}</span>
                                        <input className="loginSubmit" type="submit" value={"다음으로"}/>
                                    </InContainer>
                                </EmptyContainer>
                                
                            </Form>
                        </div>
                    ) : (
                        // 입력 성공시 정보 업데이트
                        <Form onSubmit={InfoUpdate} method="post" top="10px">
                            {!secFlag && (
                                <div>
                                    <Text color={"#3252C2"} size={"15px"} style={{marginTop:"30px"}}><span style={{fontWeight:"bold"}}>CULISO</span> <span style={{color:"#4B66C8"}}>Account</span></Text>
                                    <EmptyContainer>
                                        <Input icon={sexImgName} t={"text"} v={formValues.id} n={"id"} ph={"아이디"} onChange={handleChange} readFlag={true}/>
                                        <Input icon={"phone-gray.png"} t={"text"} v={formValues.phoneNum} n={"phoneNum"} ph={"전화번호"} onChange={handleChange} readFlag={true} />
                                        <Input icon={"calendar-gray.png"} t={"text"} v={formValues.createDate} n={"createDate"} ph={"생성일"} onChange={handleChange} readFlag={true} />
                                        <br/>
                                        <Input icon={"N-gray.png"} t={"text"} v={formValues.name} n={"name"} ph={"이름"} onChange={handleChange} readFlag={false} />
                                        <Input icon={"N-gray.png"} t={"text"} v={formValues.nickName} n={"nickName"} ph={"별명"} onChange={handleChange} readFlag={false} />
                                        <br/>
                                        <Input icon={"location-gray.png"} t={"text"} v={formValues.address} n={"address"} ph={"주소"} onChange={handleChange} readFlag={false} />
                                        <div className="inputBG">
                                            <img class="inputImg" src="/location-gray.png" alt="" style={{marginLeft: "20px"}}/>
                                            <input class="inputText" type="text" name="postNum" placeholder="우편번호" maxlength="5" id="iPostNum" value={formValues.postNum}/>
                                            <input class="postBG" type="button" value="우편번호 찾기" onClick={kakaoHandler.clickButton}/>
                                        </div>
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
                                        <input className="loginSubmit" type="button" value={"다음으로"} onClick={()=>{setSecFlag(true)}}/>
                                    </EmptyContainer>
                                </div>
                            )}
                            {secFlag && (
                                <EmptyContainer top="270px">
                                    <Culi/>
                                    <InContainer>
                                        <Input icon={"closed-padlock-gray.png"} t={"password"} n={"pw"} ph={"비밀번호"} />
                                        <span style={{color:"#FF8E8F", fontSize: "12px", marginLeft: "5px"}}>{msg}</span>
                                        <input className="loginSubmit" type="submit" value={"수정하기"} />
                                    </InContainer>
                                </EmptyContainer>
                            )}
                        </Form>
                    )}
                </CenterBox>
            </div>
        </div>
    );
};
  

