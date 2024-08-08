import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { verifyPhoneNum, resetPassword } from './modules/DataRouter';
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

const ErrorMessage = styled.p`
  color: #FF8E8F;
  font-size: 10px;
  text-align: left;
`;

const Input = ({ icon, t, n, ph, onChange, value }) => {
    return (
        <InputContainer>
            <InputImg src={icon} alt={n} />
            <InputTag type={t} name={n} placeholder={ph} onChange={onChange} value={value || ''} />
        </InputContainer>
    );
};

export const FindingPW = () => {
    const [formValues, setFormValues] = useState({ id: "", phoneNum: "", newPassword: "", confirmPassword: "" });
    const [btnColor, setBtnColor] = useState("#b1dbfa");
    const [btnMsg, setBtnMsg] = useState("인증번호 받기");
    const [isPhoneNumValidated, setIsPhoneNumValidated] = useState(false);
    const [showResetScreen, setShowResetScreen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const PhoneNumValidation = useCallback(async () => {
        const phonePattern = /^010[0-9]{8}$/;

        if (phonePattern.test(formValues.phoneNum.replace(/-/g, ''))) {
            const NoHyphenPhoneNum = formValues.phoneNum.replace(/-/g, '');
            try {
                const result = await verifyPhoneNum(NoHyphenPhoneNum, formValues.id);
                if (result && result.success) {
                    setBtnColor("#359eff");
                    setBtnMsg("전화번호 인증 완료");
                    setIsPhoneNumValidated(true);
                    setErrorMessage("");
                    alert("휴대폰 인증이 완료되었습니다.");
                } else {
                    setBtnColor("#b1dbfa");
                    setBtnMsg("전화번호 인증");
                    setIsPhoneNumValidated(false);
                    alert("아이디와 전화번호가 일치하지 않습니다.");
                }
            } catch (error) {
                setBtnColor("#b1dbfa");
                setBtnMsg("전화번호 인증");
                setIsPhoneNumValidated(false);
                alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
            }
        } else {
            setBtnColor("#b1dbfa");
            setBtnMsg("전화번호 인증");
            setIsPhoneNumValidated(false);
            alert("휴대폰 번호를 다시 확인해주세요");
        }
    }, [formValues]);

    const PhoneNumFormat = useCallback((value) => {
        const onlyNums = value.replace(/[^0-9]/g, '');
        if (onlyNums.length <= 3) return onlyNums;
        if (onlyNums.length <= 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    }, []);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === "phoneNum") {
            formattedValue = PhoneNumFormat(value);
        }
        setFormValues((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (!isPhoneNumValidated) {
            alert("휴대폰 인증을 완료해주세요.");
            return;
        }
        setShowResetScreen(true);
        setFormValues((prev) => ({
            ...prev,
            newPassword: "",
            confirmPassword: ""
        }));
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const password = formValues.newPassword;

        if (password.length < 8) {
            setErrorMessage("최소 8자 이상이어야 합니다.");
            return;
        }
        if (password.length > 30) {
            setErrorMessage("최대 30자 이하이어야 합니다.");
            return;
        }
        const passwordPattern = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
        if (!passwordPattern.test(password)) {
            setErrorMessage("영어, 숫자, 특수문자가 하나씩 포함되어야 합니다.");
            return;
        }
        if (formValues.newPassword !== formValues.confirmPassword) {
            setErrorMessage("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }
        const NoHyphenPhoneNum = formValues.phoneNum.replace(/-/g, '');
        try {
            const result = await resetPassword(formValues.id, NoHyphenPhoneNum, formValues.newPassword);
            if (result && result.success) {
                setErrorMessage("");
                alert(result.message);
                Navigate("login");
            } else {
                setErrorMessage(result.message || "비밀번호 재설정에 실패했습니다.");
            }
        } catch (error) {
            setErrorMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="finding">
            {!showResetScreen ? (
                <div className="div">
                    <CenterBox>
                        <Text color={"#3252C2"} size={"15px"}>
                            <span style={{ fontWeight: "bold" }}>CULISO</span> <span style={{ color: "#4B66C8" }}>Account</span>
                        </Text>
                        <div className="loginBG">
                            <Text align={'center'} color={"black"} size={"20px"} style={{ marginTop: '20px', fontFamily: 'LINESeedKR-Bd' }}>
                                비밀번호 찾기
                            </Text>
                            <form onSubmit={handleNext} method="post">
                                <Input icon={"profile-gray.png"} t={"text"} n={"id"} ph={"아이디"} onChange={onInputChange} value={formValues.id} />
                                <Input icon={"phone-gray.png"} t={"text"} n={"phoneNum"} ph={"전화번호 (- 없이 숫자만 입력)"} onChange={onInputChange} value={formValues.phoneNum} />
                                <Btn type="button" color={btnColor} onClick={PhoneNumValidation}>{btnMsg}</Btn>
                                <input className="findingSubmit" type="submit" value={"다음으로"} />
                            </form>
                            <SmallTextMenus login={true} findID={true}/>
                        </div>
                    </CenterBox>
                </div>
            ) : (
                <div className="div">
                    <CenterBox>
                        <Text color={"#3252C2"} size={"15px"}>
                            <span style={{ fontWeight: "bold" }}>CULISO</span> <span style={{ color: "#4B66C8" }}>Account</span>
                        </Text>
                        <div className="loginBG">
                            <Text align={'center'} color={"black"} size={"20px"} style={{ marginTop: '20px', fontFamily: 'LINESeedKR-Bd' }}>
                                비밀번호 재설정
                            </Text>
                            <form onSubmit={handlePasswordReset} method="post">
                                <Input icon={"closed-padlock-gray.png"} t={"password"} n={"newPassword"} ph={"새 비밀번호"} onChange={onInputChange} value={formValues.newPassword} />
                                <Input icon={"closed-padlock-gray.png"} t={"password"} n={"confirmPassword"} ph={"비밀번호 확인"} onChange={onInputChange} value={formValues.confirmPassword} />
                                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                                <input className="findingSubmit" type="submit" value={"비밀번호 재설정"} />
                            </form>
                            <SmallTextMenus login={true} findID={true}/>
                        </div>
                    </CenterBox>
                </div>
            )}
        </div>
    );
};
