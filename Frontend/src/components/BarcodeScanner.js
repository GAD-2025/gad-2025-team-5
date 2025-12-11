import React from 'react';
import { useZxing } from 'react-zxing';
// 힌트 설정도 다 빼버리고 'Try Harder(열심히 읽어라)' 하나만 남깁니다.
import { DecodeHintType, BarcodeFormat } from '@zxing/library';

const BarcodeScanner = ({ onScan }) => {
  const { ref } = useZxing({
    // 1. [핵심] 포맷 제한을 없앰 (다 읽게 함)
    // 대신 "TRY_HARDER" 옵션만 켜서 흐릿하거나 기울어진 것도 잘 잡게 설정
    hints: new Map([
      [DecodeHintType.TRY_HARDER, true],
      [DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A
      ]]
    ]),

    // 2. 0.3초 딜레이 (너무 빠르면 정신없음)
    timeBetweenDecodingAttempts: 300,

    // 3. 결과 전달
    onResult(result) {
      // 여기서 읽은 값을 그대로 부모(Register.js)에게 넘겨줍니다.
      // (짧은 5자리 숫자가 읽혀도 일단 넘깁니다. 거르는 건 부모가 합니다.)
      onScan(result.getText());
    },

    // 4. 카메라 설정 (가장 기본적이고 안정적인 설정)
    constraints: {
      video: {
        facingMode: "environment", // 후면 카메라
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    }
  });

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'black', position: 'relative', overflow: 'hidden' }}>
      {/* 화면 꽉 차게 */}
      <video ref={ref} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      
      {/* 가이드 박스 */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '80%', height: '130px', 
        border: '3px solid #00FF00', borderRadius: '10px',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)', zIndex: 10
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '5%', right: '5%', height: '2px', backgroundColor: 'red', opacity: 0.8 }}></div>
      </div>
      
      <p style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', color: 'white', fontWeight: 'bold', zIndex: 20, textShadow: '1px 1px 2px black' }}>
        바코드를 비춰주세요 (알아서 인식합니다)
      </p>
    </div>
  );
};

export default BarcodeScanner;

