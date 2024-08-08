import { MenuBar } from "./MenuBar";
import GetIcon from "./modules/GetIcon";
import { Cookies } from "react-cookie";
import styled from "styled-components";
import "./style.css";
import { useState, useEffect } from "react";
import { GetAddress } from "./modules/DataRouter";

const CenterBox = styled.div`
  display: flex;
  justify-content: ${(props) => props.align};
  align-items: center;
  margin-top: ${(props) => props.top};
`;

const Text = styled.span`
  text-align: ${(props) => props.align};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-family: ${(props) => props.font};
`;

const Img = styled.img`
  width: ${(props) => props.width};
  margin-top: ${(props) => props.top};
  color: ${(props) => props.color};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const PowerButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
  }
`;

const DeviceCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: white;
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-left: 10px;
  margin-top: 15px;
  height: 110px;
  width: 130px;
`;

const DeviceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const GridWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.top};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
  width: 350px;
  max-width: 600px;
  margin: auto;
`;

const DeviceName = styled.div`
  font-size: 18px;
  margin-top: 10px;
  color: #333;
`;

const DeviceStatus = styled.div`
  font-size: 16px;
  color: grey;
`;

const DeviceIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const devicesData = [
  { name: '침실 조명', iconOn: 'lighting2-on.png', iconOff: 'lighting2-off.png', powerOnIcon: 'power-on.png', powerOffIcon: 'power-off.png' },
  { name: '거실 조명', iconOn: 'lighting2-on.png', iconOff: 'lighting2-off.png', powerOnIcon: 'power-on.png', powerOffIcon: 'power-off.png' },
  { name: '에어컨', iconOn: 'air-conditioner-on.png', iconOff: 'air-conditioner-off.png', powerOnIcon: 'power-on.png', powerOffIcon: 'power-off.png' },
  { name: '커튼', iconOn: 'curtain-on.png', iconOff: 'curtain-off.png', powerOnIcon: 'power-on.png', powerOffIcon: 'power-off.png' },
  { name: '보일러', iconOn: 'water-heater-on.png', iconOff: 'water-heater-off.png', powerOnIcon: 'power-on.png', powerOffIcon: 'power-off.png' },
  { name: 'TV', iconOn: 'tv-on.png', iconOff: 'tv-off.png', powerOnIcon: 'power-on.png', powerOffIcon: 'power-off.png' },
];

const cookies = new Cookies();

function LogOut() {
  cookies.remove("token");
  alert("다음에도 큐리소를 이용해 주세요 !");
  window.location.href = "/login";
}

export const AfterDeviceMain = () => {
  const [address, setAddress] = useState("");
  const [devices, setDevices] = useState(devicesData.map(device => ({ ...device, status: '꺼짐', icon: device.iconOff, powerIcon: device.powerOffIcon })));

  useEffect(() => {
    // 주소 얻는 메소드
    const GetAddr = async () => {
      const address = await GetAddress();
      setAddress(address);
      console.log("주소: " + address);
    };

    GetAddr();
  }, []);

  const toggleDeviceStatus = (index) => {
    const newDevices = [...devices];
    const device = newDevices[index];
    device.status = device.status === '켜짐' ? '꺼짐' : '켜짐';
    device.icon = device.status === '켜짐' ? device.iconOn : device.iconOff;
    device.powerIcon = device.status === '켜짐' ? device.powerOnIcon : device.powerOffIcon;
    setDevices(newDevices);
  };

  return (
    <div className="afterdeviceMain">
      <div className="deviceMainDiv">
        <CenterBox align="space-between" top="50px">
          <Label>
            <Text
              size="12px"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100px",
              }}
            >
              {address}
            </Text>
            <Img
              src={GetIcon("mypage-modify.png")}
              width={"13px"}
              style={{ marginLeft: "5px" }}
            />
          </Label>
          <RightContainer>
            <Img src={GetIcon("logout.png")} width={"17px"} onClick={LogOut} />
            <Img
              src={GetIcon("inform-black.png")}
              width={"15px"}
              style={{ marginLeft: "20px" }}
            />
            <Img
              src={GetIcon("dropdown.png")}
              width={"15px"}
              style={{ marginLeft: "20px" }}
            />
          </RightContainer>
        </CenterBox>
        <GridWrapper top="90px">
          <Grid>
            {devices.map((device, index) => (
              <DeviceCard key={device.name}>
                <DeviceHeader>
                  <DeviceIcon src={GetIcon(device.icon)} alt={device.name} />
                  <PowerButton onClick={() => toggleDeviceStatus(index)}>
                    <img src={GetIcon(device.powerIcon)} alt="Power Button" />
                  </PowerButton>
                </DeviceHeader>
                <DeviceName>{device.name}</DeviceName>
                <DeviceStatus>{device.status}</DeviceStatus>
              </DeviceCard>
            ))}
          </Grid>
        </GridWrapper>
        {/* 메뉴바 */}
        <MenuBar />
      </div>
    </div>
  );
};