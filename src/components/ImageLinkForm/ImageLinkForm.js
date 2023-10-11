import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ( { changeFunction, submitFunction } ) => {
	return (
		<div className='imageLinkForm'>
			<p className='f4 near-white'>
				{"This AI will show you what its mind looks like when you show it an image. Give it a try."}
			</p>
			<div className='center'>
				<div className='form center pa4 br3 shadow-5'>
					<input onChange={changeFunction} className='f4 pa3 ma2 w-70 center' type='text' placeholder='Enter your image link here' />
					<button onClick={submitFunction} className='f4 pa3 ma2 w-30 grow div dib pv2 ph3 white bg-light-blue' type='submit'>Send to AI</button>
				</div>
			</div>
		</div>
	)
}

export default ImageLinkForm;