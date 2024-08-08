const host = 'http://localhost'; // 추후에 Let's Encrypt 와 같은 사이트에서 SSL 발급받아서 https로 접근해서 보안을 강화해야 함
const port = '5000';
const url = host + ":" + port + "/";

export const DeviceMgrInitData = () => {
    const initialData = [
        { id: 1, model: 'AS191DK1', type: '에어컨', manufacturer: 'LG', date: '2024.04.29' },
        { id: 2, model: 'AS191DK2', type: ' tv', manufacturer: 'LG', date: '2024.04.29' },
        { id: 3, model: 'AS191DK3', type: '리모컨', manufacturer: 'LG', date: '2024.04.29' },
        { id: 4, model: 'AS191DK4', type: '에어컨', manufacturer: 'LG', date: '2024.04.29' },
        { id: 5, model: 'AS191DK5', type: '건조기', manufacturer: 'LG', date: '2024.04.29' },
        { id: 6, model: 'AS191DK5', type: '건조기', manufacturer: 'LG', date: '2024.04.29' },
        { id: 7, model: 'AS191DK5', type: '건조기', manufacturer: 'LG', date: '2024.04.29' },
        { id: 8, model: 'AS191DK5', type: '건조기', manufacturer: 'LG', date: '2024.04.29' },
        { id: 9, model: 'AS191DK5', type: '건조기', manufacturer: 'LG', date: '2024.04.29' },
        { id: 10, model: 'AS191DK5', type: '건조기', manufacturer: 'LG', date: '2024.04.29' },
    ];

    return initialData;
}


export const InitTableData = (path) => {
    console.log("InitTableData : " + path);
    return new  Promise((resolve, reject) => {
        fetch(url + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 데이터로 응답을 파싱
        })
        .then(data => {
            resolve(data);
            // console.log(data); // 파싱된 JSON 데이터 출력
            
        })
        .catch(error => {
            reject(error);
        });
    });
}



export const RequestMgrInitData = () => {
    const initialData = [
        { id: 'gildong1', username: '홍길동', title: 'iot 질문있습니다.', status: '정상', requestTime: '2024.04.29' },
        { id: 'gildong2', username: '홍길동', title: 'iot 질문있습니다.', status: '정상', requestTime: '2024.04.29' },
        { id: 'gildong3', username: '홍길동', title: 'iot 질문있습니다.', status: '정상', requestTime: '2024.04.29' },
        { id: 'gildong4', username: '홍길동', title: 'iot 질문있습니다.', status: '정상', requestTime: '2024.04.29' },
        { id: 'gildong5', username: '홍길동', title: 'iot 질문있습니다.', status: '정상', requestTime: '2024.04.29' },
        { id: 'gildong6', username: '홍길동', title: 'iot 질문있습니다.', status: '정상', requestTime: '2024.04.29' },
    ];

    return initialData;
}