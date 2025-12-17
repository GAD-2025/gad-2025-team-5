import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const BarcodeScanner = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerIdRef = useRef(`scanner-${Date.now()}`);
  const html5QrCodeRef = useRef(null);
  const greenBoxRef = useRef(null);

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

        const qrboxFunction = (viewfinderWidth, viewfinderHeight) => {
          return {
            width: viewfinderWidth * 0.8,
            height: viewfinderHeight * 0.3
          };
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

  useEffect(() => {
    if (isScanning) {
      const timeoutId = setTimeout(() => {
        const cameraContainer = document.getElementById(scannerIdRef.current);
        const videoElement = cameraContainer ? cameraContainer.querySelector('video') : null;
        
        if (videoElement && greenBoxRef.current) {
          const cameraContainerRect = cameraContainer.getBoundingClientRect();
          const cameraRect = videoElement.getBoundingClientRect();
          const boxRect = greenBoxRef.current.getBoundingClientRect();

          console.log('--- Scanner Debug Info ---');
          console.log('Camera Container Coords:', cameraContainerRect);
          console.log('Camera View Coords (video element):', cameraRect);
          console.log('Green Box Coords:', boxRect);
          console.log('--------------------------');
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isScanning]);

  const scanBoxWidth = '80%';
  const scanBoxHeight = '30%';

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

      {/* 커스텀 오버레이 - 라이브러리 UI 위에 덮음 */}
      {isScanning && (
        <div
          ref={greenBoxRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: scanBoxWidth,
            height: scanBoxHeight,
            border: '3px solid #00FF00',
            borderRadius: '8px',
            boxSizing: 'border-box',
            boxShadow: '0 0 0 100vmax rgba(0, 0, 0, 0.6)',
            pointerEvents: 'none',
            zIndex: 100
          }}
        >
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
