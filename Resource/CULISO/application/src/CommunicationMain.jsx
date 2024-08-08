import React, { useState, useEffect } from "react";
import GetIcon from "./modules/GetIcon";
import styled from 'styled-components';
import { MenuBarValue, UserInfoValue } from "./modules/CommunityDataRouter";
import { AllContents } from "./modules/getCommunityMainData";
import { useNavigate } from "react-router-dom";
import {TopBar, ProfileBox, ProfileImg, ProfileCon, UserName, SubText, TopImg, MainTitle} from "./style/CommunicationStyle";

import "./style.css";

// css
const MenuBar = styled.div`
  display: flex;
  align-items: center;  // 수직 중앙 정렬
  justify-content: space-between;  // 수평 분산
  height: 7%;
  padding: 0 50px;  // 양쪽 패딩 추가
`;

const MenuText = styled.span`
  font-size: 0.8em;
  color: white;
  color: ${(props) => props.active ? 'black' : 'white'};
  text-decoration: ${(props) => props.active ? 'underline' : 'none'};
`;
const CenterBox  = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 79%;
  overflow-y: scroll; /* 부모 요소에 가로 스크롤 활성화 */
  scrollbar-width: none;
`;


export const CommunicationMain = () => {
    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    const [activeMenu, setActiveMenu] = useState(0);
    const [menuItems, setMenuItems] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [selectedBoardID, setSelectedBoardID] = useState(1); // 기본값은 1로 설정
    // 메뉴 바 데이터 DB에서 가져오기
    useEffect(() => {
      const fetchData = async () => {
          try {
              const menuData = await MenuBarValue();
              const userData = await UserInfoValue();

              setMenuItems(menuData);
              setUserInfo(userData);
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      };
      fetchData();
    }, []);
    // 메뉴 클릭 시 해당 메뉴의 게시판 번호를 설정하고 AllContents 호출
    const handleMenuClick = (boardID, index) => {
      setActiveMenu(index);
      setSelectedBoardID(boardID);
    };

    return (
        <div className="CommunicationDiv">
          <TopBar>
            <TopImg><img src={GetIcon("backArrow.png")} onClick={() => goToPage("afterMain")}></img></TopImg>
            <MainTitle>CULISO</MainTitle>
            <TopImg><img src={GetIcon("alarm.png")} style={{ width: "22px" }}></img></TopImg>
          </TopBar>

          <TopBar>
            <ProfileBox>
              <ProfileImg src={userInfo[0]?.profileUrl ? GetIcon(userInfo[0].profileUrl) : GetIcon("userProfile.png")} alt="User Profile" />
              <ProfileCon>
                <UserName>{userInfo[0]?.userName}</UserName>
                <SubText>안녕하세요. 반갑습니다.</SubText>
              </ProfileCon>
            </ProfileBox>
            <TopImg>
              <img src={GetIcon("plus2.png")} alt="Plus Icon" onClick={() => goToPage("contentUpload?prevPage=CommunicationMain")} />
            </TopImg>
          </TopBar>

          <MenuBar>
            {menuItems.map((item, index) => (
              <MenuText
                key={item.boardID}
                active={activeMenu === index}
                onClick={() => handleMenuClick(item.boardID, index)}
              >
                {item.boardName}
              </MenuText>
            ))}
          </MenuBar>
          
          <CenterBox > 
            <AllContents boardID={selectedBoardID}/>
          </CenterBox>
        </div>
    );
};