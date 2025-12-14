import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const BarcodeScanner = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerIdRef = useRef(`scanner-${Date.now()}`);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    const scannerId = scannerIdRef.current;
    let stopped = false;

    const startScanner = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));

      if (stopped) return;

      const existingElement = document.getElementById(scannerId);
      if (existingElement) {
        existingElement.innerHTML = '';
      }

      const html5QrCode = new Html5Qrcode(scannerId);
      html5QrCodeRef.current = html5QrCode;

      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          throw new Error('No camera found');
        }

        // 스캔 영역을 넓게 설정 (인식률 향상)
        const qrboxFunction = (viewfinderWidth, viewfinderHeight) => {
          const boxWidth = Math.floor(viewfinderWidth * 0.9);
          const boxHeight = Math.floor(viewfinderHeight * 0.5);
          console.log(`📐 Viewfinder: ${viewfinderWidth}x${viewfinderHeight}, QRBox: ${boxWidth}x${boxHeight}`);
          return { width: boxWidth, height: boxHeight };
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: qrboxFunction,
            disableFlip: false,
            formatsToSupport: [
              0,  // QR_CODE
              4,  // EAN_13 (ISBN)
              3,  // EAN_8
              7,  // UPC_A
              8,  // UPC_E
              2,  // CODE_128
              1,  // CODE_39
            ],
          },
          (decodedText) => {
            console.log('✅ Barcode scanned:', decodedText);
            stopped = true;
            const scanner = html5QrCodeRef.current;
            if (scanner && scanner.isScanning) {
              scanner.stop()
                .then(() => {
                  html5QrCodeRef.current = null;
                  onScan(decodedText);
                })
                .catch(() => {
                  html5QrCodeRef.current = null;
                  onScan(decodedText);
                });
            } else {
              onScan(decodedText);
            }
          },
          () => {}
        );

        if (!stopped) {
          setIsScanning(true);
          setError(null);
          console.log('📷 Scanner started');
        }
      } catch (err) {
        console.error('❌ Scanner error:', err);
        setError(err.message || 'Camera access failed');
      }
    };

    startScanner();

    return () => {
      stopped = true;
      const scanner = html5QrCodeRef.current;
      if (scanner) {
        if (scanner.isScanning) {
          scanner.stop()
            .then(() => scanner.clear())
            .catch(() => {});
        } else {
          try {
            scanner.clear();
          } catch (e) {}
        }
        html5QrCodeRef.current = null;
      }
    };
  }, [onScan]);

  // 바코드 스캔 영역 크기 (가로로 긴 직사각형)
  const scanBoxWidth = '75%';
  const scanBoxHeight = '80px';

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 스캐너 비디오 영역 */}
      <div
        id={scannerIdRef.current}
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      {/* 커스텀 오버레이 - 라이브러리 UI 위에 덮음 */}
      {isScanning && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 100
        }}>
          {/* 상단 어두운 영역 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `calc(50% - ${parseInt(scanBoxHeight)/2}px)`,
            backgroundColor: 'rgba(0,0,0,0.6)'
          }} />

          {/* 하단 어두운 영역 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `calc(50% - ${parseInt(scanBoxHeight)/2}px)`,
            backgroundColor: 'rgba(0,0,0,0.6)'
          }} />

          {/* 중간 행: 좌측 어두운 + 투명 스캔영역 + 우측 어두운 */}
          <div style={{
            position: 'absolute',
            top: `calc(50% - ${parseInt(scanBoxHeight)/2}px)`,
            left: 0,
            right: 0,
            height: scanBoxHeight,
            display: 'flex'
          }}>
            {/* 좌측 어두운 */}
            <div style={{
              flex: `0 0 calc((100% - ${scanBoxWidth}) / 2)`,
              backgroundColor: 'rgba(0,0,0,0.6)'
            }} />

            {/* 스캔 영역 (투명 + 테두리) */}
            <div style={{
              flex: `0 0 ${scanBoxWidth}`,
              border: '3px solid #00FF00',
              borderRadius: '8px',
              boxSizing: 'border-box',
              position: 'relative'
            }}>
              {/* 스캔 라인 */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '5%',
                right: '5%',
                height: '2px',
                backgroundColor: '#FF0000',
                transform: 'translateY(-50%)'
              }} />
            </div>

            {/* 우측 어두운 */}
            <div style={{
              flex: `0 0 calc((100% - ${scanBoxWidth}) / 2)`,
              backgroundColor: 'rgba(0,0,0,0.6)'
            }} />
          </div>
        </div>
      )}

      {/* 안내 텍스트 */}
      <p style={{
        position: 'absolute',
        bottom: '20px',
        width: '100%',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        zIndex: 101,
        textShadow: '1px 1px 2px black',
        margin: 0,
        fontSize: '14px'
      }}>
        {error ? `오류: ${error}` : isScanning ? '바코드를 초록색 영역에 맞춰주세요' : '카메라 로딩 중...'}
      </p>

      {/* 라이브러리 기본 UI 숨기기 */}
      <style>{`
        #${scannerIdRef.current} video {
          object-fit: cover !important;
        }
        #${scannerIdRef.current} #qr-shaded-region {
          display: none !important;
        }
        #${scannerIdRef.current} svg {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;
