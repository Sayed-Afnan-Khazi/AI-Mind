import React from 'react';
import './SignIn.css';

class SignIn extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			signInEmail:'',
			signInPassword:'',
			errorLoggingIn: false,
			missingFields: false,
		}
	}

	onEmailChange = (event) => {
		this.setState({signInEmail:event.target.value})
	}

	onPasswordChange = (event) => {
		this.setState({signInPassword:event.target.value})
	}

	onSubmitChange = () => {
		if (this.state.signInPassword.length===0 || this.state.signInEmail.length===0) {
			this.setState({missingFields:true});
			return
		}
		fetch('https://ai-mind-api.onrender.com/signin',{
			method:'post',
			headers: {'Content-Type':'application/json'},
			body: JSON.stringify({
				email: this.state.signInEmail,
				password:this.state.signInPassword
			})
		}).then(response=>response.json())
		.then(data => {
			if (data.email===this.state.signInEmail) {
				this.props.loadUser(data)
				this.props.onRouteChange('home');
			} else {
				this.setState({errorLoggingIn:true});
			}
		})
		
	}
	onEnterKey = (event) => {
		if (event.charCode === 13) {
			this.onSubmitChange();
		}
	}

	render() {
		const {onRouteChange} = this.props;
		return (
			<article className="signin-form br2 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 center">
				<main className="pa4 black-80">
				  <div className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f2 fw6 ph0 mh0">Sign In</legend>
				      {this.state.errorLoggingIn && <p className='pa2 f6 b red br2'>Error Logging In</p>}
				      {this.state.missingFields && <p className='pa2 f6 b red br2'>Missing Fields</p>}
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-moon-gray hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input onChange={this.onPasswordChange} onKeyPress={this.onEnterKey} className="b pa2 input-reset ba bg-moon-gray hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
				      </div>
				    </fieldset>
				    <div className="">
				      <input onClick={this.onSubmitChange} className="b ph3 pv2 input-reset ba b--black bg-moon-gray grow pointer f6 dib" type="submit" value="Sign in" />
				    </div>
				    <div className="lh-copy mt3">
				      <p className="f6 link dim black db underline-hover pointer" onClick={() => onRouteChange('register')} >Register</p>
				    </div>
				  </div>
				</main>
			</article>
		)
	}
}

export default SignIn;