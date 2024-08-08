import React, { useState } from "react";
import { Cookies } from "react-cookie";

const host = 'https://culiso.duckdns.org'; // 추후에 Let's Encrypt 와 같은 사이트에서 SSL 발급받아서 https로 접근해서 보안을 강화해야 함
const port = '443';
const url = host + "/";
const cookies = new Cookies();

export const MenuBarValue = () => {
    return new  Promise((resolve, reject) => {
        fetch(url + "MenuBarValue", {
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
            // 성공적으로 데이터를 받았을 때 처리
            // console.log("Result: ", data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

export const UserInfoValue = () => {
    return new  Promise((resolve, reject) => {
        const token = cookies.get("token");

        if (!token) {
            console.log("토큰 없음");
            return;
        }
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
        };

        fetch(url + "UserInfoValue", {
            method: 'POST',
            headers: headers,
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
            // console.log("UserInfoValue: ", data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

export const ContentsValue = (boardID) => {
    return new  Promise((resolve, reject) => {
        fetch(url + "ContentsValue", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ boardID })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 데이터로 응답을 파싱
        })
        .then(data => {
            console.log(data[0]);
            resolve(data);
            // 성공적으로 데이터를 받았을 때 처리
            // console.log("Result: ", data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

export const BoardContentsValue = (contentsNum) => {
    return new  Promise((resolve, reject) => {
        const token = cookies.get("token");

        if (!token) {
            console.log("토큰 없음");
            return;
        }
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
        };

        fetch(url + "BoardContentsValue", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ contentsNum })
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
            // console.log("Result: ", data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

export const CommentSelectValue = (contentsNum) => {
    return new  Promise((resolve, reject) => {
        fetch(url + "CommentSelectValue", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contentsNum })
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
            // console.log("Result: ", data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

export const CommentInsertValue = (comment, contentsNum) => {
    return new  Promise((resolve, reject) => {
        const token = cookies.get("token");

        if (!token) {
            console.log("토큰 없음");
            return;
        }
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
        };

        fetch(url + "CommentInsertValue", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ comment, contentsNum })
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
            // console.log("Result: ", data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

export const CommentDeleteValue = (commentNum) => {
    return new  Promise((resolve, reject) => {
        const token = cookies.get("token");

        if (!token) {
            console.log("토큰 없음");
            return;
        }
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
        };

        fetch(url + "CommentDeleteValue", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ commentNum })
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
            // console.log("Result: ", data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

export const PrevPageValue = (contentsNum) => {
    return new  Promise((resolve, reject) => {
        fetch(url + "PrevPageValue", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contentsNum })
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

export const CheckBoard = () => {
    return new  Promise((resolve, reject) => {
        fetch(url + "CheckBoard", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
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

export const ContentsControl = (path, formData) => {
    return new  Promise((resolve, reject) => {
        const token = cookies.get("token");

        if (!token) {
            console.log("토큰 없음");
            return;
        }
        const headers = {
            "Authorization": `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
        };

        console.log(path);
        console.log(formData);

        fetch(url + path, {
            method: 'POST',
            headers: headers,
            body: formData
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

export const ContentsDeleteValue = (contentsNum) => {
    return new  Promise((resolve, reject) => {
        fetch(url + "ContentsDeleteValue", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contentsNum })
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
            // console.log("Result: ", data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

export const RecommendClicked = (check, contentsNum) => {
    return new  Promise((resolve, reject) => {
        const token = cookies.get("token");

    if (!token) {
        console.log("토큰 없음");
        return;
    }
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
    };

        fetch(url + "RecommendClicked", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ check, contentsNum })
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

export const IncrementViews = (contentsNum) => {
    return new  Promise((resolve, reject) => {
        const token = cookies.get("token");

        if (!token) {
            console.log("토큰 없음");
            return;
        }
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
        };

        fetch(url + "IncrementViews", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ contentsNum })
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