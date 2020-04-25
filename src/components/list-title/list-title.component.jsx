import React from 'react';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';

import './list-title.styles.scss';

class ListTitle extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "Today's Todos",
			editMode: false,
			titleChanged: false
		};
	}

	static getDerivedStateFromProps(props, state) {
		if (!props.currentUser) {
			return null;
		}

		if (props.listName !== state.title && !state.titleChanged) {
			return {
				title: props.listName
			};
		}
		return null;
	}

	componentDidMount() {
		if (this.state.title === undefined) {
			this.setState({
				title: "Today's Todos",
				editMode: false,
				titleChanged: false
			});
		}
	}

	handleChange = event => {
		this.setState({
			title: event.target.value
		});
	};

	handleClick = () => {
		if (this.state.title === '') {
			return;
		}

		this.setState(state => ({
			editMode: !state.editMode,
			titleChanged: true
		}));
	};

	keyPressHandler = event => {
		if (this.state.title === '') {
			return;
		}

		if (event.key === 'Enter') {
			this.setState({
				editMode: false
			});
		}
	};

	componentDidUpdate() {
		const { editMode, titleChanged } = this.state;
		const { currentUser } = this.props;
		if (editMode) {
			document.querySelector('#title-input').focus();
		} else if (currentUser && !editMode && titleChanged) {
			this.updateTitle();
		}
	}

	updateTitle = async () => {
		const { listID } = this.props;
		const listRef = firestore.doc(`todoLists/${listID}`);
		const listSnapshot = await listRef.get();

		if (listSnapshot.exists) {
			try {
				listRef
					.update({
						listName: this.state.title
					})
					.then(this.props.handleListName(this.state.title));
			} catch (error) {
				console.log('Error updating list name', error.message);
			}
		}
	};

	render() {
		const { title } = this.state;
		const listTitle = this.state.editMode ? (
			<input
				id='title-input'
				type='text'
				value={title}
				onBlur={this.handleClick}
				onChange={this.handleChange}
				onKeyPress={event => this.keyPressHandler(event)}
				maxLength='30'
				className={`${this.state.title ? 'filled' : 'empty'}`}
				placeholder='Feed me a title!'
			/>
		) : (
			<h1 className='title' onClick={this.handleClick}>
				{title ? (
					title
				) : (
					<div className='spinner-border text-secondary' role='status'>
						<span className='sr-only'>Loading...</span>
					</div>
				)}
				<span id='edit-title'>&#9998;</span>
			</h1>
		);

		return <div className='title-container'>{listTitle}</div>;
	}
}

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(ListTitle);
