import React, { useState, useEffect } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"
import { CustomStyles, ProfileCardStyles } from "./modules/ModalComponent";
import { GetIcon } from "./modules/GetIcon";
import { ViewDetails, DeleteData } from "./modules/sendData";        // DB 데이터 전송
import { InitTableData } from "./modules/InitTableData";     // 메인 화면들 초기 데이터
import { useCheckboxFunctions } from "./modules/checkBox";          // 체크 박스 선택 모듈


// 모달이 열릴 때 사용할 DOM 요소를 지정합니다.
Modal.setAppElement('#root');

export const AdminMain = () => {
    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    const [inItPath, setInItPath] = useState('');                       // 메인 화면 초기 데이터 DB path
    const [isOpen, setIsOpen] = useState(false);                            // 상세보기 팝업 상태
    const [isOpenProfileCard, setIsOpenProfileCard] = useState(false);      // 프로필카드 팝업 상태
    const [selectedMenu, setSelectedMenu] = useState("boardList");          // 기본값은 "게시글 목록"
    const [searchTerm, setSearchTerm] = useState('');                       // 입력된 검색어 상태
    const [tableData, setTableData] = useState([]);                         // 메인 테이블 데이터 상태
    const [contentListTable, setContentListTable] = useState([]);                // 상세보기 안 게시글 목록 테이블
    const [deviceRequestListTable, setDeviceRequestListTable] = useState([]);    // 상세보기 안 기기 요청 목록 테이블
    const [boardListTable, setBoardListTable] = useState([]);                              // 상세보기 안 게시글 목록의 게시판 리스트 옵션 테이블
    const [modalSendData, setModalSendData] = useState(null);               // 모달 팝업창 선택 시 해당 버튼 레코드에 해당하는 id 값
    const [detailPath, setDetailPath] = useState('');                       // 모달 팝업창 각 버튼에 해당하는 DB path
    const [userProfileData, setUserProfileData] = useState({
        userName: '',
        userNickName: '',
        hubID: '',
        address: '',
        postNum: '',
        userPhoneNum: ''
    });                                                                     // 프로필카드 데이터 변경을 위한 useState

    // 메인 화면 초기 데이터 생성
    useEffect(() => {
        const fetchData = async () => {
            try {
                const path = "adminMainInitData";
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
        // console.log("useEffect for contentListResult and deviceRequestListResult triggered"); // useEffect가 호출될 때 로그를 출력합니다.
        try {
            if (modalSendData && detailPath) {
                ViewDetails(modalSendData, detailPath)
                    .then(data => {
                        setContentListTable(data.contentListResult || []);
                        setDeviceRequestListTable(data.deviceRequestListResult || []);
                        setBoardListTable(data.contentBoardListResult || []);
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });
            }
        } catch (error) {
            console.error("Error:", error);
        }

        // 게시판 데이터를 업데이트하기 전에 현재 선택된 모달의 데이터와 관련된 게시판 데이터를 초기화합니다.
        setBoardListTable([]);
    }, [modalSendData, detailPath]);
    
    // 프로필카드 데이터 가져오기
    useEffect(() => {
        // console.log("useEffect for userProfileData triggered"); // useEffect가 호출될 때 로그를 출력합니다.
        // 데이터 요청 및 처리
        ViewDetails(modalSendData, detailPath)
            .then(data => {
                setUserProfileData(data[0] || {
                    userName: '',
                    userNickName: '',
                    hubID: '',
                    address: '',
                    postNum: '',
                    userPhoneNum: ''
                }); // 받아온 데이터를 상태로 설정; // 받아온 데이터를 상태로 설정
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }, [modalSendData, detailPath]); // 모달SendData가 변경될 때마다 실행

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
            (item.userID && item.userID.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.userName && item.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.userNickName && item.userNickName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.createDate && item.createDate.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        setTableData(filteredData);
    };

    // 모달 팝업 창 설정 함수들
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
    const openProfileCard = () => {
        setIsOpenProfileCard(true);
    }
    const closeProfileCard = () => {
        setIsOpenProfileCard(false);
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
                switch (buttonId) {
                    case "adminMainDetail" :
                        // console.log("AdminMainViewDetails");
                        pathValue = "adminMainViewDetails";
                        ViewDetails(modalSendDataValue, pathValue);
                        break;
                    case "adminMainProfile" :
                        // console.log("ProfileViewDetails");
                        pathValue = "profileViewDetails";
                        ViewDetails(modalSendDataValue, pathValue);
                        break;
                    default:
                        console.error("Unhandled button id:", buttonId);
                }

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

    // 삭제할 데이터 DB에 보내기
    async function handleDeleteDataClick (event) {
        // 클릭된 버튼의 id를 가져옵니다.
        const button = event.target.closest('button');
        const buttonId = button.id;
        let tableSendData;
        let checkID = "";
        let checkedItems;

        if (buttonId === "AdminMainDelete") {
            tableSendData = tableData;
            checkID = "userID";
            checkedItems = tableCheckedItems;
        } else {
            tableSendData = contentListTable;
            checkID = "contentsNum";
            checkedItems = contentCheckedItems;
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
                    if (buttonId === "AdminMainDelete") {
                        const newData = await InitTableData(inItPath);
                        setTableData(newData);
                    } else {
                        // contentListTable에 대한 업데이트 로직 추가
                        if (modalSendData && detailPath) {
                            const data = await ViewDetails(modalSendData, detailPath);
                            setContentListTable(data.contentListResult || []);
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

    // table에 따라 체크박스 선택 독립적으로 나누기
    const {
        selectAll: tableSelectAll,
        checkedItems: tableCheckedItems,
        handleSelectAll: handleTableSelectAll,
        handleCheckboxChange: handleTableCheckboxChange
    } = useCheckboxFunctions(tableData);
    const {
        selectAll: contentSelectAll,
        checkedItems: contentCheckedItems,
        handleSelectAll: handleContentSelectAll,
        handleCheckboxChange: handleContentCheckboxChange
    } = useCheckboxFunctions(contentListTable);

    return (
        <div className="AdminMain">
            <div className="main-overlap-wrapper">
                <div className="main-overlap">
                    <div className="adminMgrList">
                        <ul>
                            <li>
                                <img className="mgrImg" alt="Help call" src={GetIcon("profile-gray.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("")}>회원 관리</span></div>
                                <img className="selectArrow" alt="Polygon" src={GetIcon("Polygon1.png")} />
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
                            </li>
                        </ul>
                    </div>

                    <div className="topDiv" />
                    <div className="topDivText">admin Msg</div>
                    
                    <div className="contents" />
                    
                    <div className="selectMenuTitle">회원 관리</div>
                    
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

                    <div className="serchResult">검색결과 : 총 <span className="userNum">{tableData.length}명</span></div>
                    
                    <div className="userListBox" >
                        <table className="userListTable">
                            <thead>
                                <tr>
                                <th className="checkBox"><input type="checkbox" checked={tableSelectAll} onChange={handleTableSelectAll} /></th>
                                <th>번호</th>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>닉네임</th>
                                <th>가입일</th>
                                <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((user, index) => (
                                    <tr key={index}>
                                        <td className="checkBox">
                                        <input
                                            type="checkbox"
                                            checked={tableCheckedItems[index]}
                                            onChange={() => handleTableCheckboxChange(index)}
                                        />
                                        </td>
                                        <td>{index + 1}</td>
                                        <td className="modalSendData">{user.userID}</td>
                                        <td>{user.userName}</td>
                                        <td>{user.userNickName}</td>
                                        <td>{new Date(user.createDate).toLocaleDateString()}</td>
                                        <td className="userListMgr">
                                            <button className="viewDetailsBtn" id="adminMainDetail" onClick={(event) => { openModal(); handleViewDetailsClick(event); }}>
                                                <img className="viewDetailsImage" alt="Image" src={GetIcon("profile-gray.png")} />
                                                <span className="viewDetails">상세보기</span>
                                            </button>
                                            <button className="viewDetailsBtn" id="adminMainProfile" onClick={(event) => { openProfileCard(); handleViewDetailsClick(event); }}>
                                                <img className="viewDetailsImage" alt="Image" src={GetIcon("profile-gray.png")} />
                                                <span className="viewDetails">프로필카드</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 삭제 버튼 */}
                    <button 
                        className="deleteButton" 
                        id="AdminMainDelete" 
                        onClick={(event) => handleDeleteDataClick(event) }
                        >삭제
                    </button>

                    {/* 페이징 버튼 */}
                    <div className="rectangle-12" />
                    <div className="rectangle-13" />
                    <div className="rectangle-14" />
                    <div className="rectangle-15" />
                    <div className="rectangle-16" />
                    <div className="rectangle-17" />
                    <div className="text-wrapper-36">1</div>
                    <div className="text-wrapper-37">2</div>
                    <div className="text-wrapper-38">&lt;&lt;</div>
                    <div className="text-wrapper-39">&gt;</div>
                    <div className="text-wrapper-40">&lt;</div>
                    <div className="text-wrapper-41">&gt;&gt;</div>
                    
                </div>
            </div>

            {/* 상세보기 모달팝업 창 */}
            <Modal isOpen={isOpen} onRequestClose={closeModal} style={CustomStyles}>
                <div className="modalTop">
                    <span className="modalTopTxt">admin Msg</span>
                </div>

                {/* 메뉴바 */}
                <div className="modalMenu">
                    <span className={selectedMenu === "boardList" ? "boardList active" : "boardList"} id="adminMainDetailBoardList" onClick={() => handleMenuChange("boardList")}>게시글 목록</span>
                    <span className={selectedMenu === "deviceList" ? "deviceList active" : "deviceList"} id="adminMainDetailDeviceList" onClick={() => handleMenuChange("deviceList")}>기기 요청 목록</span>
                    <span onClick={closeModal}><img className="closeBtn" alt="Image" src={GetIcon("close.png")} /></span>
                </div>

                {/* 게시글 목록 내용 */}
                <section className="modalContent">
                    {selectedMenu === "boardList" && (
                        // 게시글 검색 조건들
                        <div className="modalBoardListRoot">
                            <div className="searchRequirementBox">
                                <table className="searchRequirementTb">
                                    <tbody>
                                        <tr>
                                            <td className="elementLeft">게시판 선택</td>
                                            <td className="elementRight">
                                            <select>
                                                <option value="">전체</option>
                                                {boardListTable.map(board => (
                                                    <option key={board.boardID} value={board.boardName}>
                                                        {board.boardName}
                                                    </option>
                                                ))}
                                            </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="elementLeft">등록일</td>
                                            <td className="elementRight">
                                                <input type="date" id="dateFrom"/>
                                                {' ~ '}
                                                <input type="date" id="dateTo"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="elementLeft">검색조건</td>
                                            <td className="elementRight">
                                                <input type="text" id="searchRequirement"/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="searchRequirementBtnDiv">
                                    <button className="searchRequirementBtn">검색</button>
                                </div>
                            </div>

                            <div className="modalSerchResult">
                                검색결과 : 총 <span className="modalSerchText">{contentListTable.length}</span>개
                            </div>

                            {/* 게시글 검색 리스트 */}
                            <div className="modalSerchResultBox">
                                <table className="modalUserBoardListTb">
                                    <thead>
                                        <tr>
                                            <th className="modalCheckBox"><input type="checkbox" checked={contentSelectAll} onChange={handleContentSelectAll}/></th>
                                            <th>번호</th>
                                            <th>게시판명</th>
                                            <th>제목</th>
                                            <th>등록일</th>
                                            <th>조회수</th>
                                            <th>추천</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contentListTable.map((item, index) => (
                                            <tr key={index}>
                                                <td className="modalCheckBox">
                                                    <input
                                                        type="checkbox"
                                                        checked={contentCheckedItems[index] || false}
                                                        onChange={() => handleContentCheckboxChange(index)}
                                                    />
                                                </td>
                                                <td className="modalSendData" style={{ display: 'none' }}>{item.contentsNum}</td>
                                                <td>{index + 1}</td>
                                                <td>{item.boardName}</td>
                                                <td>{item.content}</td>
                                                <td>{new Date(item.contentsDate).toLocaleDateString()}</td>
                                                <td>{item.views}</td>
                                                <td>{item.recommend}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="blockingBox">
                                <button 
                                    className="blockingBtn" 
                                    id="AdminMainDetailDelete" 
                                    onClick={(event) => handleDeleteDataClick(event) }
                                >삭제
                                </button>
                            </div>
                        </div>
                    )}
                    {selectedMenu === "deviceList" && (
                        /* 게시글 검색 조건들 */
                        <div className="modalBoardListRoot">
                            {/* 기기 요청 검색 조건들 */}
                            <div className="searchRequirementBox">
                                <table className="searchRequirementTb">
                                    <tbody>
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
                                    </tbody>
                                </table>
                                <div className="searchRequirementBtnDiv">
                                    <button className="searchRequirementBtn">검색</button>
                                </div>
                            </div>

                            <div className="modalSerchResult">
                                검색결과 : 총 <span className="modalSerchText">1</span>개
                            </div>

                            {/* 기기 요첨 검색 리스트 */}
                            <div className="modalSerchResultBox">
                                <table className="modalUserBoardListTb">
                                    <thead>
                                        <tr>
                                            <th>번호</th>
                                            <th>모델명</th>
                                            <th>기기 타입</th>
                                            <th>제조사</th>
                                            <th>내용</th>
                                            <th>요청일</th>
                                            <th>사진</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deviceRequestListTable.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.productName}</td>
                                                <td>{item.type}</td>
                                                <td>{item.company}</td>
                                                <td>{item.title}</td>
                                                <td>{new Date(item.requestTime).toLocaleDateString()}</td>
                                                <td><img className="deviceImg" alt="Device" src={item.productImgUrl} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            </Modal>

            {/* 프로필카드 팝업 창 */}
            <Modal isOpen={isOpenProfileCard} onRequestClose={closeProfileCard} style={ProfileCardStyles}>
                <section className="profileCard">
                    <div className="profileCardTop">
                        <span className="profileCardState">정상</span>
                    </div>
                    
                    <table className="profileCardContent">
                        <tbody>
                            <tr className="profileCardContentRow">
                                <td className="profileCardUserImg">
                                    <img className="profileCardUser" alt="User" src={GetIcon("user.png")} />
                                </td>
                                <td className="profileCardUserInformation">
                                    <span className="profileCardUserName">{userProfileData.userName}</span>
                                    <span className="profileCardUserNickName">{userProfileData.userNickName}</span>
                                </td>

                                <td className="profileCardHubImg">
                                    <img className="profileCardUserHub" alt="Zigbee Hub" src={GetIcon("zigbee.png")} />
                                </td>
                                <td className="profileCardHubInformation">
                                    <span className="profileCardHubNum">{userProfileData.hubID}</span>
                                </td>
                            </tr>

                            <tr className="profileCardContentRow">
                                <td className="profileCardLocationImg">
                                    <img className="profileCardLocation" alt="location" src={GetIcon("location-pin.png")} />
                                </td>
                                <td className="profileCardLocationInformation">
                                    <span className="profileCardLocationName">{userProfileData.address}</span>
                                    <span className="profileCardLocationNum">{userProfileData.postNum}</span>
                                </td>

                                <td className="profileCardPhoneImg">
                                    <img className="profileCardPhoneImg" alt="phone" src={GetIcon("telephone.png")} />
                                </td>
                                <td className="profileCardPhoneInformation">
                                    <span className="profileCardPhoneNum">{userProfileData.userPhoneNum}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="profileCardBottom">
                        <span className="profileCardDate">2024.04.29</span>
                    </div>
                </section>
            </Modal>
        </div>
    );
};