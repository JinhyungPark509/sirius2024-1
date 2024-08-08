export function handleViewDetailsClick (event) {
    // 클릭된 버튼의 부모 요소인 <td> 태그를 찾습니다.
    const tdElement = event.target.closest('td');
    if (tdElement) {
        // tdElement의 부모인 tr 요소에서 'modalSendData' 클래스를 가진 td 태그를 선택합니다.
        const idElement = tdElement.parentNode.querySelector('td.modalSendData');
        if (idElement) {
            // 선택된 td 태그의 텍스트 콘텐츠를 가져옵니다.
            const modalSendData = idElement.textContent.trim();
            console.log("id : " + modalSendData);

            // 가져온 아이디 값을 서버로 전송합니다.
            // viewDetails(modalSendData);
        } else {
            console.error('아이디를 찾을 수 없습니다.');
        }
    } else {
        console.error('버튼의 부모 요소를 찾을 수 없습니다.');
    }
}

function viewDetails(modalSendData) {
    return new  Promise((resolve, reject) => {
        fetch('/modalSendData', {
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
            console.log(data); // 파싱된 JSON 데이터 출력
            
        })
        .catch(error => {
            reject(error);
        });
    });
}
