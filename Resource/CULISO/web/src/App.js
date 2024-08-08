import React, {useState,useEffect} from "react";
import { useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";

import { AdminMain } from "./AdminMain";
import { BoardMgr } from "./BoardMgr";
import { DeviceMgr } from "./DeviceMgr";
import { RequestMgr } from "./RequestMgr";

// Screen 컴포넌트를 렌더링하는 함수
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<AdminMain />} />
          <Route path="/boardMgr" element={<BoardMgr />} />
          <Route path="/deviceMgr" element={<DeviceMgr />} />
          <Route path="/requestMgr" element={<RequestMgr />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
