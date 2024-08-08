//import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GetIcon from "./GetIcon";
import styled from 'styled-components';

// css
const Text = styled.span`
  text-align: ${(props) => props.align};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-family: ${(props) => props.font};
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 15px;
  cursor: pointer;
`;
const Img = styled.img`
  width: ${(props) => props.width};
  margin-top: ${(props) => props.top};
  color: ${(props) => props.color};
`;

export const Navigate = (name) => {
  // const navigate = useNavigate();
  // const nav = () =>{
  //   navigate('/' + name);
  // };

  window.location.href = "/" + name;

  
  return null;//(<div><button onClick={nav}>Navigate</button></div>);
}

export const TimerNavigate = (ms, name) => {
  //const nav = useNavigate();
  const time = ms * 1000;
  // let timer = useEffect(() => {
  //   setTimeout(() => {
  //     nav("/" + name);
  //   }, time);
  // }, [nav, name, time]);
  let timer = setTimeout(()=>{
    window.location.href = "/" + name;
  }, time)

  return () => {
    clearTimeout(timer);
  };
}

export const BackButton = ({left}) => {
  const navigate = useNavigate();
  const back = () => {
    navigate(-1);
  };
  return(
    <img src={GetIcon("back-arrow.png")} style={{width:"15px", marginRight:"10px", marginLeft:left}} onClick={back} alt="Back"/>
  )
}
export const UpdateButton = () => {
  const navigate = useNavigate();
  const update = () => {
    navigate("/updateProfile");
  };
  return(
    <button 
      style={{
        height:"20px", 
        fontSize:"10px",
        backgroundColor:"#FFFFFF",
        borderRadius:"10px",
        border:"0.3px solid black",
        marginLeft: "10px",
        marginTop: "5px"}} 
      onClick={update}>
    내 정보 수정
    </button> 
  )
}
export const SubmitButton = ({path}) => {
  const navigate = useNavigate();
  const submit = () => {
    navigate("/" + path);
  };
  return(
    <button 
      type="submit"
      style={{
        width: "285px",
        height:"44px", 
        fontSize:"10px",
        color:"#474747",
        backgroundColor:"#b1dbfa",
        borderRadius:"10px",
        border:"none",
        marginTop: "30px",
        fontFamily: "SejonghospitalBold"}} 
      onClick={submit}>
    수정하기
    </button> 
  )
}
export const MenuButton = ({path = null, name, iconName, dFlag}) => {
  const navigate = useNavigate();
  const menu = () => {
    if(path !== null)
      navigate("/" + path);
  };
  return(
    <ImgBox onClick={()=>dFlag ? menu() : alert("아직 구현되지 않은 기능입니다.")}>
        <Img src={GetIcon(iconName)} width={"37px"} />
        <Text align="center" size="12px" color="white" style={{ marginTop: "5px", whiteSpace: 'nowrap'}}>{name}</Text>
    </ImgBox>
  )
}
const NewButton = ({path, name}) => {
  const navigate = useNavigate();
  const menu = () => {
      navigate("/" + path);
  };
  return(
    <div onClick={menu}>{name}</div>
  )
}
export const SmallTextMenus = ({login, signUp, findID, findPW}) => {
  return(
    <div className="aDiv">
      {login && (<NewButton path={"login"} name={"로그인"}/>)}
      {signUp && (<NewButton path={"signUp"} name={"계정 생성"}/>)}
      {findID && (<NewButton path={"findingID"} name={"아이디 찾기"}/>)}
      {findPW && (<NewButton path={"findingPW"} name={"비밀번호 찾기"}/>)}
    </div>
  )
}