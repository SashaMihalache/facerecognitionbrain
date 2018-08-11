import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
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
    imageURL: ''
  }

  onInputChange = e => {
    this.setState({ input: e.target.value });
  }

  onSubmit = () => {
    this.setState({ imageURL: this.state.input });

    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, this.state.input
    ).then((response) => {
      console.log(response.outputs[0].data.regions[0].region_info);
    },
      (err) => {
        console.log(err);
      }
    );
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onSubmit={this.onSubmit}
          onInputChange={this.onInputChange} />
        <FaceRecognition imageURL={this.state.imageURL} />
      </div >
    );
  }
}

export default App;
