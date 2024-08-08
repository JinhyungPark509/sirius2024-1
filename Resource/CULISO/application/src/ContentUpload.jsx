import React, { useState, useEffect, useRef } from 'react';
import GetIcon from "./modules/GetIcon";
import { Navigate } from "./modules/Navigate";
import styled from 'styled-components';
import { useNavigate, useLocation } from "react-router-dom";
import { PrevPageValue, CheckBoard, ContentsControl } from "./modules/CommunityDataRouter";
import Modal from "react-modal"
import { CustomStyles } from './modules/ModalComponent';
import { DeleteBox, DeleteImg, DeleteTitle, DeleteBtnLeft, DeleteBtnRight, ImgCloseBtn } from "./style/CommunicationStyle";
import "./style.css";

Modal.setAppElement('#root'); // 'root'는 React 앱의 루트 요소의 ID입니다.

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding:  20px;
  
`;

const TopImg = styled.div`
  width: 22px;
`;

const TopBtn = styled.button`
  width: 60px;
  height: 30px;
  border-radius: 20px;
  background : #5570CD;
  border: none;
  color: white;
`;

const MainTitle = styled.div`
  font-weight: bold;
  margin-left: 20px;
`;

const CenterBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0px 20px 20px 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto; /* 세로 스크롤 가능하도록 설정 */
`;

const OptionBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 60%;
  margin-right: 140px;
  margin-top: 20px;
`;

const Input = styled.input`
  border: none;
  font-size: 18px;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-bottom: 1px solid #ccc;
`;

const BG = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  width: 100%;
  height: 100vh;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  resize: none;
  height: 300px;
`;

const PhotoButton = styled.button`
  background: none;
  border-radius: 20px;
  padding: 20px;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  margin-right: 10px; /* ContentsImgBox와 간격을 두기 위해 추가 */
`;

const ContentsImgBox = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
`;

const ImageContainer = styled.div`
  display: inline-block;
  margin-right: 10px;
  position: relative;
`;

const PhotoUploadBox = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
  max-width: 100%; /* 부모 요소의 최대 너비 설정 */
  background: #f8f8f8;
  padding: 10px;
  border-radius: 10px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%; /* 전체 너비를 차지하도록 설정 */
`;


