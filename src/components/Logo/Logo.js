import React from 'react';
import './Logo.css';
import { Tilt } from 'react-tilt';
import brain from './brain.png';

const Logo = () => {
	return (
		<div className='ma4 mt0 center'>
			<Tilt className='tilty br2 shadow-2' options={{max: 45,transformation:1}} style={{ height: 150, width: 150 }}>
		      <img src={brain} alt='logo' style={{paddingTop:'10px'}}/>
		    </Tilt>
		</div>
	)
}

export default Logo;