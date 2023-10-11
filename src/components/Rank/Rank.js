import React from 'react';

const Rank = ({ user }) => {
	return (
		<div className='rank'>
			<div className='dark-pink f3'>
				{ user.name + ', your current entry count is...'}
			</div>
			<div className='dark-pink f1'>
				{ user.entries }
			</div>
		</div>
	)
}

export default Rank;