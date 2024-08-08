import GetIcon from "./modules/GetIcon";
import { Navigate } from "./modules/Navigate";
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

const CuliBox = styled.div`
    flex-direction: column;
    height: 200px;
    width: 300px;
    justify-content: center;
    display: flex;
    align-items: center;
`;
const CuliImg = styled.img`
    height: 51px;
    width: 50px;
`;
const CuliMsg = styled.div`
    height: 66px;
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
const ButtonBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.back};
    margin: 10px 0;
    border-radius: 10px;
    height: 44px;
    width: 229px;
    cursor:pointer;
`;
const Img = styled.img`
    height: 22px;
    width: 22px;
`;
const Text = styled.span`
    color: #ffffff;
    font-size: 16px;
    margin-left: 10px;
    white-space: nowrap;
`;
const Culi = () => {
  return (
      <CuliBox>
          <CuliImg src={GetIcon("chatbot-white7.png")} />
          <CuliMsg>
              <div className="overlap-group-wrapper">
                  <div className="overlap-group-2">
                      <img className="polygon" alt="Polygon" src={GetIcon("polygon.png")}/>
                      <div className="rectangle">
                          <P>{"큐리소에 오신 것을 환영합니다 !"}</P>
                      </div>
                  </div>
              </div>
          </CuliMsg>
      </CuliBox>
  )
}
const ButtonContainer = ({path, imgName, text, bg}) => {
  return (
      <ButtonBox back={bg} onClick={() => Navigate(path)}>
        <Img src={GetIcon(imgName)} alt="login"/>
        <Text>{text}</Text>
      </ButtonBox>
  )
}
export const Main = () => {
  return (
    <div className="main">
      <div className="div">
          <CenterBox>
          <Culi/>
            <ButtonContainer path={"login"} imgName={"white-padlock.png"} text={"CULISO 로그인"} bg={"#67acff"}/>
            <ButtonContainer path={"signUp"} imgName={"join.png"} text={"회원가입"} bg={"#4b93ff"}/>
          </CenterBox>
      </div>
    </div>
  );
};
