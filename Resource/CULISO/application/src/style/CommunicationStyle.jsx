import styled from 'styled-components';

// css
export const TopBar = styled.div`
  display: flex;
  align-items: center;  // 수직 중앙 정렬
  justify-content: space-between;  // 수평 분산
  height: 7%;
  padding: 0 20px;  // 양쪽 패딩 추가
`;
export const BoardCenterBox  = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 80%;
  overflow-y: scroll; /* 부모 요소에 가로 스크롤 활성화 */
  scrollbar-width: none;
`;
export const ProfileBox = styled.div`
  display: flex;
  align-items: center;
`;

export const ProfileImg = styled.img`
  width: 39px;
`;

export const ProfileCon = styled.div`
  display: inline-block;
  margin-left: 8px;
`;

export const UserName = styled.span`
  display: block;
  font-size: 1.0em;
  font-weight: bold;
`;

export const SubText = styled.span`
  display: block;
  font-size: 0.6em;
`;
export const TopImg = styled.div`
  width: 22px;
`;

export const MainTitle = styled.div`
  font-weight: bold;
`;

export const BoardCommunityContents = styled.div`
  width: calc(100% - 40px);
  height: auto;
  border-radius: 15px;
  background-color: white;
  display: flex;
  flex-direction: column;
  margin: 0 20px 20px 20px;
  box-sizing: border-box;  // 패딩을 포함한 너비와 높이를 계산
`;


export const ContentsTitle = styled.div`
  width: 100%;
  padding: 8px 10px 0px 10px;  // 양쪽 패딩 추가
  font-size: 1em;
  font-weight: bold;
  box-sizing: border-box;  // 패딩을 포함한 너비와 높이를 계산
`;

export const Contents = styled.div`
  width: 100%;
  padding: 10px;  // 양쪽 패딩 추가
  font-size: 0.7em;
  white-space: normal;
  word-wrap: break-word;
  box-sizing: border-box;  // 패딩을 포함한 너비와 높이를 계산
`;

export const Element = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 10px 10px 10px;  // 양쪽 패딩 추가
  font-size: 0.9em;
  box-sizing: border-box;  // 패딩을 포함한 너비와 높이를 계산
`;

export const RecommendAndContentsNum = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  img {
    display: inline-block;
    width: 22px;
    height: 22px;
  }
`;

export const LeftContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const RightContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const CommentTable = styled.table`
    width: 100%;
    border-collapse: separate; 
    border-spacing: 0 20px;
`;

export const TableRow = styled.tr`
    vertical-align: top; 
`;

export const TableCell = styled.td`
    &:first-child {
        width: 1%;
        white-space: nowrap; 
        vertical-align: top; 
    }
    &:last-child {
        width: 1%;
        white-space: nowrap; 
        vertical-align: top; 
    }
    &:nth-child(2) {
        width: auto; 
        vertical-align: top; 
    }
`;

export const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
`;
export const Comment = styled.div`
    margin-top: 5px;
    font-size: 0.8em;
`;
export const UserNick = styled.span`
    font-size: 0.9em;
    margin-right: 10px;
    font-weight: bold;
    display: block;
`;
export const WriteDate = styled.span`
    font-size: 0.5em;
    color: gray;
    display: block;
`;
export const CommentWriteBox = styled.div`
    margin: 5px 10px 10px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    border: 1px solid black;
    border-radius: 15px;
    height: 30px;
    z-index: 10;
`;

export const TextArea = styled.textarea`
    flex: 1;
    font-size: 0.8em;
    border: none;
    border-radius: 15px;
    margin-left: 10px;
    margin-right: 10px;
    box-sizing: border-box;
    height: 100%;
    line-height: 2;
    outline: none;
    overflow: hidden; 
    resize: none;
`;

export const SubmitButton = styled.button`
    background-color: white;
    border: none;
    border-radius: 15px;
    font-size: 0.8em;
    flex-shrink: 0; 
`;

export const DeleteBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;  /* 중앙 정렬 */
    flex-direction: row;      /* 한 줄로 나란히 */
    margin-top: 20px;         /* 적절한 상단 여백 */
    width: 100%;              /* 부모의 너비를 차지하게 설정 */
`;

export const DeleteImg = styled.span`
  margin-right: 10px;
`;

export const DeleteTitle = styled.span`
  font-size: 1em;
`;

export const DeleteBtnLeft = styled.button`
    padding: 10px 20px;
    margin-right: 10px; /* 버튼 간격 조정을 위해 추가 */
    background-color: #A9A9A9;
    color: white;
    border: none;
    border-radius: 8px;
`;

export const DeleteBtnRight = styled.button`
    padding: 10px 20px;
    background-color: #42A5F5;
    color: white;
    border: none;
    border-radius: 8px;
`;

export const DropdownMenu = styled.div`
    position: absolute;
    top: 40px;
    right: 15px;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
    border-radius: 15px;
`;

export const DropdownItem = styled.div`
    padding: 10px;
`;

export const ContentsImgBox = styled.div`
  /* display: flex;
  overflow-x: auto;
  white-space: nowrap; */
  /* max-width: 100%; 부모 요소의 최대 너비 설정 */
  margin-top: 20px;
`;

export const ImageContainer = styled.div`
    /* display: inline-block;
    margin-right: 10px; */
`;

export const Image = styled.img`
    width: 300px;
    height: 300px;
    /* margin-right: 20px; */
`;

export const ImgCloseBtn = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    background-color: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
