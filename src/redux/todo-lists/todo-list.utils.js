import firestore from '../../firebase/firebase.utils';

export const getAllLists = async () => {
	const todoLists = [];

	const listRef = firestore.collection('todoLists');
	const listSnapshot = await listRef.get();
	const listData = listSnapshot.docs;

	listData.forEach(list => {
		todoLists.unshift(list.data());
	});

	return todoLists;
};

export const getUserLists = user => {
	console.log(user);

	getAllLists().then(listData => {
		const userLists = listData.filter(list =>
			user.todoListIDs.includes(list.id)
		);

		return userLists;
	});
};
