import React from 'react';
import './WordCloud.css'

const WordCloud = ({ imageUrl, wordCloudUrl }) => {
	return (
		<div className='center ma'>
			<div className='center absolute mt2'>
				{ imageUrl && <img id='inputimage' className='input-img' alt='' src={imageUrl} /> }
				<div className='bg-brain ml3 bg-white'>
					{ wordCloudUrl && <img id='wordCloudImage' className='word-cloud-img'alt='' src={wordCloudUrl} /> }
				</div>
			</div>
		</div>
	)
}

export default WordCloud;