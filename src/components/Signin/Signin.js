import React from 'react';

class Signin extends React.Component {
  state = {
    email: '',
    password: ''
  }

  onEmailChange = e => this.setState({ email: e.target.value });
  onPasswordChange = e => this.setState({ password: e.target.value });

  onSubmitSignIn = () => {
    fetch('http://localhost:5000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(resp => resp.json())
      .then(data => {
        if (data === 'success') {
          this.props.onRouteChange('home');
        }
      })
      .catch(console.log);
  }

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f2 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  onChange={this.onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  onChange={this.onPasswordChange}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in" />
            </div>
            <div className="lh-copy mt3">
              <a
                onClick={() => onRouteChange('register')}
                href="#0" className="f6 link dim black db pointer">
                Register
            </a>
            </div>
          </div>
        </main>
      </article>
    );
  }
};

export default Signin;