import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import GetIcon from "./modules/GetIcon";
import "./style.css";
import { GetSex, GetName, SaveProfileImgURL } from "./modules/DataRouter";
import { MenuBar } from "./MenuBar";
import { BackButton, UpdateButton } from "./modules/Navigate";
// css
const CenterBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 80%;
`;
const Text = styled.span`
  height: ${(props) => props.height};
  text-align: ${(props) => props.align};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-family: ${(props) => props.font};
  margin: ${(props) => props.margin};
`;
const EmptyContainer = styled.div`
  width: ${(props) => props.width};
  margin: ${(props) => props.margin};
  background-color: ${(props) => props.bg};
  border-radius: ${(props) => props.radius};;
`;
const InputContainer = styled.div`
  width: ${(props) => props.width};
  height: 35px;
  background: ${(props) => props.bg};
  display: flex;
  align-items: center;
`;
const InputImg = styled.img`
  width: ${(props) => props.width};
  margin-left: ${(props) => props.left};
  margin-right: ${(props) => props.right};
`;
const InputTag = styled.input`
  width: 210px;
  margin-left: 10px;
  color: #939393;
  border: none;
  background-color: #eae8e8;
  outline: none;
`;
const Button = styled.button`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  font-size: ${(props) => props.size};
  background-color: ${(props) => props.bg};
  border-radius: ${(props) => props.radius};
`;
export const MyPage = () => {
  const [sexImg, setSexImg] = useState();
  const [name, setName] = useState();
  const fileInput = useRef(null);

  const onChange = (e) => {
    const tempImg = sexImg;
    if(e.target.files[0]){
      setSexImg(e.target.files[0])
      SaveProfileImgURL(e.target.files[0]);
    }
    else{
      setSexImg(tempImg);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if(reader.readyState === 2){
        setSexImg(reader.result);
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  }


  useEffect(() => {
    const GetSexData = async () => {
      const sex = await GetSex();
      setSexImg(sex);
    };
    const GetNameData = async () => {
      const name = await GetName();
      setName(name);
    };
    GetSexData();
    GetNameData();
  }, []);


  return (
    <div className="myPage">
      <div className="div">
        <CenterBox>
          <EmptyContainer width="80%"> {/* 좌우 80% 박스 */}
            <EmptyContainer style={{display:"flex", alignItems:"center"}}>
              <BackButton left="0px"/>
              <Text color={"#3252C2"} size={"15px"}>
                <span style={{ fontWeight: "bold" }}>CULISO </span>
                <span style={{ color: "#4B66C8" }}>MyPage</span>
              </Text>
            </EmptyContainer>
            <br/>
            <InputContainer bg={"none"}>
              <InputImg src={GetIcon(sexImg)} width={"55px"} height={"59px"} onClick={()=>{fileInput.current.click()}}/>
              <input type="file" style={{display:"none"}} accept="image/jpg,image/png,image/jpeg" name="profileImg" onChange={onChange} ref={fileInput}/>
              <EmptyContainer>
                <EmptyContainer style={{display:"flex", alignItems:"center", marginBottomom: "5px"}}>
                  <Text margin="0 0 0 10px" size={"15px"}>{name}</Text>
                </EmptyContainer>
                <UpdateButton/>
              </EmptyContainer>
            </InputContainer>
            {/* 커뮤니티 */}
            <EmptyContainer margin="50px 0px 0px 0px">
              <p>커뮤니티</p>
              <EmptyContainer width="100%" bg="#FAFAFA" radius="20px" style={{display:"flex", justifyContent:"center", padding:"6px 0"}}>
                <EmptyContainer width="80%">
                  <InputContainer>
                    <InputImg src={GetIcon("mypage-list.png")} width={"20px"}/>
                    <Text height="20px" margin="0 0 0 8px" style={{borderBottom:"1px solid black"}}>작성 게시글 목록</Text>
                  </InputContainer>
                  <InputContainer>
                    <InputImg src={GetIcon("comments.png")} width={"20px"}/>
                    <Text height="20px" margin="0 0 0 8px" style={{borderBottom:"1px solid black"}}>작성 댓글 목록</Text>
                  </InputContainer>
                </EmptyContainer>
              </EmptyContainer>
            </EmptyContainer>

            {/* 기기 사용/관리 */}
            <EmptyContainer margin="50px 0px 0px 0px">
              <p>기기 사용/관리</p>
              <EmptyContainer width="100%" bg="#FAFAFA" radius="20px" style={{display:"flex", justifyContent:"center", padding:"6px 0"}}>
                <EmptyContainer width="80%">
                  <InputContainer onClick={() => {alert("아직 구현되지 않은 기능입니다.")}}>
                    <InputImg src={GetIcon("iot-list.png")} width={"20px"}/>
                    <Text height="20px" margin="0 0 0 8px" style={{borderBottom:"1px solid black"}}>기기 목록</Text>
                  </InputContainer>
                  <InputContainer onClick={() => {alert("아직 구현되지 않은 기능입니다.")}}>
                    <InputImg src={GetIcon("using.png")} width={"20px"}/>
                    <Text height="20px" margin="0 0 0 8px" style={{borderBottom:"1px solid black"}}>사용 기록 조회</Text>
                  </InputContainer>
                  <InputContainer onClick={() => {alert("아직 구현되지 않은 기능입니다.")}}>
                    <InputImg src={GetIcon("iot-req.png")} width={"20px"}/>
                    <Text height="20px" margin="0 0 0 8px" style={{borderBottom:"1px solid black"}}>기기 등록 요청</Text>
                  </InputContainer>
                  <InputContainer onClick={() => {alert("아직 구현되지 않은 기능입니다.")}}>
                    <InputImg src={GetIcon("routine.png")} width={"20px"}/>
                    <Text height="20px" margin="0 0 0 8px" style={{borderBottom:"1px solid black"}}>루틴 관리</Text>
                  </InputContainer>
                </EmptyContainer>
              </EmptyContainer>
            </EmptyContainer>
          </EmptyContainer>
          {/* 메뉴바 */}
          <MenuBar/>
        </CenterBox>
      </div>
    </div>
  );
};
