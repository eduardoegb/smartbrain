import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = () => {
  return (
    <div>
      <p className="f3">
        {'This Magic Brain will detect faces in your pictures'}
      </p>
      <div className="form pa4 br3 shadow-5">
        <input className="fa4 pa2 w-70 center" type="text" />
        <button className="w-30 br2 f4 link ph3 pv2 dib white bg-light-purple">
          Detect
        </button>
      </div>
    </div>
  );
};

export default ImageLinkForm;
