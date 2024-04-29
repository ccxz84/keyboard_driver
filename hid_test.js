const fs = require('fs');

// 파일 읽기를 위한 비동기 함수
async function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data.split('\n').filter(line => line)); // 파일을 줄별로 분리하고, 비어있는 줄 제거
        });
    });
}

function extractDataValue(line) {
    const match = line.split('Data: ')[1];
    console.log(line.split('Data: '));
    if (match) {
        // 공백으로 분리하여 각 값을 두 자리로 만들고, 캐리지 리턴 문자 제거
        const values = match.split(' ').map(val => val.replace('\r', '').padStart(2, '0'));
        // 연결하여 전체 결과를 16자리 문자열로 포맷팅
        return values.join('').padEnd(16, '0');
    }
    return null;
}



// 두 파일을 비교하는 함수
async function compareFiles(keylogFilePath, saveDataFilePath, resultFilePath) {
    try {
        const keylogData = await readFile(keylogFilePath);
        const saveData = await readFile(saveDataFilePath);

        // save_data.txt에서 'Data:' 값을 추출하고 연결, 대문자로 변환
        const processedSaveData = saveData.map(extractDataValue).map(value => value.toUpperCase());
        const customKeylogData = keylogData.map(val => val.replace('\r', ''));

        // 불일치하는 항목을 찾아 결과 문자열로 저장
        let result = "";
        customKeylogData.forEach((value, index) => {
            if (value.toUpperCase() !== processedSaveData[index]) {
                result += `불일치 발견: 위치 ${index + 1}, keylog 값: ${value}, saveData 값: ${processedSaveData[index]}\n`;
            }
        });

        // 결과를 result.txt 파일에 쓰기
        fs.writeFileSync(resultFilePath, result);
        console.log(`결과가 ${resultFilePath} 파일에 저장되었습니다.`);
    } catch (err) {
        console.error('파일 처리 중 오류가 발생했습니다:', err);
    }
}

// 파일 비교 실행
compareFiles('keylog.txt', 'save_data.txt', 'result.txt');