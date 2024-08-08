import React, { useState, useEffect } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"
import { CustomStyles } from "./modules/ModalComponent";
import { GetIcon } from "./modules/GetIcon";
import { ViewDetails, DeleteData, InsertData, UpdateData } from "./modules/sendData";        // DB 데이터 전송
import { InitTableData } from "./modules/InitTableData";     // 메인 화면들 초기 데이터
import { useCheckboxFunctions } from "./modules/checkBox";          // 체크 박스 선택 모듈

// 모달이 열릴 때 사용할 DOM 요소를 지정합니다.
Modal.setAppElement('#root');

export const BoardMgr = () => {
    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    const [inItPath, setInItPath] = useState('');                                   // 메인 화면 초기 데이터 DB path
    const [isOpen, setIsOpen] = useState(false);                                    // 상세보기 팝업 상태
    const [isOpenBoardCreate, setIsOpenBoardCreate] = useState(false);              // 게시판 생성 팝업 상태
    const [selectedMenu, setSelectedMenu] = useState("boardMgr");                   // 기본값은 "게시판 수정"
    const [tableData, setTableData] = useState([]);                                 // 게시판 관리 메인 테이블 데이터 상태
    const [boardContentListTable, setBoardContentListTable] = useState([]);         // 상세보기 안 게시글 목록 테이블
    const [modalSendData, setModalSendData] = useState(null);                       // 모달 팝업창 선택 시 해당 버튼 레코드에 해당하는 id 값
    const [detailPath, setDetailPath] = useState('');                               // 모달 팝업창 각 버튼에 해당하는 DB path

    // 메인 화면 초기 데이터 생성
    useEffect(() => {
        const fetchData = async () => {
            try {
                const path = "boardMgrInitData";
                const data = await InitTableData(path);
                setTableData(data);
                setInItPath(path);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // 상세보기 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (modalSendData && detailPath) {
                    ViewDetails(modalSendData, detailPath)
                        .then(data => {
                            setBoardContentListTable(data || []);
                        })
                        .catch(error => {
                            console.error("Error:", error);
                        });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [modalSendData, detailPath]);


    // 입력된 검색어 상태
    const [searchTerm, setSearchTerm] = useState('');

    // 검색어 입력 시 상태 업데이트
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 버튼 클릭 시 필터링된 데이터 보여주기
    const handleSearch = async () => {
        if (!searchTerm) {
            // 검색어가 비어있으면 초기 데이터를 가져오기
            const data = await InitTableData(inItPath);
            setTableData(data);
            return;
        }

        const filteredData = tableData.filter(item =>
            item.boardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.boardDate.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setTableData(filteredData);
    };

    const openModal = () => {
        setIsOpen(true);
    }
    
    const closeModal = () => {
        setIsOpen(false);
    }

    // 메뉴를 변경하는 함수
    const handleMenuChange = (menu) => {
        setSelectedMenu(menu);
    }

    const openBoardCreate = () => {
        setIsOpenBoardCreate(true);
    }

    const closeBoardCreate = () => {
        setIsOpenBoardCreate(false);
    }

    // 모달 팝업 창 버튼 클릭시 해당 데이터 DB에서 받아오기 
    function handleViewDetailsClick (event) {
        // 클릭된 버튼의 id를 가져옵니다.
        const button = event.target.closest('button');
        const buttonId = button.id;
        console.log("Clicked button id:", buttonId);
    
        // 클릭된 버튼의 부모 요소인 <td> 태그를 찾습니다.
        const tdElement = event.target.closest('td');
        if (tdElement) {
            // tdElement의 부모인 tr 요소에서 'modalSendData' 클래스를 가진 td 태그를 선택합니다.
            const idElement = tdElement.parentNode.querySelector('td.modalSendData');
            if (idElement) {
                // 선택된 td 태그의 텍스트 콘텐츠를 가져옵니다.
                const modalSendDataValue = idElement.textContent.trim();
                
                let pathValue = "";
                // 가져온 아이디 값을 서버로 전송합니다.
                console.log("BoardMgrViewDetails");
                pathValue = "boardMgrViewDetails";
                ViewDetails(modalSendDataValue, pathValue);

                // 상태 업데이트를 통해 useEffect가 실행되도록 설정
                setModalSendData(modalSendDataValue);
                setDetailPath(pathValue);
                
            } else {
                console.error('아이디를 찾을 수 없습니다.');
            }
        } else {
            console.error('버튼의 부모 요소를 찾을 수 없습니다.');
        }
    }

    // 삭제 할 데이터 DB에 보내기
    async function handleDeleteDataClick (event) {
        // 클릭된 버튼의 id를 가져옵니다.
        const button = event.target.closest('button');
        const buttonId = button.id;
        let tableSendData;
        let checkID = "";
        let checkedItems;

        console.log("buttonID = " + buttonId);

        if (buttonId === "BoardMgrDelete") {
            tableSendData = tableData;
            checkID = "boardID";
            checkedItems = boardCheckedItems;
        } else {
            tableSendData = boardContentListTable;
            checkID = "contentsNum";
            checkedItems = boardContentCheckedItems;
        }

        // 확인 메시지 표시
        const isConfirmed = window.confirm('삭제하시겠습니까?');

        // 사용자가 확인을 선택한 경우에만 삭제 이벤트 발생
        if (isConfirmed) {
            // 체크된 모든 항목의 ID를 가져옵니다.
            const checkedIds = tableSendData
            .map((item, index) => checkedItems[index] ? item[checkID] : null)
            .filter(id => id !== null);

            if (checkedIds.length > 0) {
                // ID 리스트를 DeleteData 함수로 보냅니다.
                try {
                    await DeleteData(checkedIds, buttonId);
                    // 삭제 완료 후 테이블 데이터 업데이트
                    if (buttonId === "BoardMgrDelete") {
                        const newData = await InitTableData(inItPath);
                        setTableData(newData);
                    } else {
                        // contentListTable에 대한 업데이트 로직 추가
                        if (modalSendData && detailPath) {
                            const data = await ViewDetails(modalSendData, detailPath);
                            setBoardContentListTable(data || []);
                        }
                    }
                } catch (error) {
                    console.warn('삭제 도중 오류가 발생했습니다:', error);
                }
            } else {
                console.warn('삭제할 항목이 선택되지 않았습니다.');
            }
        }
    }

    // 생성 및 업데이트 할 데이터 DB에 보내기
    async function handleInsertOrUpdateDataClick(event) {
        // 클릭된 버튼의 id를 가져옵니다.
        const button = event.target.closest('button');
        const buttonId = button.id;
        const formData = [
            document.getElementById("boardMgrTitle").value,
            document.getElementById("boardMgrComment").value,
            document.querySelector(".readPermission").value,
            document.querySelector(".writePermission").value,
            document.querySelector(".commentsWritePermission").value
        ];
        
        // 수정 버튼인 경우
        if (buttonId === "boardMgrUpdateBtn") {
            const isConfirmed = window.confirm('수정하시겠습니까?');
            if (isConfirmed) {
                try {
                    await UpdateData(modalSendData, formData);
                    // 수정 완료 후 페이지 새로고침
                    window.location.reload();
                } catch (error) {
                    console.error('수정 도중 오류가 발생했습니다:', error);
                    // 오류 처리
                    alert('수정 도중 오류가 발생했습니다.');
                }
            }
        }
        // 생성 버튼인 경우
        else {
            const isConfirmed = window.confirm('생성하시겠습니까?');
            if (isConfirmed) {
                try {
                    await InsertData(formData, buttonId);
                    // 생성 완료 후 페이지 새로고침
                    window.location.reload();
                } catch (error) {
                    console.error('생성 도중 오류가 발생했습니다:', error);
                    // 오류 처리
                    alert('생성 도중 오류가 발생했습니다.');
                }
            }
        }
    }

    // table에 따라 체크박스 선택 독립적으로 나누기
    const {
        selectAll: boardSelectAll,
        checkedItems: boardCheckedItems,
        handleSelectAll: handleBoardSelectAll,
        handleCheckboxChange: handleBoardCheckboxChange
    } = useCheckboxFunctions(tableData);
    const {
        selectAll: boardContentSelectAll,
        checkedItems: boardContentCheckedItems,
        handleSelectAll: handleBoardContentSelectAll,
        handleCheckboxChange: handleBoardContentCheckboxChange
    } = useCheckboxFunctions(boardContentListTable);

    return (
        <div className="AdminMain">
            <div className="main-overlap-wrapper">
                <div className="main-overlap">
                    <div className="adminMgrList">
                        <ul>
                            <li>
                                <img className="mgrImg" alt="Help call" src={GetIcon("profile-gray.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("")}>회원 관리</span></div>
                            </li>
                            <li>
                                <img className="mgrImg" alt="Iot" src={GetIcon("text.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("boardMgr")}>게시판 관리</span></div>
                                <img className="selectArrow" alt="Polygon" src={GetIcon("Polygon1.png")} />
                            </li>
                            <li>
                                <img className="mgrImg" alt="Text" src={GetIcon("iot.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("deviceMgr")}>기기 관리</span></div>
                            </li>
                            <li>    
                                <img className="mgrImg" alt="User" src={GetIcon("help-call.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("requestMgr")}>요청 관리</span></div>
                            </li>
                        </ul>
                    </div>

                    <div className="topDiv" />
                    <div className="topDivText">admin Msg</div>
                    
                    <div className="contents" />
                    
                    <div className="selectMenuTitle">게시판 관리</div>
                    
                    <div className="searchInput">
                        <img className="searchInputImage" alt="Image" src={GetIcon("speech-bubble.png")} />
                        <input
                            className="searchText"
                            type="text"
                            placeholder="게시판명"
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className="searchBtn" onClick={handleSearch}>검색</button>

                    <div className="serchResult">검색결과 : 총 <span className="userNum">{tableData.length}개</span></div>
                    
                    <div className="userListBox" >
                        <table className="userListTable">
                            <thead>
                                <tr>
                                <th className="checkBox"><input type="checkbox" checked={boardSelectAll} onChange={handleBoardSelectAll} /></th>
                                <th>번호</th>
                                <th>게시판 이름</th>
                                <th>게시글 수</th>
                                <th>게시판 생성일</th>
                                <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((board, index) => (
                                    <tr key={index}>
                                        <td className="checkBox">
                                            <input 
                                                type="checkbox"
                                                checked={boardCheckedItems[index]}
                                                onChange={() => handleBoardCheckboxChange(index)}/>
                                        </td>
                                        <td>{index + 1}</td>
                                        <td className="modalSendData" style={{ display: 'none' }}>{board.boardID}</td>
                                        <td>{board.boardName}</td>
                                        <td>{board.contentTotal}</td>
                                        <td>{new Date(board.boardDate).toLocaleDateString()}</td>
                                        <td className="userListMgr">
                                            <button className="viewDetailsBtn" id="boardMgrDetail" onClick={(event) => { openModal(); handleViewDetailsClick(event); }}>
                                                <img className="viewDetailsImage" alt="Image" src={GetIcon("profile-gray.png")} />
                                                <span className="viewDetails">상세보기</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 삭제 버튼 */}
                    <div className="deleteButtonDiv">
                        <button className="boardDeleteButton" id="BoardMgrDelete" onClick={(event) => handleDeleteDataClick(event) } >삭제</button>
                        <button className="boardCreateButton" onClick={openBoardCreate}>게시판 생성</button>
                    </div>

                    {/* 페이징 버튼 */}

                </div>
            </div>

            {/* 수정 모달팝업 창 */}
            <Modal isOpen={isOpen} onRequestClose={closeModal} style={CustomStyles}>
                <div className="modalTop">
                    <span className="modalTopTxt">admin Msg</span>
                </div>

                {/* 메뉴바 */}
                <div className="modalMenu">
                    <span className={selectedMenu === "boardMgr" ? "boardMgr active" : "boardMgr"} onClick={() => handleMenuChange("boardMgr")}>게시판 수정</span>
                    <span className={selectedMenu === "postMgr" ? "postMgr active" : "postMgr"} onClick={() => handleMenuChange("postMgr")}>게시글 관리</span>
                    <span onClick={closeModal}><img className="closeBtn" alt="Image" src={GetIcon("close.png")} /></span>
                </div>

                {/* 게시글 목록 내용 */}
                <section className="modalContent">
                    {selectedMenu === "boardMgr" && (
                            // 게시글 검색 리스트
                            <div className="modalBoardMgrRoot">
                                <div className="modalMenuTitle">
                                    <span>게시판 수정</span>
                                </div>

                                <div className="modalBoardMgrBox">
                                    <table className="modalBoardMgrTb">
                                        <tbody>
                                            <tr>
                                                <td className="elementLeft">게시판 제목</td>
                                                <td className="elementRight"><input type="text" id="boardMgrTitle" /></td>
                                            </tr>
                                            <tr>
                                                <td className="elementLeft">게시판 소개</td>
                                                <td className="elementRight"><textarea id="boardMgrComment" rows="10" cols="80"></textarea></td>
                                            </tr>
                                            <tr>
                                                <td className="elementLeft">글읽기 권한</td>
                                                <td className="elementRight">
                                                <select className="readPermission">
                                                    <option value="A">모두</option>
                                                    <option value="U">일반사용자</option>
                                                    <option value="M">관리자</option>
                                                </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="elementLeft">글쓰기 권한</td>
                                                <td className="elementRight">
                                                <select className="writePermission">
                                                    <option value="A">모두</option>
                                                    <option value="U">일반사용자</option>
                                                    <option value="M">관리자</option>
                                                </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="elementLeft">댓글쓰기 권한</td>
                                                <td className="elementRight">
                                                <select className="commentsWritePermission">
                                                    <option value="A">모두</option>
                                                    <option value="U">일반사용자</option>
                                                    <option value="M">관리자</option>
                                                </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="boardMgrCompleteBox">
                                    <button className="boardMgrCompleteBtn" id="boardMgrUpdateBtn" onClick={(event)=> handleInsertOrUpdateDataClick(event)}>완료</button>
                                </div>
                            </div>
                    )}
                    {selectedMenu === "postMgr" && (
                        /* 게시글 관리 검색 조건들 */
                        <div className="modalBoardListRoot">
                            <div className="modalMenuTitle" id="postMgrTitle">
                                <span>정보 공유 게시판</span>
                            </div>

                            <div className="searchRequirementBox">
                                <table className="searchRequirementTb">
                                    <tr>
                                        <td className="elementLeft">등록일</td>
                                        <td className="elementRight">
                                            <input type="date" id="dateFrom"></input> ~ <input type="date" id="dateTo"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="elementLeft">검색조건</td>
                                        <td className="elementRight">
                                        <input type="text" id="searchRequirement"></input>
                                        </td>
                                    </tr>
                                </table>
                                <div className="searchRequirementBtnDiv">
                                    <button className="searchRequirementBtn">검색</button>
                                </div>
                            </div>

                            <div className="modalSerchResult">
                                검색결과 : 총 <span className="modalSerchText">1</span>개
                            </div>

                            {/* 게시글 관리 검색 리스트 */}
                            <div className="modalSerchResultBox">
                                <table className="modalUserBoardListTb">
                                    <thead>
                                        <tr>
                                        <th className="checkBox"><input type="checkbox" checked={boardContentSelectAll} onChange={handleBoardContentSelectAll} /></th>
                                            <th>번호</th>
                                            <th>게시판명</th>
                                            <th>제목</th>
                                            <th>등록일</th>
                                            <th>조회수</th>
                                            <th>추천</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boardContentListTable.map((board, index) => (
                                            <tr key={index}>
                                                <td className="checkBox">
                                                    <input
                                                        type="checkbox"
                                                        checked={boardContentCheckedItems[index]}
                                                        onChange={() => handleBoardContentCheckboxChange(index)}
                                                    />
                                                </td>
                                                <td>{index + 1}</td>
                                                <td className="modalSendData" style={{ display: 'none' }} >{board.contentsNum}</td>
                                                <td>{board.boardName}</td>
                                                <td>{board.content}</td>
                                                <td>{new Date(board.contentsDate).toLocaleDateString()}</td>
                                                <td>{board.views}</td>
                                                <td>{board.recommend}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="postMgrbottom">
                                <div className="postMgrBtnBox">
                                    <button className="postMgrDeleteBtn" id="BoardMgrDetailDelete" onClick={(event) => handleDeleteDataClick(event) } >삭제</button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </Modal>
            
            {/* 게시판 생성 모달팝업 창 */}
            <Modal isOpen={isOpenBoardCreate} onRequestClose={closeBoardCreate} style={CustomStyles}>
                <div className="modalTop">
                    <span className="modalTopTxt">admin Msg</span>
                </div>

                {/* 메뉴바 */}
                <div className="modalMenu">
                    <span onClick={closeBoardCreate}><img className="closeBtn" alt="Image" src={GetIcon("close.png")} /></span>
                </div>

                {/* 게시판 생성 내용 */}
                <section className="modalContent">
                    <div className="modalMenuTitle">
                        <span>게시판 생성</span>
                    </div>
                    
                    <div className="modalBoardMgrRoot">
                        <div className="modalBoardMgrBox">
                            <table className="modalBoardMgrTb">
                                <tbody>
                                    <tr>
                                        <td className="elementLeft">게시판 제목</td>
                                        <td className="elementRight"><input type="text" id="boardMgrTitle" /></td>
                                    </tr>
                                    <tr>
                                        <td className="elementLeft">게시판 소개</td>
                                        <td className="elementRight"><textarea id="boardMgrComment" rows="10" cols="80"></textarea></td>
                                    </tr>
                                    <tr>
                                        <td className="elementLeft">글읽기 권한</td>
                                        <td className="elementRight">
                                        <select className="readPermission">
                                            <option value="A">모두</option>
                                            <option value="U">일반사용자</option>
                                            <option value="M">관리자</option>
                                        </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="elementLeft">글쓰기 권한</td>
                                        <td className="elementRight">
                                        <select className="writePermission">
                                            <option value="A">모두</option>
                                            <option value="U">일반사용자</option>
                                            <option value="M">관리자</option>
                                        </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="elementLeft">댓글쓰기 권한</td>
                                        <td className="elementRight">
                                        <select className="commentsWritePermission">
                                            <option value="A">모두</option>
                                            <option value="U">일반사용자</option>
                                            <option value="M">관리자</option>
                                        </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="boardMgrCompleteBox">
                            <button className="boardMgrCompleteBtn" id="boardMgrInsertBtn" onClick={(event)=> handleInsertOrUpdateDataClick(event)}>완료</button>
                        </div>
                    </div>
                </section>
            </Modal>
        </div>
    );
};