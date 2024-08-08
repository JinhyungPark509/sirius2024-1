const tf = require('@tensorflow/tfjs-node');
const database = require('../database.js');
const { createCanvas, loadImage } = require('canvas');
const modelPath = 'tfjs_model(final)/model.json';

// 모델 불러오기
async function LoadModel() {
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    return model;
}
// 이미지 리사이즈 함수
async function resizeImage(imagePath) {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(256, 256);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, 256, 256);
    return canvas;
}
// 이미지를 텐서로 변환
async function LoadImageToTensor(imagePath) {
    // 이미지 리사이즈
    const resizedCanvas = await resizeImage(imagePath);
    const ctx = resizedCanvas.getContext('2d');
    
    const imageData = ctx.getImageData(0, 0, resizedCanvas.width, resizedCanvas.height).data;
    
    // 이미지 데이터를 4차원 배열로 변환 ([1, 256, 256, 3] 형태)
    const data = new Array(1).fill(0).map(() => {
        return new Array(256).fill(0).map(() => {
            return new Array(256).fill(0).map(() => [0, 0, 0]); // 빈 3차원 배열 생성
        });
    });

    // 이미지 데이터를 3차원 배열에 채우기
    for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 256; x++) {
            const offset = (y * resizedCanvas.width + x) * 4;
            data[0][y][x] = [imageData[offset] / 255, imageData[offset + 1] / 255, imageData[offset + 2] / 255];
        }
    }

    // 3차원 배열을 4차원 텐서로 변환 ([1, 256, 256, 3] 형태)
    const tensor = tf.tensor4d(data, [1, 256, 256, 3], 'float32'); // tf.tensor4d() 함수 사용하여 4차원 텐서 생성
    
    return tensor;
}

// 이미지를 모델에 전달하고 예측값 반환
async function PredictWithImage(imagePath) {
    const model = await LoadModel();
    const imageTensor = await LoadImageToTensor(imagePath);
    const predictions = model.predict(imageTensor);
    const predictedValues = predictions.dataSync(); // 예측값을 배열로 얻음
    return predictedValues;
}

// 이미지 파일 경로
const resultArr = ['정상', '균열', '철근노출', '백태누수'];
async function ProcessImageAndPredict(filePath) {
    try {
        const predictions = await PredictWithImage(filePath);
        const MaxValue = Math.max(...predictions);
        const index = predictions.indexOf(MaxValue);
        console.log('모델 예측 결과:', resultArr[index]);
        await ResultUpdate(filePath, resultArr[index]);

        
    } catch (error) {
        console.error('예측 중 오류 발생:', error);
    }
}
async function ResultUpdate(filePath, state){
    try{
        query = 'UPDATE image SET result = ? WHERE file_route = ?';
        values = [state, filePath];
        
        await database.Query(query, values);
    }
    catch(error){
        console.log(error);
    }
}
module.exports = {
    Predict: ProcessImageAndPredict
};
