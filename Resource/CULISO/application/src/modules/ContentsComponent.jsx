import React, { useState, useEffect, useRef } from "react";
import GetIcon from "./GetIcon";
import styled from 'styled-components';
import { TopBar, BoardCenterBox, ProfileBox, ProfileImg, ProfileCon, UserName, SubText, TopImg, MainTitle,
        BoardCommunityContents, ContentsTitle, Contents, Element, RecommendAndContentsNum, LeftContainer,
        RightContainer, CommentTable, TableRow, TableCell, UserInfo, Comment, UserNick, WriteDate, CommentWriteBox,
        TextArea, SubmitButton, DeleteBox, DeleteImg, DeleteTitle, DeleteBtnLeft, DeleteBtnRight, DropdownMenu,
        DropdownItem, ContentsImgBox, ImageContainer, Image
} from "../style/CommunicationStyle";
import { useNavigate, useLocation } from "react-router-dom";
import { BoardContentsValue, CommentInsertValue, CommentSelectValue, CommentDeleteValue, ContentsDeleteValue, RecommendClicked, IncrementViews } from "./CommunityDataRouter";
import Modal from "react-modal";
import { CustomStyles } from "./ModalComponent";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import "../style.css";

Modal.setAppElement('#root'); // 'root'는 React 앱의 루트 요소의 ID입니다.

const ClickableImg  = styled.img`
    filter: ${({ clicked }) => (clicked ? 'invert(50%) sepia(100%) saturate(500%) hue-rotate(150deg)' : 'none')};
`;

const StyledSwiperSlide = styled(SwiperSlide)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

