const host = 'http://localhost'; // 추후에 Let's Encrypt 와 같은 사이트에서 SSL 발급받아서 https로 접근해서 보안을 강화해야 함
const port = '5000';
const url = host + ":" + port + "/";

// 상세보기 데이터 불러오기
export const ViewDetails = (modalSendData, path) => {
    return new  Promise((resolve, reject) => {
        fetch(url + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ modalSendData })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 데이터로 응답을 파싱
        })
        .then(data => {
            resolve(data);
            // 성공적으로 데이터를 받았을 때 처리
            console.log("Result: ", data);
            
        })
        .catch(error => {
            reject(error);
        });
    });
}

// 테이블 데이터 삭제
export const DeleteData = (modalSendData, buttonId) => {
    return new  Promise((resolve, reject) => {
        fetch(url + "deleteTable", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ modalSendData, buttonId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 데이터로 응답을 파싱
        })
        .then(data => {
            resolve(data);
            // 성공적으로 데이터를 받았을 때 처리
            console.log("Result: ", data);
            
        })
        .catch(error => {
            reject(error);
        });
    });
}

// 테이블 데이터 삽입
export const InsertData = (formData, buttonId) => {
    return new  Promise((resolve, reject) => {
        fetch(url + "insertTable", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({formData, buttonId})
        })
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Update request was successful:', data);
            resolve(data);
        })
        .catch(error => {
            console.error('Error in UpdateData function:', error);
            reject(error);
        });
    });
}

// 테이블 데이터 업데이트
export const UpdateData = (modalSendData, formData) => {
    return new  Promise((resolve, reject) => {
        fetch(url + "updateTable", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({modalSendData, formData})
        })
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Update request was successful:', data);
            resolve(data);
        })
        .catch(error => {
            console.error('Error in UpdateData function:', error);
            reject(error);
        });
    });
}