export const ContentUpload = () => {
  const navigate = useNavigate();

  function goToPage(name) {
      let url = "/" + name;
      navigate(url);
  }

  const [contentData, setContentData] = useState([]);
  const [boardData, setBoardData] = useState([]);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);                                        // 팝업 상태
  const [checkItemsIsOpen, setCheckItemsIsOpen] = useState(false);                    // 입력 요소 팝업 상태
  const fileInputRef = useRef(null);
  const [defaultTitle, setDefaultTitle] = useState(contentData[0]?.contentsTitle || '');            // 수정 제목 입력 디폴트 값
  const [defaultContents, setDefaultContents] = useState(contentData[0]?.content || '');            // 수정 내용 입력 디폴트 값
  const [changeTitle, setChangeTitle] = useState(false);                              // 수정 제목 변경 시
  const [changeContents, setChangeContents] = useState(false);                        // 수정 내용 변경 시
  const [sendContents, setSendContents] = useState({
    boardID: '',
    title: '',
    contents: ''
  });

  const query = new URLSearchParams(useLocation().search);
  const sendContentsNum = query.get("contentsNum");
  const prevPage = query.get("prevPage");

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
      setIsOpen(false);
  }

  const checkItemsOpenModal = () => {
    setCheckItemsIsOpen(true);
  }

  const checkItemsCloseModal = () => {
      setCheckItemsIsOpen(false);
  }

  // 각 게시판 게시글 DB에 데이터 보내기
  useEffect(() => {
    const fetchData = async () => {
        try {
            if(prevPage === "ContentsComponent") {
              console.log("sedContentsNum : " + sendContentsNum);

              const data = await PrevPageValue(sendContentsNum);
              // 받아온 데이터를 상태로 설정
              setContentData(data.contentsResult);
              // 서버에서 받은 파일 경로를 포함한 객체로 설정
              const files = data.fileResult.map(file => ({fileUrl: `https://culiso.duckdns.org/${file.fileUrl}${file.fileName}`}));
              setRelatedFiles(files);

              // 수정 전 입력 요소들 저장
              setDefaultTitle(data.contentsResult[0]?.contentsTitle);
              setDefaultContents(data.contentsResult[0]?.content);

              // 여기서 console.log로 값을 찍어봅니다.
              console.log("Related files:", files);
            }
            else {
              const data = await CheckBoard();
              setBoardData(data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    fetchData();
  }, [prevPage]);
  
  // 게시글 수정 및 삽입
  const handleTopBtnClick = async () => {
    if (prevPage === "ContentsComponent") {
      console.log("완료 버튼 클릭 - 업데이트 함수");
      try {
        const formData = new FormData();

        if(changeTitle === true && changeContents === false) {
          formData.append('title', sendContents.title);
          formData.append('contents', defaultContents);
        }
        else if(changeTitle === false && changeContents === true) {
          formData.append('title', defaultTitle);
          formData.append('contents', sendContents.contents);
        }
        else if(changeTitle === false && changeContents === false) {
          formData.append('title', defaultTitle);
          formData.append('contents', defaultContents);
        }
        else {
          formData.append('title', sendContents.title);
          formData.append('contents', sendContents.contents);
        }

        formData.append('contentsNum', sendContentsNum);

        relatedFiles.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`images`, file);
          } else {
            formData.append(`imgUrl`, file.fileUrl);
          }
        });

        // deleteFiles 배열에서 중복 제거 및 파일 이름 부분만 추출
      const uniqueDeleteFiles = Array.from(new Set(deleteFiles.map(file => file.fileUrl.split('/').pop())));
        // deleteFiles 배열 로그 출력
        console.log("deleteFiles: ", uniqueDeleteFiles);

        uniqueDeleteFiles.forEach((file, index) => {
          formData.append(`delImgName`, file);
        });

        const path = "ContentsUpdate";
        await ContentsControl(path, formData);

        goToPage("CommunicationMain");
      } catch (error) {
          console.error("Error submitting comment:", error);
      }
    } 
    else if (prevPage === "CommunicationMain") {
      console.log("완료 버튼 클릭 - 삽입 함수");
      const formData = new FormData();
      formData.append('title', sendContents.title);
      formData.append('contents', sendContents.contents);
      formData.append('boardID', sendContents.boardID);

      relatedFiles.forEach(file => {
        formData.append('images', file);
      });

      try {
        const path = "ContentsInsert";
        await ContentsControl(path, formData);

        goToPage("CommunicationMain");
      } catch (error) {
          console.error("Error submitting comment:", error);
      }
    }
  };

  // 버튼 클릭시 파일 선택할 수 있는 기능
  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  // 파일 업로드를 위한 파일 저장
  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;

    setRelatedFiles(prevFiles => {
      // 기존의 파일과 새로운 파일을 합친 새로운 배열 생성
      const newFiles = [...prevFiles];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        // 여기에서 파일을 처리하고 필요한 형식으로 변환하는 작업을 수행할 수 있습니다.
        // 이 예제에서는 파일 객체를 그대로 사용하겠습니다.
        newFiles.push(file);
      }
      return newFiles;
    });
  };

  // 제목, 내용 입력시 값 저장
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSendContents(prevState => ({
      ...prevState,
      [name]: value
    }));

    // 제목, 내용 입력했는지 파악
    if (name === 'title') {
      setChangeTitle(true);
    } else if (name === 'contents') {
      setChangeContents(true);
    }
  };

  // 글 생성 게시판 선택
  const handleCheckboxChange = (event, boardID) => {
    if (event.target.checked) {
      setSendContents(prevState => ({
        ...prevState,
        boardID: boardID
      }));
    }
  };

  // 글 생성, 수정 전 입력 요소 확인
  const checkItems = () => {
    if(prevPage === "CommunicationMain") {
      if (sendContents.title && sendContents.contents && sendContents.boardID) {
        openModal();      // 아이템이 다 체크되었을 때
      } else {
        checkItemsOpenModal()     // 아이템이 다 체크 안되었을 때
      }
    }
    else {
      openModal();
    }
  }

  // 업로드 할 사진 제거
  const handleRemoveFile = (fileIndex) => {
    setRelatedFiles(prevFiles => {
        // 제거할 파일을 deleteFiles에 저장
        const fileToDelete = prevFiles[fileIndex];

        // 파일 경로인지 확인 (파일 자체가 아닌 경우에만 추가)
        if (typeof fileToDelete === 'string' || fileToDelete.fileUrl) {
            setDeleteFiles(prevDeleteFiles => [...prevDeleteFiles, fileToDelete]);
        }

        // relatedFiles에서 파일 제거
        return prevFiles.filter((_, index) => index !== fileIndex);
    });
  };


  return (
    <div className="CommunicationDiv">
      <TopBar>
        <TopImg onClick={() => Navigate("CommunicationMain")}><img src={GetIcon("closed3.png")} alt="back" /></TopImg>
        {prevPage === "CommunicationMain" && (
          <MainTitle>글쓰기</MainTitle>
        )}
        {prevPage === "ContentsComponent" && (
          <MainTitle>글수정</MainTitle>
        )}
        <TopBtn onClick={()=> checkItems()}>완료</TopBtn>
      </TopBar>

      <BG>
        <CenterBox>
          {prevPage === "CommunicationMain" && (
            <OptionBox>
              {boardData.map((board, index) => (
                <label key={index}>
                  <input 
                    type="checkbox" 
                    onChange={(e) => handleCheckboxChange(e, board.boardID)}
                    checked={sendContents.boardID === board.boardID}
                  />
                  {board.boardName}
                </label>
              ))}
            </OptionBox>
          )}

          {/* 게시글 수정 */}
          {prevPage === "ContentsComponent" && (
            <>
              <Input
                className='contentsTitle'
                type="text"
                name="title"
                placeholder="제목"
                onChange={handleInputChange}
                defaultValue={contentData[0]?.contentsTitle}
              />
              <TextArea
                className='contents'
                name="contents"
                placeholder="내용을 입력하세요."
                onChange={handleInputChange}
                defaultValue={contentData[0]?.content}
              />

              <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />

              <PhotoUploadBox>
                <PhotoButton onClick={()=> handleImageButtonClick()}>
                  <img src={GetIcon("camera.png")} alt="back" />
                </PhotoButton>

                {relatedFiles.length > 0 && (
                  <ContentsImgBox>
                    {relatedFiles.map((file, fileIndex) => (
                      <ImageContainer key={fileIndex}>
                        <img
                          src={file instanceof File ? URL.createObjectURL(file) : file.fileUrl}
                          alt={file instanceof File ? file.name : file.fileName}
                          style={{ width: "50px", height: "50px"}}
                        />
                        <ImgCloseBtn onClick={() => handleRemoveFile(fileIndex)}>&times;</ImgCloseBtn>
                      </ImageContainer>
                    ))}
                  </ContentsImgBox>
                )}
                </PhotoUploadBox>
            </>
          )}

          {/* 게시글 삽입 */}
          {prevPage === "CommunicationMain" && (
            <>
              <Input
                className='contentsTitle'
                type="text"
                name="title"
                placeholder="제목"
                onChange={handleInputChange}
                value={sendContents.title}
              />
              <TextArea
                className='contents'
                name="contents"
                placeholder="내용을 입력하세요."
                onChange={handleInputChange}
                value={sendContents.contents}
              />

              <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />

              <PhotoUploadBox>
                <PhotoButton onClick={()=> handleImageButtonClick()}>
                  <img src={GetIcon("camera.png")} alt="back" />
                </PhotoButton>

                {relatedFiles.length > 0 && (
                  <ContentsImgBox>
                    {relatedFiles.map((file, fileIndex) => (
                      <ImageContainer key={fileIndex}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.fileName}
                          style={{ width: "50px", height: "50px"}}
                        />
                        <ImgCloseBtn onClick={() => handleRemoveFile(fileIndex)}>&times;</ImgCloseBtn>
                      </ImageContainer>
                    ))}
                  </ContentsImgBox>
                )}
              </PhotoUploadBox>
            </>
          )}
        </CenterBox>
      </BG>

      <Modal isOpen={isOpen} onRequestClose={closeModal} style={CustomStyles}>
        <DeleteBox>
            <DeleteImg><img src={GetIcon("mark.png")}></img></DeleteImg>
            {prevPage === "CommunicationMain" && (
              <DeleteTitle>게시글을 생성하시겠습니까?</DeleteTitle>
            )}
            {prevPage === "ContentsComponent" && (
              <DeleteTitle>게시글을 수정하시겠습니까?</DeleteTitle>
            )}
        </DeleteBox>
        <DeleteBox>
            <DeleteBtnLeft onClick={()=> handleTopBtnClick()}>확인</DeleteBtnLeft>
            <DeleteBtnRight onClick={()=> closeModal()}>취소</DeleteBtnRight>
        </DeleteBox>
      </Modal>

      <Modal isOpen={checkItemsIsOpen} onRequestClose={checkItemsCloseModal} style={CustomStyles}>
        <DeleteBox>
            <DeleteImg><img src={GetIcon("mark.png")}></img></DeleteImg>
            <DeleteTitle>작성하지 않은 내용이 있습니다.</DeleteTitle>
        </DeleteBox>
        <DeleteBox>
            <DeleteBtnLeft onClick={()=> checkItemsCloseModal()}>확인</DeleteBtnLeft>
        </DeleteBox>
      </Modal>
    </div>
  );
};

