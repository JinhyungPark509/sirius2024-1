// Display : Width = 360, Height = 800

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// 페이지 불러오기
import { Intro } from "./Intro";
import { Main } from "./Main";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { AfterMain } from "./AfterMain";
import { MyPage } from "./MyPage";
import { UpdateProfile } from "./UpdateProfile";
import { AI } from "./AI";
import { FindingID } from "./FindingID";
import { FindingPW } from "./FindingPW";
import { AfterDeviceMain } from "./AfterDeviceMain";
import { CommunicationMain } from "./CommunicationMain";
import { ContentsComponent } from "./modules/ContentsComponent";
import { ContentUpload } from "./ContentUpload";

// 스타일 파일 가져오기
import "./style.css";
// Screen 컴포넌트를 렌더링하는 함수
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/main" element={<Main />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/afterMain" element={<AfterMain />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
        <Route path="/culi" element={<AI />} />
        <Route path="/findingID" element={<FindingID/>} />
        <Route path="/findingPW" element={<FindingPW/>} />
        <Route path="/afterDeviceMain" element={<AfterDeviceMain/>} />
        <Route path="/communicationMain" element={<CommunicationMain/>} />
        <Route path="/contentsComponent" element={<ContentsComponent/>} />
        <Route path="/contentUpload" element={<ContentUpload/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;