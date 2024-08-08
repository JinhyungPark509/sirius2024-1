import React from "react";
import GetIcon from "./modules/GetIcon";
import * as nav from "./modules/Navigate";
import "./style.css";
export const Intro = () => {
  nav.TimerNavigate(2.5, "main");
  return (
    <div className="intro">
      <div className="idiv">
        <img className="LogoAni" src={GetIcon("culisoLogo.png")} alt="CULISO" />
      </div>
    </div>
  );
};
