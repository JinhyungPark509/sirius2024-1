import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Cookies } from "react-cookie";
import './App.css';
import GetIcon from './modules/GetIcon';
import { GetChatLog } from './modules/DataRouter';
import { BackButton } from "./modules/Navigate";
import { Geolocation } from '@capacitor/geolocation';
const cookies = new Cookies();

export function AI() {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [listening, setListening] = useState(false);
    const [typingMessage, setTypingMessage] = useState('입력 중');
    const typingIntervalRef = useRef(null);
    const recognitionRef = useRef(null);
    const [flag, setFlag] = useState(true);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('이 브라우저는 음성 인식을 지원하지 않습니다. 구글 크롬을 사용해주세요.');
        }
    }, []);

    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const chatLogElement = document.querySelector('.chat-log');
        chatLogElement.scrollTop = chatLogElement.scrollHeight;

        let didCancel = false;

        const fetchChatLog = async () => {
            try {
                const data = await GetChatLog();
                console.log(data);
                if (!didCancel) {
                    for (let i = 0; i < data.length; i++) {
                        updateChatLog({ sender: data[i].senderType === 'U' ? 'user' : 'bot', text: data[i].userChatContext });
                    }
                }
            } catch (error) {
                if (!didCancel) {
                    console.error('Failed to fetch chat log:', error);
                }
            }
        };

        fetchChatLog();

        return () => {
            didCancel = true;
        };
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
        if (status.granted) {
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
        const position = await Geolocation.getCurrentPosition();
        console.log('위치 정보:', position);
        return true;
    } catch (error) {
        console.error('위치 정보를 가져오는 중 오류 발생:', error);
        return false;
    }
    };
    // 음성 권한 확인
    const checkMicrophonePermission = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (stream) {
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
        if (status.location === 'granted') {
        console.log('위치 정보 권한이 이미 부여되었습니다.');
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
    const requestMicrophonePermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('마이크 권한이 부여되었습니다.');
        } catch (error) {
            console.error('마이크 권한을 요청하는 중 오류가 발생했습니다:', error);
        }
    };

    const startListening = async () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('음성 인식을 지원하지 않는 브라우저입니다.');
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        await requestMicrophonePermission();
        recognitionRef.current = recognition;
        recognition.lang = 'ko-KR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setListening(true);
            startListeningIndicator();
        };

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            setMessage(transcript);

            try {
                const position = await getLocationPermission();
                sendMessageWithLocation(transcript, position.latitude, position.longitude);
            } catch (error) {
                console.error('위치 정보를 가져오는 데 실패했습니다:', error);
                sendMessage(transcript);
            }

            setListening(false);
        };

        recognition.onerror = (event) => {
            console.error('음성 인식 오류:', event.error);
            setListening(false);
            stopListeningIndicator();
        };

        recognition.onend = () => {
            setListening(false);
            stopListeningIndicator();
        };

        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setListening(false);
        stopListeningIndicator();
    };

    const getLocationPermission = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log('위치 정보:', position);
                        resolve({ latitude, longitude });
                    },
                    (error) => {
                        console.error('위치 정보를 가져오는 중 오류 발생:', error);
                        reject(error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            } else {
                console.error('이 브라우저는 위치 정보를 지원하지 않습니다.');
                reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'));
            }
        });
    };

    const getLocationAndSendMessage = async (msg) => {
        try {
            const position = await getLocationPermission();
            sendMessageWithLocation(msg, position.latitude, position.longitude);
        } catch (error) {
            console.error('위치 정보를 가져오는 데 실패했습니다:', error);
            sendMessage(msg);
        }
    };

    const sendMessageWithLocation = async (msg, latitude, longitude) => {
        if (!msg.trim()) return;

        updateChatLog({ sender: 'user', text: msg });

        try {
            startTypingIndicator();

            const token = cookies.get("token");

            if (!token) {
                console.log("토큰 없음");
                return false; // 토큰이 없을 때 false 반환
            }

            const response = await axios.post('https://culiso.duckdns.org/chat', { message: msg, latitude, longitude }, { headers: { "Authorization": `Bearer ${token}` } });
            stopTypingIndicator();
            handleBotResponse(response.data.response);
        } catch (error) {
            stopTypingIndicator();
            console.error('위치 정보를 포함하여 메시지를 보내는 중 오류 발생:', error);
            alert('위치 정보를 포함하여 메시지를 보내는 중 오류가 발생했습니다.');
        }
    };

    const sendMessage = async (msg) => {
        if (!msg.trim()) return;

        updateChatLog({ sender: 'user', text: msg });

        try {
            startTypingIndicator();

            const token = cookies.get("token");

            if (!token) {
                console.log("토큰 없음");
                return false; // 토큰이 없을 때 false 반환
            }

            const response = await axios.post('https://culiso.duckdns.org/chat', { message: msg }, { headers: { "Authorization": `Bearer ${token}` } });
            stopTypingIndicator();
            handleBotResponse(response.data.response);
        } catch (error) {
            stopTypingIndicator();
            console.error('메시지를 보내는 중 오류 발생:', error);
            alert('메시지를 보내는 중 오류가 발생했습니다.');
        }
    };

    const handleBotResponse = (response) => {
        const cleanedResponse = response.replace(/\*\*|###|####/g, ''); // '**', '###' 및 '####' 제거
        updateChatLog({ sender: 'bot', text: cleanedResponse });
    };

    const updateChatLog = (message) => {
        setChatLog((prevChatLog) => [...prevChatLog, message]);
        setMessage('');
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            getLocationAndSendMessage(message);
        }
    };

    const formatMessage = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.startsWith('  ')) { // 들여쓰기 적용할 부분 감지
                return <div key={index} className="formatted-line indented">{line}</div>;
            }
            return <div key={index} className="formatted-line">{line}</div>;
        });
    };

    const startTypingIndicator = () => {
        setTypingMessage('입력 중');
        typingIntervalRef.current = setInterval(() => {
            setTypingMessage(prev => prev.length < 9 ? prev + '.' : '입력 중');
        }, 500);

        updateChatLog({ sender: 'bot', text: '입력 중' });
    };

    const stopTypingIndicator = () => {
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }

        // Remove the typing indicator
        setChatLog((prevChatLog) => prevChatLog.filter((message, index) => index !== prevChatLog.length - 1));
    };

    const startListeningIndicator = () => {
        updateChatLog({ sender: 'system', text: '음성 인식 중' });
    };

    const stopListeningIndicator = () => {
        setChatLog((prevChatLog) => prevChatLog.filter((message) => message.text !== '음성 인식 중'));
    };

    // const [value, setValue] = useState("");
    // const { listen, listening, stop } = useSpeechRecognition({
    //   onResult: result => {
    //     // 음성인식 결과가 value에 저장
    //     setValue(result);
    //     console.log("사용자 음성 결과-" + value);
    //   }
    // });
    return (
        <div className="ai">
            <div className='aiDiv'>
                <div className="App">
                    <div className='topMenubar'>
                        <BackButton left="20px"/>
                        <span style={{marginLeft: "10px"}}>큐리소</span>
                    </div>
                    <div className="chat-log">
                        <div>
                            {chatLog.map((entry, index) => (
                                <div key={index}>
                                    {entry.sender === 'bot' && 
                                    <div className="culiBox">
                                        <img className="culi" src={GetIcon("chatbot-white7.png")} alt="bot" />
                                        <div><span>큐리</span></div>
                                    </div>}
                                    <div className={`chat-box ${entry.sender}`}>
                                        <div className={`chat-message ${entry.sender}`}>
                                            {entry.sender === 'bot' && entry.text === '입력 중' ? typingMessage : formatMessage(entry.text)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='chat-box'>
                        <div className="chat-input">
                            <input
                                type="text"
                                value={message}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="메시지를 입력하세요.."
                            />
                            <img src={GetIcon("send-blue.png")} style={{right: '0', marginRight: '60px'}} width="30px" onClick={() => getLocationAndSendMessage(message)} alt='' />
                            {listening ? (
                                <img 
                                    src={GetIcon("listening-blue.png")} 
                                    style={{right: '0', marginRight: '15px'}} 
                                    width="30px"
                                    alt='' 
                                    onClick={stopListening} 
                                />
                            ) : (
                                <img 
                                    src={GetIcon("voice-blue.png")} 
                                    style={{right: '0', marginRight: '15px'}} 
                                    width="30px"
                                    alt='' 
                                    // onMouseDown={startListening} 
                                    // onMouseUp={stopListening}
                                    onClick={startListening} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