export const ContentsComponent = () => {
    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    const [newContents, setNewContents] = useState([]);
    const [comment, setComment] = useState([]);
    const [relatedFiles, setRelatedFiles] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isOpen, setIsOpen] = useState(false);                    // 삭제 팝업 상태
    const [isContentOpen, setContentIsOpen] = useState(false);      // 게시글 삭제 팝업 상태
    const [deleteComment, setDeleteComment] = useState();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);    // 게시글 수정, 삭제 드롭다운 메뉴
    const [isRecommendClicked, setIsRecommendClicked] = useState(false);    // 좋아요 클릭
    const [like, setLike] = useState();                             // 좋아요 값 초기화
    const [sessionUserID, setSessionUserID] = useState();

    // GET 방식으로 contentsNum 가져오기
    const query = new URLSearchParams(useLocation().search);
    const sendContentsNum = query.get("contentsNum");
    console.log("contentsNum : " + sendContentsNum);

    const openModal = () => {
        setIsOpen(true);
    }
    
    const closeModal = () => {
        setIsOpen(false);
    }

    const contentOpenModal = () => {
        setContentIsOpen(true);
    }
    
    const contentCloseModal = () => {
        setContentIsOpen(false);
    }

    // 각 게시판 게시글 DB에 데이터 보내기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await BoardContentsValue(sendContentsNum);
                setNewContents(data.contentsResult);
                setComment(data.commentResult);
                setRelatedFiles(data.fileResult);
                setSessionUserID(data.sessionUserID.userID);

                console.log("setSessionUserID : " + data.sessionUserID.userID);
                console.log("sessionUserID : " + sessionUserID);
                
                if (data.contentsResult.length > 0) {
                    setLike(data.contentsResult[0].recommend);
                }

                // 해당 게시글에 좋아요 눌렀는지 확인
                if(data.contentsRecommendResult[0].count){
                    setIsRecommendClicked(true);
                } else {
                    setIsRecommendClicked(false);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [sendContentsNum]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    // 댓글 작성하기
    const handleCommentSubmit = async () => {
        try {
            if(newComment !== "") {
                await CommentInsertValue(newComment, sendContentsNum);
                setNewComment(""); // 입력 필드를 초기화

                const data = await CommentSelectValue(sendContentsNum);
                setComment(data || []);
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    // 댓글 삭제하기
    const handleCommentDelete = async () => {
        try {
            await CommentDeleteValue(deleteComment);

            const data = await CommentSelectValue(sendContentsNum);
            setComment(data || []);

            closeModal();
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    // 게시글 삭제하기
    const handleDeletePost = async () => {
        try {
            await ContentsDeleteValue(sendContentsNum);

            goToPage("CommunicationMain");
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };
    // 드롭다운 메뉴 있을 때 화면 터치 이벤트
    const screenTouch = () => {
        if(isDropdownOpen === true) {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };  

    
    // 추천 이벤트
    const handleRecommendClick = async () => {
        // 새로운 추천 상태 값을 결정합니다.
        const newRecommendClicked = !isRecommendClicked;
        
        // 추천 상태를 업데이트합니다.
        setIsRecommendClicked(newRecommendClicked);
    
        try {
            // 서버로 보낼 체크 값을 설정합니다.
            const check = newRecommendClicked ? 1 : 0;
    
            // 서버에 추천 상태를 업데이트하도록 요청합니다.
            const recommendData = await RecommendClicked(check, sendContentsNum);
    
            setLike(recommendData.recommend);
        } catch (error) {
            // 에러 발생 시 로그에 출력합니다.
            console.error("Error updating recommendation:", error);
        }
    };

    return (
        <div className="CommunicationDiv" onClick={() => screenTouch()}>
            <TopBar>
                <LeftContainer>
                    <TopImg><img src={GetIcon("backArrow.png")} onClick={()=> goToPage("CommunicationMain")}></img></TopImg>
                    <MainTitle style={{ marginLeft: "15px" }}>{newContents[0]?.boardName}</MainTitle>
                </LeftContainer>
                <RightContainer>
                    <TopImg style={{ marginRight: "15px" }}><img src={GetIcon("alarm.png")} style={{ width: "22px" }}></img></TopImg>
                    {newContents.map((content, index) => (
                        <div key={index}>
                            {content.userID === sessionUserID && (
                                <TopImg onClick={toggleDropdown}>
                                    <img src={GetIcon("dropdown.png")} alt="Dropdown Icon" />
                                </TopImg>
                            )}
                        </div>
                    ))}

                    {isDropdownOpen && (
                        <DropdownMenu>
                            <DropdownItem onClick={() => goToPage(`contentUpload?contentsNum=${sendContentsNum}&prevPage=ContentsComponent`)}>게시글 수정하기</DropdownItem>
                            <DropdownItem onClick={() => contentOpenModal() }>게시글 삭제하기</DropdownItem>
                        </DropdownMenu>
                    )}
                </RightContainer>
            </TopBar>

            <TopBar>
                <ProfileBox>
                    <ProfileImg src={newContents[0]?.profileUrl ? GetIcon(newContents[0].profileUrl) : GetIcon("userProfile.png")} alt="User Profile" />
                    <ProfileCon>
                        <UserName>{newContents[0]?.userName}</UserName>
                        <SubText>{newContents[0] ? new Date(newContents[0].contentsDate).toLocaleString() : ''}</SubText>
                    </ProfileCon>
                </ProfileBox>
            </TopBar>

            <BoardCenterBox > 
                {newContents.map((content, index) => (
                    <BoardCommunityContents key={index}>
                        <ContentsTitle>{content.contentsTitle}</ContentsTitle>
                        <Contents>
                            {content.content}
                            {relatedFiles.length > 0 && (
                                <ContentsImgBox>
                                    <Swiper
                                        spaceBetween={50}
                                        slidesPerView={1}
                                        onSlideChange={() => console.log('slide change')}
                                        onSwiper={(swiper) => console.log(swiper)}
                                    >
                                        {relatedFiles.map((file, fileIndex) => (
                                            <StyledSwiperSlide key={fileIndex}>
                                                <Image 
                                                    src={`https://culiso.duckdns.org/${file.fileUrl}${file.fileName}`} 
                                                    alt={`${file.fileName}`}
                                                />
                                            </StyledSwiperSlide>
                                        ))}
                                    </Swiper>
                                </ContentsImgBox>
                            )}
                        </Contents> 
                        <Element>
                            <RecommendAndContentsNum>
                                <ClickableImg
                                    src={GetIcon("recommend.png")}
                                    alt="Recommend Icon"
                                    clicked={isRecommendClicked}
                                    onClick={handleRecommendClick}
                                />
                            </RecommendAndContentsNum>
                            <RecommendAndContentsNum>{like}</RecommendAndContentsNum>
                            <RecommendAndContentsNum>
                                <img src={GetIcon("comments.png")} alt="Views Icon" />
                            </RecommendAndContentsNum>
                            <RecommendAndContentsNum>{comment.length}</RecommendAndContentsNum>
                        </Element>
                    </BoardCommunityContents>
                ))}

                {comment.length > 0 ? (
                    <BoardCommunityContents>
                        <ContentsTitle>댓글</ContentsTitle>
                        <Element>
                            <CommentTable className="commentTb">
                                {comment.map((comment, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <img src={comment.profileUrl || GetIcon("profile-black.png")} alt="Profile Icon" style={{ width: "25px" }} />
                                        </TableCell>
                                        <TableCell>
                                            <UserInfo>
                                                <UserNick>{comment.userName}</UserNick>
                                                <WriteDate>{new Date(comment.commentDate).toLocaleString()}</WriteDate>
                                            </UserInfo>
                                            <Comment>{comment.commentContent}</Comment>
                                        </TableCell>
                                        {comment.userID === sessionUserID && (
                                            <TableCell>
                                                <img 
                                                    src={GetIcon("closed4.png")} 
                                                    alt="Closed Icon" 
                                                    style={{ width: "13px" }} 
                                                    onClick={() => { openModal(); setDeleteComment(comment.commentNum) }}
                                                />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </CommentTable>
                        </Element>
                    </BoardCommunityContents>
                ) : (
                    <BoardCommunityContents>
                        <ContentsTitle>댓글</ContentsTitle>
                        <Element>
                            <p>댓글이 없습니다.</p>
                        </Element>
                    </BoardCommunityContents>
                )}
            </BoardCenterBox>

            <CommentWriteBox>
                <TextArea
                    placeholder="댓글을 입력하세요"
                    value={newComment}
                    onChange={handleCommentChange}
                />
                <SubmitButton>
                    <img src={GetIcon("send.png")} 
                        alt="send Icon" 
                        style={{ width: "20px" }}
                        onClick={()=> handleCommentSubmit()}
                    />
                </SubmitButton>
            </CommentWriteBox>

            <Modal isOpen={isOpen} onRequestClose={closeModal} style={CustomStyles}>
                <DeleteBox>
                    <DeleteImg><img src={GetIcon("mark.png")}></img></DeleteImg>
                    <DeleteTitle>댓글을 삭제하시겠습니까?</DeleteTitle>
                </DeleteBox>
                <DeleteBox>
                    <DeleteBtnLeft onClick={()=> handleCommentDelete()}>확인</DeleteBtnLeft>
                    <DeleteBtnRight onClick={()=> closeModal()}>취소</DeleteBtnRight>
                </DeleteBox>
            </Modal>

            <Modal isOpen={isContentOpen} onRequestClose={contentCloseModal} style={CustomStyles}>
                <DeleteBox>
                    <DeleteImg><img src={GetIcon("mark.png")}></img></DeleteImg>
                    <DeleteTitle>게시글을 삭제하시겠습니까?</DeleteTitle>
                </DeleteBox>
                <DeleteBox>
                    <DeleteBtnLeft onClick={()=> handleDeletePost()}>확인</DeleteBtnLeft>
                    <DeleteBtnRight onClick={()=> contentCloseModal()}>취소</DeleteBtnRight>
                </DeleteBox>
            </Modal>
        </div>
    );
};