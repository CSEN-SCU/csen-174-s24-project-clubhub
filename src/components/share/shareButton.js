import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const ShareButton = ({ postId, postUrl }) => {
  const [showQRCode, setShowQRCode] = useState(false);

  const handleShare = () => {
    setShowQRCode(!showQRCode);
  };

  const postLink = `${postUrl}/post/${postId}`;

  return (
    <div>
      <button onClick={handleShare}>
        {showQRCode ? 'Hide QR Code' : 'Share'}
      </button>
      {showQRCode && (
        <div>
          <p>Share this link:</p>
          <a href={postLink} target="_blank" rel="noopener noreferrer">
            {postLink}
          </a>
          <p>Or scan this QR code:</p>
          <QRCode value={postLink} />
        </div>
      )}
    </div>
  );
};

export default ShareButton;
