const fs = require('fs');

// 파일 경로 입력받기
const filePath1 = './case10/1.txt';
const filePath2 = './case10/2.txt';

// 시간 차이 계산 및 파일 저장 함수
function processFile(filePath, outputFilePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject('Error reading the file: ' + err);
                return;
            }

            const timeData = data.trim().split('\n').map(line => {
                const [time] = line.split(' ');
                return parseFloat(time);
            });

            const startTime = timeData[0];
            const timeDifferences = timeData.map(time => (time - startTime).toFixed(6));

            fs.writeFile(outputFilePath, timeDifferences.join('\n'), (err) => {
                if (err) {
                    reject('Error writing the file: ' + err);
                    return;
                }
                resolve(timeDifferences);
            });
        });
    });
}

// 두 파일 처리 후 차이 계산
Promise.all([
    processFile(filePath1, './output1.txt'),
    processFile(filePath2, './output2.txt')
]).then(results => {
    const [timeDiffs1, timeDiffs2] = results;
    const differences = timeDiffs1.map((time, index) => (parseFloat(time) - parseFloat(timeDiffs2[index])).toFixed(6));
    
    fs.writeFile('./differences.txt', differences.join('\n'), (err) => {
        if (err) {
            console.error('Error writing the differences file:', err);
            return;
        }
        console.log('Differences file created successfully.');
    });
}).catch(error => {
    console.error(error);
});