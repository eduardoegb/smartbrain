import React, { Component, Fragment } from 'react';
import './App.css';
import Particles from 'react-particles-js';
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

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = user => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined
      }
    });
  };

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
    fetch('https://intense-bayou-66663.herokuapp.com/image', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://intense-bayou-66663.herokuapp.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count =>
              this.setState(Object.assign(this.state.user, { entries: count }))
            )
            .catch(console.log);
        }
        this.displayBoxes(this.calcBoxesLocations(response));
      })
      .catch(error => console.log(error));
  };

  onRouteChange = route => {
    if (route === 'home') {
      this.setState({ isSignedIn: true });
    } else {
      this.setState(initialState);
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
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
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
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;
