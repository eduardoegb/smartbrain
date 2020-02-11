import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 150
      }
    }
  }
};

const app = new Clarifai.App({
  apiKey: '46e98c96ede3413ab38c38aeb41fd015'
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: ''
    };
  }

  onInputChange = event => {
    // console.log(event.target.value);

    this.setState({ input: event.target.value });
  };

  onButtonClick = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
        // 'https://samples.clarifai.com/face-det.jpg'
      )
      .then(
        function(response) {
          const { regions } = response.outputs[0].data;
          regions.forEach(region => {
            console.log(region.region_info.bounding_box);
          });
        },
        function(err) {
          // there was an error
        }
      );
  };

  render() {
    return (
      <div className="App">
        <Particles params={particlesOptions} className="particles" />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonClick={this.onButtonClick}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
