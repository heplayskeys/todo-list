import React, { useState, useEffect, useRef } from 'react';

import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';

import './contact.styles.scss';

const Contact = () => {
	const imagesLoaded = useRef(false);

	const [state, setState] = useState({
		isLoaded: false
	});

	const contactImages = {
		nbernstein:
			'http://drive.google.com/uc?export=view&id=1yIkygBaoW-YL6yN_47dV6WRW-NUQWQPQ',
		sjohnson:
			'http://drive.google.com/uc?export=view&id=1B4egLoQILOI_uLduHNlIcJ121BHPCy87',
		jobryan:
			'http://drive.google.com/uc?export=view&id=15l-sd33mipMC2je1_8_wAI0JT595DmSn'
	};

	useEffect(() => {
		if (state.isLoaded && !imagesLoaded.current) {
			setTimeout(() => {
				imagesLoaded.current = true;
				setState({
					isLoaded: true
				});
			});
		} else {
			setTimeout(() => {
				setState({
					isLoaded: true
				});
			}, 1000);
		}
	}, [state.isLoaded]);

	return (
		<div>
			{!state.isLoaded ? <LoadingSpinner message='contactPage' /> : null}
			<div
				className='contact-page-container'
				style={
					state.isLoaded ? { visibility: 'visible' } : { visibility: 'hidden' }
				}
			>
				<div className='contact-title'>
					<h1>Who Are We?</h1>
				</div>
				<div className='contact-card-container'>
					<div className='contact-card'>
						<div
							className='contact-photo'
							style={{ opacity: imagesLoaded.current ? 1 : 0 }}
						>
							<div
								id='nbernstein'
								className='contact-image'
								style={{
									backgroundImage: `url(${contactImages['nbernstein']})`
								}}
							></div>
						</div>
						<div className='contact-info'>
							<h2>Nick Bernstein</h2>
							<span>nbernstein@callutheran.edu</span>
						</div>
					</div>

					<div className='contact-card'>
						<div
							className='contact-photo'
							style={{ opacity: imagesLoaded.current ? 1 : 0 }}
						>
							<div
								id='sjohnson'
								className='contact-image'
								style={{
									backgroundImage: `url(${contactImages['sjohnson']})`
								}}
							></div>
						</div>
						<div className='contact-info'>
							<h2>Steven Johnson</h2>
							<span>stevenjohnson@callutheran.edu</span>
						</div>
					</div>
					<div className='contact-card'>
						<div
							className='contact-photo'
							style={{ opacity: imagesLoaded.current ? 1 : 0 }}
						>
							<div
								id='jobryan'
								className='contact-image'
								style={{
									backgroundImage: `url(${contactImages['jobryan']})`
								}}
							></div>
						</div>
						<div className='contact-info'>
							<h2>Jacob O'Bryan</h2>
							<span>jobryan@callutheran.edu</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contact;
