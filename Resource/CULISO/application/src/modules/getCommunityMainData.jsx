import React, { useState, useEffect } from "react";
import GetIcon from "./GetIcon";
import styled from 'styled-components';
import { ContentsValue, BoardContentsValue, IncrementViews } from "./CommunityDataRouter";
import { useNavigate } from "react-router-dom";
import { ContentsComponent } from "./ContentsComponent";

const CommunityContentsBox = styled.div`
  margin: 10px 20px 20px 20px;
  width: calc(100% - 40px); // 전체 너비에서 좌우 마진 20px을 뺀 값
`;
const CommunityContents = styled.div`
  display: flex;
  width: 100%; // 전체 너비에서 좌우 마진 20px을 뺀 값
  height: 150px;
  border-radius: 15px;
  background-color: white;
  margin: 10px 0; // 왼쪽과 오른쪽에 각각 10px의 마진 추가
  box-sizing: border-box; // 패딩을 포함한 너비와 높이를 계산
`;

const ContentsTitle = styled.div`
  width: 100%;
  height: 20%;  // 150px의 20%
  padding: 8px 10px 0px 10px;  // 양쪽 패딩 추가
  font-size: 0.8em;
  font-weight: bold;
  box-sizing: border-box;  // 패딩을 포함한 너비와 높이를 계산
`;

const Contents = styled.div`
  width: 100%;
  height: 60%;  // 150px의 60%
  padding: 10px 10px 10px 10px;  // 양쪽 패딩 추가
  font-size: 0.5em;
  white-space: normal;
  word-wrap: break-word;
  box-sizing: border-box;  // 패딩을 포함한 너비와 높이를 계산
  word-wrap: break-word;
  overflow: hidden;
`;

const Element = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20%;  // 150px의 20%
  padding: 0px 10px 8px 10px;  // 양쪽 패딩 추가
  font-size: 0.9em;
  box-sizing: border-box;  // 패딩을 포함한 너비와 높이를 계산
`;

const RecommendAndContentsNum = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  img {
    display: inline-block;
    width: 22px;
    height: 22px;
  }
`;
const MenuTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8em;
` 
const TitleLeft = styled.div`
  display: flex;
  align-items: center;
  font-size: inherit;  
`;

const CommunityContentsLeft = styled.div`
  flex: 3; // 더 넓게 설정
  display: flex;
  flex-direction: column;
  justify-content: space-between; // 내용물이 상하로 고르게 배치되도록 설정
  box-sizing: border-box;
  width: 60%;
`;
const CommunityContentsRight = styled.div`
  flex: 1; // 더 좁게 설정
  display: flex;
  justify-content: center; // 중앙 정렬
  align-items: center; // 중앙 정렬
  padding: 10px;
  box-sizing: border-box;
  border-radius: 15px;
  width: 40%;
`;

// const TitleRight = styled.span`
//   font-size: 0.5em; 
//   margin-right: 10px;
// `;

export const AllContents = ({ boardID }) => {
    const [contents, setContents] = useState([]);
    
    console.log("boardID : " + boardID);
    // 각 게시판 인기 게시글 데이터 DB에서 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ContentsValue(boardID);
                setContents(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [boardID]);

    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    // 각 게시글 선택시 조회수 올리기
    const viewsCount = async (sendContentsNum) => {
      try {
        // 조회수 증가 플래그가 false일 때만 조회수 증가
        await IncrementViews(sendContentsNum);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
    }

    const truncateText = (text, maxLength) => {
      if (!text) {
        return '';
      }
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    };

    return(
        <div className="communityBoard" style={{ width: "100%" }}>
            {contents.map((board, index) => (
                <CommunityContentsBox key={index}>
                    {boardID === 1 && (
                        <MenuTitle>
                            <TitleLeft>
                                <span style={{ marginLeft: "10px" }}>
                                    <img src={GetIcon("star.png")} alt="Star Icon" />
                                </span>
                                <span style={{ marginLeft: "5px" }}>{board.boardName}</span>
                            </TitleLeft>
                        </MenuTitle>
                    )}
                    <CommunityContents onClick={()=> {goToPage(`contentsComponent?contentsNum=${board.contentsNum}`); viewsCount(board.contentsNum)}}>
                      <CommunityContentsLeft style={{ width: board.fileUrl && board.fileName ? '60%' : '100%' }}>
                        <ContentsTitle>{board.contentsTitle}</ContentsTitle>
                        <Contents>{truncateText(board.content, 120)}</Contents> 
                        <Element>
                            <RecommendAndContentsNum><img src={GetIcon("recommend.png")} alt="Recommend Icon" /></RecommendAndContentsNum>
                            <RecommendAndContentsNum>{board.recommend}</RecommendAndContentsNum>
                            <RecommendAndContentsNum><img src={GetIcon("views2.png")} alt="Comments Icon" /></RecommendAndContentsNum>
                            <RecommendAndContentsNum>{board.views}</RecommendAndContentsNum>
                        </Element>
                      </CommunityContentsLeft>
                      {board.fileUrl && board.fileName && (
                        <CommunityContentsRight>
                          <img
                            src={`https://culiso.duckdns.org/${board.fileUrl}${board.fileName}`} 
                            alt={`${board.fileName}`}
                            style={{ width: '90px', height: '90px' }}
                          />
                        </CommunityContentsRight>
                      )}
                    </CommunityContents>
                </CommunityContentsBox>
            ))}
        </div>
    );
};