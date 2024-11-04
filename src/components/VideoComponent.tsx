// src/components/VideoComponent.tsx
import React, { useEffect, useRef, useState } from 'react';

const { ipcRenderer } = window.require('electron');

const VideoComponent: React.FC = () => {
    const [frameData, setFrameData] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {
      // Electron에서 비디오 프레임 수신
      ipcRenderer.on('stream-video-frame', (_, data) => {
        // console.log('Received frame data:', data);

        if (data.frame && data.frame.array && data.frame.array[0]) {
            // Uint8Array to Base64
            const uint8Array = new Uint8Array(data.frame.array[0]);
            const base64String = Buffer.from(uint8Array).toString('base64');
            setFrameData(base64String);
        } else {
            console.error('Invalid frame data format');
        }
        });

        // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
        return () => {
            ipcRenderer.removeAllListeners('stream-video-frame');
        };
    }, []);
  
    useEffect(() => {
      if (frameData && canvasRef.current) {
        console.log("a435sdfasdf")
        const ctx = canvasRef.current.getContext('2d');
        const img = new Image();
  
        img.onload = () => {
          // 화면을 캔버스에 꽉 차게 그림
          ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx?.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
        };
  
        img.src = `data:image/jpeg;base64,${frameData}`; // assuming frame is a base64 string
      }
    }, [frameData]);
  
    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
      </div>
    );
};

export default VideoComponent;
