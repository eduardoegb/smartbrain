import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl }) => {
  return (
    <div className="ma">
      <div className="imgContainer">
        <img src={imageUrl} alt="Face recognition" />
      </div>
    </div>
  );
};

export default FaceRecognition;
