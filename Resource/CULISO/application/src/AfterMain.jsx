
import { MenuBar } from "./MenuBar";
import GetIcon from "./modules/GetIcon";
import { Cookies } from "react-cookie";
import styled from "styled-components";
import "./style.css";
import { useState, useEffect } from "react";
import { GetAddress } from "./modules/DataRouter";
import { Geolocation } from '@capacitor/geolocation';
import { AfterDeviceMain } from './AfterDeviceMain';

// css
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
const EmptyContainer = styled.div`
  width: 300px;
  height: 295px;
  border-radius: 20px;
  background: #fafafa;
`;
const Button = styled.input`
  width: 129px;
  height: 35px;
  background-color: #b1dbfa;
  border: none;
  font-family: normal;
  font-weight: 700;
  margin-top: 35px;
  border-radius: 8px;
  font-size: 16px;
`;
const cookies = new Cookies();




function LogOut() {
  cookies.remove("token");
  alert("다음에도 큐리소를 이용해 주세요 !");
  window.location.href = "/login";
}
export const AfterMain = () => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  const [address, setAddress] = useState();
  const [flag, setFlag] = useState(true);
  const [bluetoothFlag, setBluetoothFlag] = useState(false);

  useEffect(() => {
    // 주소 얻는 메소드
    const GetAddr = async () => {
      const address = await GetAddress();
      setAddress(address);
      console.log("주소: " + address);
    };

    GetAddr();
  }, []);

  useEffect(() => {
    //requestPermissions();
    if(flag){
      CheckPermissions();
      setFlag(false);
    }
  }, []);

  // 권한 확인 및 요청
  const CheckPermissions = async () => {
    try {
      // 현재 권한 상태 확인
      const microphonePermission = await checkMicrophonePermission();
      const locationPermission = await checkLocationPermission();

      // 권한이 허용되지 않은 경우에만 요청
      if (!microphonePermission) {
        await RequestMicrophonePermission();
      }

      if (!locationPermission) {
        await RequestLocationPermission();
      }
    } catch (error) {
      console.error('권한 확인 및 요청 중 오류가 발생했습니다:', error);
    }
  };
  // 음성 권한 요청
  const RequestMicrophonePermission = async () => {
    try {
      const status = await Permissions.request({ name: 'microphone' });
      if (status.state === 'granted') {
        console.log('마이크 권한이 부여되었습니다.');
      } else {
        console.log('마이크 권한이 거부되었습니다.');
      }
    } catch (error) {
      console.error('마이크 권한 요청 중 오류 발생:', error);
    }
  };

  // 위치 권한 요청
  const RequestLocationPermission = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', coordinates);
      return coordinates;
    } catch (error) {
      console.error('위치 정보를 가져오는 중 오류 발생:', error);
      return false;
    }
  };
  // 블루투스 요청
  const requestBlueTooth = async () => {
    try{
      if (!navigator.bluetooth) {
        console.log("브라우저가 Web Bluetooth API를 지원하지 않습니다.");
      }

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      });
      if(device){
        console.log('블루투스 기기를 찾았습니다:', device);
        // GATT 서버에 연결
        const server = await device.gatt.connect();
        // GATT 서버에서 제공하는 서비스 검색
        const services = await server.getPrimaryServices();
        // 각 서비스에 속한 특성 찾기
        for (const service of services) {
          const characteristics = await service.getCharacteristics();
          for (const characteristic of characteristics) {
              console.log('찾은 특성:', characteristic.uuid);
              // 이제 찾은 특성을 사용하여 데이터를 읽거나 쓸 수 있습니다.
          }
        }
        // // 데이터 쓰기
        // const dataToWrite = new Uint8Array([97]);
        setBluetoothFlag(true);
      }
      // 연결 및 통신 작업 수행
    } catch (error) {
      console.error('블루투스 기기 연결 중 오류 발생:', error);
    }
  }

  // 음성 권한 확인
  const checkMicrophonePermission = async () => {
    try {
      const status = await Permissions.query({ name: 'microphone' });
      if (status.state === 'granted') {
        console.log('마이크 권한이 이미 부여되었습니다.');
        return true;
      } else {
        console.log('마이크 권한이 부여되지 않았습니다.');
        return false;
      }
    } catch (error) {
      console.error('마이크 권한 확인 중 오류 발생:', error);
      return false;
    }
  };

  // 위치 권한 확인
  const checkLocationPermission = async () => {
    try {
      const status = await Geolocation.checkPermissions();
      if (status.location !== 'granted') {
        const permission = await Geolocation.requestPermissions();
        if (permission.location !== 'granted') {
          throw new Error('Location permission not granted');
        }
        else{
          console.log("위치 정보 권한이 승인되었습니다.");
        }
        return true;
      } else {
        console.log('위치 정보 권한이 부여되지 않았습니다.');
        return false;
      }
    } catch (error) {
      console.error('위치 정보 권한 확인 중 오류 발생:', error);
      return false;
    }
  };
  
  return (
    <div>
      {bluetoothFlag ? (
        <AfterDeviceMain/>
      ) : (
        <div className="afterMain">
          <div className="afterMainDiv">
            <CenterBox align="space-between" top="15px">
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
            
            <CenterBox align="center" style={{width:"100vw", height:"100vh"}}>
              <EmptyContainer style={{marginBottom:"35.28px"}}>
                <Img src={GetIcon("home.png")} width={"134px"} top={"25px"} />
                <br />
                <br />
                <br />
                <Text size="20px" font="SejonghospitalBold">
                  등록된 기기가 없으신가요?
                </Text>
                <Button type="button" value={"등록하기"} onClick={() => requestBlueTooth()} />
              </EmptyContainer>
            </CenterBox>
            {/* 메뉴바 */}
            <MenuBar/>
          </div>
        </div>
      )}
    </div>
    
  );
};
