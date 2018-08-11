import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import SignIn from './components/Signin/Signin';
import Register from './components/Register/Register';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'b03b75cf86f14b4fa085cb4deb260e9a'
})

const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

class App extends Component {
  state = {
    input: '',
    imageURL: '',
    box: {},
    route: 'signin',
    isSignedIn: false
  }

  componentDidMount() {
    fetch('http://localhost:5000/')
      .then(response => response.json())
      .then(console.log);
  }

  calculateFaceLocation = data => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box });
  }

  onInputChange = e => {
    this.setState({ input: e.target.value });
  }

  onSubmit = () => {
    this.setState({ imageURL: this.state.input });

    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input
    )
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;

    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        {
          route === 'home'
            ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm
                onSubmit={this.onSubmit}
                onInputChange={this.onInputChange} />
              <FaceRecognition
                box={box}
                imageURL={imageURL} />
            </div>
            : (route === 'signin')
              ? <SignIn onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />
        }
      </div >
    );
  }
}

export default App;
