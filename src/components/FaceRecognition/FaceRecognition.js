import React from 'react';
import './FaceRecognition.css';
import BoundingBox from '../BoundingBox/BoundingBox';

const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className="ma">
      <div className="img-container">
        <img id="image" src={imageUrl} alt="Face recognition" />
        {boxes.map(box => {
          // console.log(box);
          return <BoundingBox box={box} key={box.id} />;
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
