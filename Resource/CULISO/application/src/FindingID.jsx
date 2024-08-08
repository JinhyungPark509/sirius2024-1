import React, { useState, useCallback } from 'react';
import GetIcon from "./modules/GetIcon";
import styled from 'styled-components';
import { FindingDataSend } from "./modules/DataRouter";
import "./style.css";
import { Navigate, SmallTextMenus } from "./modules/Navigate";

const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Text = styled.p`
  text-align: ${(props) => props.align};
  width: 331px;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
`;

const InputContainer = styled.div`
  width: 285px;
  height: 47px;
  border-radius: 6px;
  background: #EAE8E8;
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const InputImg = styled.img`
  width: 22px;
  margin-left: 20px;
`;

const InputTag = styled.input`
  width: 210px;
  margin-left: 10px;
  color: #939393;
  border: none;
  background-color: #EAE8E8;
  outline: none;
`;

const Btn = styled.button`
  width: 285px;
  height: 47px;
  margin-top: 20px;
  color: white;
  background-color: ${(props) => props.color};
  cursor: pointer;
  outline: none;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
`;

const OverlapGroup = ({ children }) => (
    <div className="overlap-group">{children}</div>
);

const Rectangle = () => (
    <div className="rectangle"></div>
);

const Group = ({ onClick, children }) => (
    <div className="group" onClick={onClick}>{children}</div>
);

const Overlap = ({ children }) => (
    <div className="overlap">{children}</div>
);

const Polygon = ({ src, alt }) => (
    <img className="polygon" src={src} alt={alt} />
);

const Robot = ({ src, alt }) => (
    <img className="robot" src={src} alt={alt} />
);

const Input = ({ icon, t, n, ph, onChange }) => {
    return (
        <InputContainer>
            <InputImg src={GetIcon(icon)} alt={n} />
            <InputTag type={t} name={n} placeholder={ph} onChange={onChange} />
        </InputContainer>
    );
};

export const FindingID = () => {
    const [formValues, setFormValues] = useState({ phoneNum: "" });
    const [pBtnColor, setPBtnColor] = useState("#b1dbfa");
    const [pBtnMsg, setPBtnMsg] = useState("전화번호 인증");
    const [showScreen, setShowScreen] = useState(false);
    const [isPhoneNumValidated, setIsPhoneNumValidated] = useState(false);
    const [userID, setUserID] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const PhoneNumValidation = useCallback(async () => {
        const phonePattern = /^010[0-9]{8}$/;

        if (phonePattern.test(formValues.phoneNum.replace(/-/g, ''))) {
            const NoHyphenPhoneNum = formValues.phoneNum.replace(/-/g, '');
            try {
                const userid = await FindingDataSend(NoHyphenPhoneNum);

                if (userid) {
                    console.log('userID exists:', userid);
                    setUserID(userid);
                    setErrorMessage("");
                    setPBtnColor("#359eff");
                    setPBtnMsg("전화번호 인증 완료");
                    setIsPhoneNumValidated(true);
                    alert("휴대폰 인증이 완료되었습니다.");
                } else {
                    console.log('Failed to get userID');
                    setUserID("");
                    setErrorMessage("전화번호와 일치하는 회원 아이디를 찾을 수 없습니다.");
                    alert("전화번호와 일치하는 회원 아이디를 찾을 수 없습니다.");
                }
            } catch (error) {
                console.error("Error:", error);
                setUserID("");
                setErrorMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
            }
        } else {
            setPBtnColor("#b1dbfa");
            setPBtnMsg("전화번호 인증");
            setIsPhoneNumValidated(false);
            alert("휴대폰 번호를 다시 확인해주세요");
        }
    }, [formValues]);

    const PhoneNumFormat = useCallback((e) => {
        const value = e.target.value.replace(/-/g, '');
        if (value.length === 11) {
            e.target.value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
    }, []);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "phoneNum") {
            if (value.replace(/-/g, '').length > 11) {
                e.target.value = value.slice(0, 13);
                return;
            }
            PhoneNumFormat(e);
            setFormValues((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isPhoneNumValidated) {
            alert("휴대폰 인증을 완료해주세요.");
            return;
        }
        const NoHyphenPhoneNum = formValues.phoneNum.replace(/-/g, '');

        try {
            const userid = await FindingDataSend(NoHyphenPhoneNum);

            if (userid) {
                console.log('userID exists:', userid);
                setUserID(userid);
                setErrorMessage("");
            } else {
                console.log('Failed to get userID');
                setUserID("");
                setErrorMessage("전화번호와 일치하는 회원 아이디를 찾을 수 없습니다.");
            }
            setShowScreen(true);
        } catch (error) {
            console.error("Error:", error);
            setUserID("");
            setErrorMessage("오류가 발생했습니다. 다시 시도해주세요.");
            setShowScreen(true);
        }
    };

    return (
        <div className="finding">
            {showScreen ? (
                <div className="screen">
                    <div className="div">
                        <OverlapGroup>
                            <Rectangle />
                                <TextWrapper>
                                    <div className='printID'>
                                        {userID ? (
                                            <>
                                                회원님의 아이디는 <br/> {userID} 입니다.
                                            </>
                                        ) : (
                                            errorMessage
                                        )}
                                    </div>
                                </TextWrapper>
                            <div className="view" onClick={() => Navigate("login")} />
                            <Group onClick={() => Navigate("login")}>
                                <div className="text-wrapper-4">
                                    CULISO 로그인
                                </div>
                                <img className="closed-padlock" alt="Closed padlock" src="closed-padlock-white.png" />
                            </Group>
                        </OverlapGroup>
                        <p className="CULISO-account">
                            <span className="span">CULISO</span>
                            <span className="text-wrapper-5">&nbsp;</span>
                            <span className="text-wrapper-6">Account </span>
                        </p>
                        <Overlap>
                            <div className="rectangle-3" />
                            <Polygon src="polygon.png" alt="Polygon" />
                            <div className="text-wrapper-7">회원님의 아이디를 찾았어요!</div>
                        </Overlap>
                        <Robot src="chatbot-white7.png" alt="Robot" />
                    </div>
                </div>
            ) : (
                <div className="div">
                    <CenterBox>
                        <Text color={"#3252C2"} size={"15px"}>
                            <span style={{ fontWeight: "bold" }}>CULISO</span> <span style={{ color: "#4B66C8" }}>Account</span>
                        </Text>
                        <div className='findingBG'>
                            <Text align={'center'} color={"black"} size={"15px"} style={{ marginTop: '40px', fontFamily: 'LINESeedKR-Bd' }}>
                                아이디를 찾기 위해<br />
                                전화번호 인증을 받아주세요!
                            </Text>
                            <form onSubmit={handleSubmit} method="post">
                                <Input icon={"profile-gray.png"} t={"text"} n={"phoneNum"} ph={"전화번호 (- 없이 숫자만 입력)"} onChange={onInputChange} />
                                <Btn type="button" color={pBtnColor} onClick={PhoneNumValidation}>{pBtnMsg}</Btn>
                                <input className="findingSubmit" type="submit" value={"다음으로"} disabled={!isPhoneNumValidated} /> 
                            </form>
                            <SmallTextMenus login={true} findPW={true}/>
                        </div>
                    </CenterBox>
                </div>
            )}
        </div>
    );
};
