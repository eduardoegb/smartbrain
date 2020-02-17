import React, { Component, Fragment } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

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
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false
    };
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log);
  // }

  calcBoxesLocations = data => {
    const image = document.getElementById('image');
    const width = Number(image.width);
    const height = Number(image.height);
    const clarifaiBoxes = data.outputs[0].data.regions.map(region => {
      // console.log(region.id);
      const clarifaiBox = region.region_info.bounding_box;
      return {
        leftCol: clarifaiBox.left_col * width,
        topRow: clarifaiBox.top_row * height,
        rightCol: width - clarifaiBox.right_col * width,
        bottomRow: height - clarifaiBox.bottom_row * height,
        id: region.id
      };
    });

    // data.outputs[0].data.regions[0].region_info.bounding_box;
    // console.log(clarifaiBoxes);
    return clarifaiBoxes;
  };

  displayBoxes = boxes => {
    this.setState({ boxes });
    // console.log('state: ', this.state.boxes);
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonClick = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input // 'https://samples.clarifai.com/face-det.jpg'
      )
      .then(response => this.displayBoxes(this.calcBoxesLocations(response)))
      .catch(error => console.log(error));
  };

  onRouteChange = route => {
    if (route === 'home') {
      this.setState({ isSignedIn: true });
    } else {
      this.setState({ isSignedIn: false });
    }
    this.setState({ route: route });
  };

  render() {
    return (
      <div className="App">
        <Particles params={particlesOptions} className="particles" />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={this.state.isSignedIn}
        />
        {this.state.route === 'home' ? (
          <Fragment>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonClick={this.onButtonClick}
            />
            <FaceRecognition
              imageUrl={this.state.imageUrl}
              boxes={this.state.boxes}
            />
          </Fragment>
        ) : this.state.route === 'signin' ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
