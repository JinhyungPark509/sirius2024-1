import React, { useState, useEffect } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"
import { CustomStyles } from "./modules/ModalComponent";
import { GetIcon } from "./modules/GetIcon";
import { ViewDetails, DeleteData, InsertData } from "./modules/sendData";        // DB 데이터 전송
import { InitTableData } from "./modules/InitTableData";     // 메인 화면들 초기 데이터
import { useCheckboxFunctions } from "./modules/checkBox";          // 체크 박스 선택 모듈

export const DeviceMgr = () => {
    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    const [inItPath, setInItPath] = useState('');                                   // 메인 화면 초기 데이터 DB path
    const [searchTerm, setSearchTerm] = useState('');                               // 입력된 검색어 상태
    const [tableData, setTableData] = useState([]);                                 // 기기관리 관리 메인 테이블 데이터 상태

     // 메인 화면 초기 데이터 생성
    useEffect(() => {
        const fetchData = async () => {
            try {
                const path = "deviceMgrInitData";
                const data = await InitTableData(path);
                setTableData(data);
                setInItPath(path);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

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
            item.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.registrationDate.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setTableData(filteredData);
    };

    // 삭제 할 데이터 DB에 보내기
    async function handleDeleteDataClick (event) {
        // 클릭된 버튼의 id를 가져옵니다.
        const button = event.target.closest('button');
        const buttonId = button.id;
        let tableSendData;
        let checkID = "";
        let checkedItems;

        console.log("buttonID = " + buttonId);

        tableSendData = tableData;
        checkID = "productNum";
        checkedItems = deviceCheckedItems;

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
                    const newData = await InitTableData(inItPath);
                    setTableData(newData);
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
        selectAll: deviceSelectAll,
        checkedItems: deviceCheckedItems,
        handleSelectAll: handleDeviceSelectAll,
        handleCheckboxChange: handleDeviceCheckboxChange
    } = useCheckboxFunctions(tableData);


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
                                <img className="selectArrow" alt="Polygon" src={GetIcon("Polygon1.png")} />
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
                    
                    <div className="selectMenuTitle">기기 관리</div>
                    
                    <div className="searchInput">
                        <img className="searchInputImage" alt="Image" src={GetIcon("iot.png")} />
                        <input
                            className="searchText"
                            type="text"
                            placeholder="기기명"
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
                                    <th className="checkBox"><input type="checkbox" checked={deviceSelectAll} onChange={handleDeviceSelectAll} /></th>
                                    <th>번호</th>
                                    <th>모델명</th>
                                    <th>기기 타입</th>
                                    <th>제조사</th>
                                    <th>등록일</th>
                                    <th>이미지</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="checkBox">
                                            <input 
                                                type="checkbox"
                                                checked={deviceCheckedItems[index]}
                                                onChange={() => handleDeviceCheckboxChange(index)}/>
                                        </td>
                                        <td className="modalSendData" style={{ display: 'none' }}>{item.productNum}</td>
                                        <td>{index + 1}</td>
                                        <td>{item.modelName}</td>
                                        <td>{item.type}</td>
                                        <td>{item.company}</td>
                                        <td>{new Date(item.registrationDate).toLocaleDateString()}</td>
                                        <td><img className="deviceImg" alt="Device" src={item.productImgUrl} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 삭제 버튼 */}
                    <div className="deleteButtonDiv">
                        <button className="boardDeleteButton" id="DeviceMgrDelete" onClick={(event) => handleDeleteDataClick(event) }>삭제</button>
                        <button className="boardCreateButton">기기 등록</button>
                    </div>

                    {/* 페이징 버튼 */}
                    
                    
                    
                </div>
            </div>
        </div>
    );
};
