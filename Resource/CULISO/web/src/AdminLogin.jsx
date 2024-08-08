import React from "react";
import "./admin.css";
import { GetIcon } from "./GetIcon";

export const AdminLogin = () => {
    return (
        <div className="AdminLogin">
            <div className="div">
                <div className="removebg-preview">
                    <img alt="Removebg preview" src={GetIcon("home.png")} />
                </div>
                <div className="overlap">
                    <div className="group">
                        <div className="overlap-group-2">
                            <img className="image" alt="Image" src={GetIcon("profile-gray.png")} />
                            <input className="text-wrapper-2" type="text" placeholder="아이디" />
                        </div>
                        <div className="overlap-2">
                            <img className="padlock" alt="Padlock" src={GetIcon("gray-padlock.png")} />
                            <input className="text-wrapper-3" type="password" placeholder="비밀번호" />
                        </div>
                        <button className="overlap-group">로그인</button>
                    </div>
                </div>
                <div className="text-wrapper-4">Admin</div>
            </div>
        </div>
    );
};
