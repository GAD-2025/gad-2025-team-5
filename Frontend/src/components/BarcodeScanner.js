import React, { useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useZxing } from 'react-zxing';

const BarcodeScanner = ({ onScan }) => {
  const { ref } = useZxing({
    onResult(result) {
      onScan(result.getText());
    },
  });

  return (
    <div>
      <video ref={ref} />
    </div>
  );
};

export default BarcodeScanner;
