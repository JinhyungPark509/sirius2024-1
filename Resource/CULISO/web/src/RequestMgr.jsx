import React, { useState, useEffect } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"
import { CustomStyles } from "./modules/ModalComponent";
import { GetIcon } from "./modules/GetIcon";
import { ViewDetails, DeleteData, UpdateData } from "./modules/sendData";        // DB 데이터 전송
import { InitTableData } from "./modules/InitTableData";     // 메인 화면들 초기 데이터
import { useCheckboxFunctions } from "./modules/checkBox";          // 체크 박스 선택 모듈

// 모달이 열릴 때 사용할 DOM 요소를 지정합니다.
Modal.setAppElement('#root');

export const RequestMgr = () => {
    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    const [inItPath, setInItPath] = useState('');                                   // 메인 화면 초기 데이터 DB path
    const [searchTerm, setSearchTerm] = useState('');                               // 입력된 검색어 상태
    const [tableData, setTableData] = useState([]);                                 // 기기관리 관리 메인 테이블 데이터 상태
    const [requestCompletedTable, setRequestCompletedTable] = useState([]);         // 기기관리 관리 요청 완료 메인 테이블 데이터 상태
    const [requestNotCompletedTable, setRequestNotCompletedTable] = useState([]);   // 기기관리 관리 요청 미완료 메인 테이블 데이터 상태
    const [isOpen, setIsOpen] = useState(false);                                    // 상세보기 팝업 상태
    const [isCompleted, setIsCompleted] = useState(false);
    const [modalSendData, setModalSendData] = useState(null);                       // 모달 팝업창 선택 시 해당 버튼 레코드에 해당하는 id 값
    const [detailPath, setDetailPath] = useState('');                               // 모달 팝업창 각 버튼에 해당하는 DB path
    const [requestDetailContent, setRequestDetailContent] = useState([]);           // 상세보기 안 요청 내용
    const [displayedTableData, setDisplayedTableData] = useState([]); // 초기 상태 설정

    // 메인 화면 초기 데이터 생성
    useEffect(() => {
        const fetchData = async () => {
            try {
                const path = "requestMgrInitData";
                const data = await InitTableData(path);
                setRequestCompletedTable(data.requestCompletedResult || []);
                setRequestNotCompletedTable(data.requestNotCompletedResult || []);
                setInItPath(path);
                setDisplayedTableData(data.requestNotCompletedResult || []);
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
                            setRequestDetailContent(data[0] || []);
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

    const handleCompletedClick = () => {
        setDisplayedTableData(requestCompletedTable);
        setIsCompleted(true);
    };
    
    const handleNotCompletedClick = () => {
        setDisplayedTableData(requestNotCompletedTable);
        setIsCompleted(false);
    };

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
                pathValue = "requestMgrViewDetails";
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
        let isConfirmed;

        console.log("buttonID = " + buttonId);

        if (buttonId === "requestComplitedBtn") {
            tableSendData = requestCompletedTable;
            checkID = "deviceRequestID";
            checkedItems = completedCheckedItems;

            // 확인 메시지 표시
            isConfirmed = window.confirm('삭제하시겠습니까?');
        } else {
            tableSendData = requestNotCompletedTable;
            checkID = "deviceRequestID";
            checkedItems = notCompletedCheckedItems;

            // 확인 메시지 표시
            isConfirmed = window.confirm('요청 완료하시겠습니까?');
        }

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
                    if (buttonId === "requestComplitedBtn") {
                        const data = await InitTableData(inItPath);
                        setRequestCompletedTable(data.requestCompletedResult || []);
                    } else {
                        const data = await InitTableData(inItPath);
                        setRequestCompletedTable(data.requestNotCompletedResult || []);
                    }
                } catch (error) {
                    console.warn('삭제 도중 오류가 발생했습니다:', error);
                }
            } else {
                console.warn('삭제할 항목이 선택되지 않았습니다.');
            }
        }
    }

    // table에 따라 체크박스 선택 독립적으로 나누기
    const {
        selectAll: completedSelectAll,
        checkedItems: completedCheckedItems,
        handleSelectAll: handleCompletedSelectAll,
        handleCheckboxChange: handleCompletedCheckboxChange
    } = useCheckboxFunctions(requestCompletedTable);
    const {
        selectAll: notCompletedSelectAll,
        checkedItems: notCompletedCheckedItems,
        handleSelectAll: handleNotCompletedSelectAll,
        handleCheckboxChange: handleNotCompletedCheckboxChange
    } = useCheckboxFunctions(requestNotCompletedTable);

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
                            </li>
                            <li>
                                <img className="mgrImg" alt="Text" src={GetIcon("iot.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("deviceMgr")}>기기 관리</span></div>
                            </li>
                            <li>    
                                <img className="mgrImg" alt="User" src={GetIcon("help-call.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("requestMgr")}>요청 관리</span></div>
                                <img className="selectArrow" alt="Polygon" src={GetIcon("Polygon1.png")} />
                            </li>
                        </ul>
                    </div>

                    <div className="topDiv" />
                    <div className="topDivText">admin Msg</div>
                    
                    <div className="contents" />
                    
                    <div className="selectMenuTitle">요청 관리</div>
                    
                    <div className="searchInput">
                        <img className="searchInputImage" alt="Image" src={GetIcon("profile-gray.png")} />
                        <input
                            className="searchText"
                            type="text"
                            placeholder="회원명"
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className="searchBtn" onClick={handleSearch}>검색</button>

                    <div className="requestStateDiv">
                        <span className={`requestNotComplete ${displayedTableData === requestNotCompletedTable ? 'active' : ''}`} onClick={handleNotCompletedClick}>요청 미완료</span>
                        <span className={`requestComplete ${displayedTableData === requestCompletedTable ? 'active' : ''}`} onClick={handleCompletedClick}>요청 완료</span>
                    </div>
                    
                    <div className="userListBox" >
                        <table className="userListTable">
                            <thead>
                                <tr>
                                    <th className="checkBox">
                                        <input type="checkbox" 
                                            checked={displayedTableData === requestCompletedTable ? completedSelectAll : notCompletedSelectAll} 
                                            onChange={displayedTableData === requestCompletedTable ? handleCompletedSelectAll : handleNotCompletedSelectAll} 
                                        />
                                    </th>
                                    <th>번호</th>
                                    <th>아이디</th>
                                    <th>닉네임</th>
                                    <th>상태</th>
                                    <th>요청시간</th>
                                    <th>상세보기</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedTableData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="checkBox">
                                            <input 
                                                type="checkbox" 
                                                checked={displayedTableData === requestCompletedTable ? completedCheckedItems[index] : notCompletedCheckedItems[index]} 
                                                onChange={() => displayedTableData === requestCompletedTable ? handleCompletedCheckboxChange(index) : handleNotCompletedCheckboxChange(index)} 
                                            />
                                        </td>
                                        <td>{index + 1}</td>
                                        <td className="modalSendData" style={{ display: 'none' }}>{item.deviceRequestID}</td>
                                        <td>{item.userID}</td>
                                        <td>{item.userNickName}</td>
                                        <td>{item.state}</td>
                                        <td>{new Date(item.requestTime).toLocaleString()}</td>
                                        <td className="mgr">
                                            <button className="mgrDetailBtn" id="requestMgrDetail" onClick={(event) => { openModal(); handleViewDetailsClick(event); }}>
                                                <span className="mgrModify">상세보기</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isCompleted ? (
                        <button className="requestComplitedBtn" id="requestMgrComplitedDelete" onClick={(event) => handleDeleteDataClick(event) } >삭제</button>
                    ) : (
                        <button className="requestNotComplitedBtn" id="requestMgrNotComplitedDelete" onClick={(event) => handleDeleteDataClick(event) } >요청 완료</button>
                    )}

                    {/* 페이징 버튼 */}
                    
                    
                </div>
            </div>

            {/* 요청 관리 상세보기 모달팝업 창 */}
            <Modal isOpen={isOpen} onRequestClose={closeModal} style={CustomStyles}>
                <div className="modalTop">
                    <span className="modalTopTxt">admin Msg</span>
                </div>

                {/* 게시판 생성 내용 */}
                {requestDetailContent && (
                    <section className="modalContent">
                        <div className="modalBoardMgrRoot">
                            <div className="modalRequestMgrBox">
                                <div className="requestImgBox">
                                    <img className="requestImg" alt="Image" src={requestDetailContent.productImgUrl} />
                                </div>
                            </div>

                            <div className="requestInformation">
                                <ul>
                                    <li>제조사 : <span className="requestManufacturer">{requestDetailContent.company}</span></li>
                                    <li>모델명 : <span className="requestModelName">{requestDetailContent.productName}</span></li>
                                    <li>기기 타입 : <span className="requestDeviceType">{requestDetailContent.type}</span></li>
                                </ul>
                            </div>

                            <div className="requestCommentBox">
                                <textarea id="requestComment" rows="13" cols="80">{requestDetailContent.title}</textarea>
                            </div>

                            <div className="boardMgrCompleteBox">
                                <button className="boardMgrCompleteBtn" onClick={closeModal}>돌아가기</button>
                            </div>
                        </div>
                    </section>
                )}
            </Modal>
        </div>
    );
};