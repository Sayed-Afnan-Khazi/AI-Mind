import React from 'react';
import './Register.css';

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			registerEmail: '',
			registerName: '',
			registerPassword: '',
			errorRegistering: false,
			missingFields: false
		};
	}

	onRegisterEmailChange = (event) => {
		this.setState({registerEmail: event.target.value})
	}
	onRegisterNameChange = (event) => {
		this.setState({registerName: event.target.value})
	}
	onRegisterPasswordChange = (event) => {
		this.setState({registerPassword: event.target.value})
	}
	onRegisterChange = () => {
		if (this.state.registerPassword.length===0 || this.state.registerName.length===0 || this.state.registerEmail.length===0) {
			this.setState({missingFields:true});
			return
		}
		fetch('https://ai-mind-api.onrender.com/register',{
			method: 'post',
			headers: {'Content-Type':'application/json'},
			body: JSON.stringify({
				name: this.state.registerName,
				email: this.state.registerEmail,
				password: this.state.registerPassword
			})
		})
		.then(response=>response.json())
		.then(user => {
			if (user.id) {
				console.log(user);
				this.props.loadUser(user);
				this.props.onRouteChange('home');
			} else {
				this.setState({errorRegistering:true});
			}
		});
	}
	render() {
		const { onRouteChange } = this.props; 
		return (
			<article className="register-form br2 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 center">
				<main className="pa4 black-80">
				  <div className="measure">
				    <fieldset id="register" className="ba b--transparent ph0 mh0">
				      <legend className="f2 fw6 ph0 mh0">Register</legend>
				      {this.state.missingFields && <p className='pa2 f6 b red br2'>Missing Fields</p>}
				      {this.state.errorRegistering && <p className='pa2 f6 b red br2'>Error Registering</p>}
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="name">Enter your Name</label>
				        <input onChange={this.onRegisterNameChange} className="pa2 input-reset ba bg-moon-gray hover-bg-black hover-white w-100" type="text" name="name"  id="name" />
				      </div>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Enter your Email</label>
				        <input onChange={this.onRegisterEmailChange} className="pa2 input-reset ba bg-moon-gray hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Enter your Password</label>
				        <input onChange={this.onRegisterPasswordChange} className="b pa2 input-reset ba bg-moon-gray hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
				      </div>
				    </fieldset>
				    <div className="">
				      <input onClick={this.onRegisterChange} className="b ph3 pv2 input-reset ba b--black bg-moon-gray grow pointer f6 dib" type="submit" value="Register" />
				    </div>
				    <div className="lh-copy mt3">
				      <p className="f6 link dim black db underline-hover pointer" onClick={() => onRouteChange('signin')} >Sign In</p>
				    </div>
				  </div>
				</main>
			</article>
		)
	}
}

export default Register;