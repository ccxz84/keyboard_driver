import React, { useEffect, useRef, useState } from 'react';

interface VideoComponentProps {
  frameData: string | null; // base64 인코딩된 프레임 데이터
}

const VideoComponent: React.FC<VideoComponentProps> = ({ frameData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    // 부모 div의 크기를 업데이트하는 함수
    const updateCanvasSize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateCanvasSize(); // 초기 크기 설정
    window.addEventListener('resize', updateCanvasSize); // 창 크기 조절 시 업데이트

    return () => {
      window.removeEventListener('resize', updateCanvasSize); // 이벤트 리스너 정리
    };
  }, []);

  useEffect(() => {
    if (frameData && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 캔버스의 해상도를 부모 div의 크기로 설정
        canvasRef.current!.width = canvasSize.width;
        canvasRef.current!.height = canvasSize.height;

        // 이미지를 캔버스에 선명하게 그리기
        ctx?.clearRect(0, 0, canvasSize.width, canvasSize.height);
        ctx?.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
      };

      img.src = `data:image/jpeg;base64,${frameData}`;
    }
  }, [frameData, canvasSize]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default VideoComponent;