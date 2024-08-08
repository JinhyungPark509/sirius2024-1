import GetIcon from "./modules/GetIcon";
import styled from 'styled-components';
import { LoginDataSend } from "./modules/DataRouter";
import "./style.css";
import { SmallTextMenus } from "./modules/Navigate";

// css
const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Text = styled.p`
  text-align: ${(props) => props.align};
  width:331px;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
`;
const InputImg = styled.img`
  width: 22px;
  margin-left: 20px;
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
const InputTag = styled.input`
  width: 210px;
  margin-left: 10px;
  color: #939393;
  border: none;
  background-color: #EAE8E8;
  outline: none;
`
//컴포넌트
const Input = ({ icon, t, n, ph }) => {
  return (
    <InputContainer>
      <InputImg src={GetIcon(icon)}/>
      <InputTag type={t} name={n} placeholder={ph}/>
    </InputContainer>
  );
};


export const Login = () => {
  return (
    <div className="login">
      <div className="div">
        <CenterBox>
          <Text color={"#3252C2"} size={"15px"}><span style={{fontWeight:"bold"}}>CULISO</span> <span style={{color:"#4B66C8"}}>Account</span></Text>
          <div className="loginBG">
            <Text align={'center'} color={"black"} size={"15px"} style={{marginTop: '40px', fontFamily: 'LINESeedKR-Bd'}}>
              집 안의 모든 기기를 보다 쉽고,<br/>
              간편하게 관리하기 !<br/>
              지금 큐리소 계정으로 로그인하세요.
            </Text>
            <form onSubmit={LoginDataSend} method="post">
              <Input icon={"profile-gray.png"} t={"text"} n={"id"} ph={"아이디"}/>
              <Input icon={"closed-padlock-gray.png"} t={"password"} n={"pw"} ph={"비밀번호"}/>
              <label style={{width:"285px", display: "flex", alignItems: "center"}}>
                <input type="checkbox" className="checkBox"/><span style={{color: "#8a8a8a", fontSize: "12px", marginLeft: "8px",}}>아이디 기억하기</span>
              </label>
              <input className="loginSubmit" type="submit" value={"로그인"}/>
            </form>
            <SmallTextMenus signUp={true} findID={true} findPW={true}/>
          </div>
        </CenterBox>
      </div>
    </div>
  );
};
