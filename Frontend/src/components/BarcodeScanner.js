import React from 'react';
import { useZxing } from 'react-zxing';

const BarcodeScanner = ({ onScan }) => {
  const { ref } = useZxing({
    // ✅ 핵심: 제한 설정(hints)을 다 없애서 닥치는 대로 읽게 만듦
    onResult(result) {
      onScan(result.getText());
    },
    // 화질은 좋게 유지
    constraints: {
      video: {
        facingMode: "environment",
        width: { min: 1280, ideal: 1920 },
        height: { min: 720, ideal: 1080 }
      }
    }
  });

  return (
    <div style={{ width: '100%', height: '350px', overflow: 'hidden', position: 'relative', backgroundColor: 'black' }}>
      <video ref={ref} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {/* 디자인 유지 (빨간 가이드 박스) */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '80%', height: '120px', border: '3px solid #FF0000', borderRadius: '10px',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)', zIndex: 10
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '5%', right: '5%', height: '2px', backgroundColor: 'red', boxShadow: '0 0 4px red' }}></div>
      </div>
      <p style={{ position: 'absolute', bottom: '15px', width: '100%', textAlign: 'center', color: 'white', fontWeight: '600', zIndex: 20, textShadow: '1px 1px 2px black' }}>
        빨간 선을 바코드 가운데 맞춰주세요
      </p>
    </div>
  );
};

export default BarcodeScanner;

