import React, { useState, useEffect } from 'react';

import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';

import './contact.styles.scss';

const Contact = () => {
	const [state, setState] = useState({
		isLoaded: false
	});

	useEffect(() => {
		setTimeout(() => {
			setState({ isLoaded: true });
		}, 1000);
	});

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
						<div className='contact-photo'>
							<div
								id='nbernstein'
								className='contact-image'
								style={{
									backgroundImage: `url('http://drive.google.com/uc?export=view&id=1yIkygBaoW-YL6yN_47dV6WRW-NUQWQPQ')`
								}}
							></div>
						</div>
						<div className='contact-info'>
							<h2>Nick Bernstein</h2>
							<span>nbernstein@callutheran.edu</span>
						</div>
					</div>

					<div className='contact-card'>
						<div className='contact-photo'>
							<div
								id='sjohnson'
								className='contact-image'
								style={{
									backgroundImage: `url('http://drive.google.com/uc?export=view&id=1B4egLoQILOI_uLduHNlIcJ121BHPCy87')`
								}}
							></div>
						</div>
						<div className='contact-info'>
							<h2>Steven Johnson</h2>
							<span>stevenjohnson@callutheran.edu</span>
						</div>
					</div>
					<div className='contact-card'>
						<div className='contact-photo'>
							<div
								id='jobryan'
								className='contact-image'
								style={{
									backgroundImage: `url('http://drive.google.com/uc?export=view&id=15l-sd33mipMC2je1_8_wAI0JT595DmSn')`
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
