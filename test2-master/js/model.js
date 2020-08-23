let model = {}
model.userMic = []
model.classRoomID = []
model.collectionName = 'rooms'
model.rooms = undefined
model.currentUser = undefined
model.login = async(email, password) => {
    try {
        const response = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);
    } catch (err) {
        view.errorMessage("password-error", err.message);
    }
};
model.initFirebaseStore = () => {
    return firebase.firestore()
}
model.getRoomInfo = async(id) => {
    let data = await model.initFirebaseStore().collection(model.collectionName).doc(`${id}`).get()
    return data.data()
}
model.getUserIntoRoom = async(idstream, currentRoomID) => {
    let data = await firebase.database().ref(`${currentRoomID}/` + idstream).once('value')
    return data.val()
}
model.createRoom = (room) => {
    firebase.firestore().collection(model.collectionName).add(room)

}
model.loadRooms = async() => {
    const response = await firebase.firestore().collection(model.collectionName).get()
    model.rooms = getDataFromDocs(response.docs)

    view.showRooms()
}

model.listenRoomChange = () => {
    model.initFirebaseStore().collection('rooms').onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                model.classRoomID.push({
                    fireBaseID: change.doc.id,
                    roomToken: change.doc.data().roomToken,
                    roomUUID: change.doc.data().roomUUID,
                    channel: change.doc.data().channel,
                    host: change.doc.data().host
                })
                view.addNewRoom(change.doc.id, change.doc.data())
                console.log("New city: ", change.doc.data());
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());

            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }
        });
    });
}

model.addUserToRoom = (id, currentRoomID) => {
    let ref = firebase.database().ref(`${currentRoomID}/` + id);
    ref.set({
        name: firebase.auth().currentUser.displayName,
        email: model.currentUser.email,
        onMic: true
    });
    ref.onDisconnect().remove();
}


model.removeUserInRoom = (id, currentRoomID) => {
    firebase.database().ref(`${currentRoomID}/` + id).remove();
}
model.getDoc = async() => {
    const snapshot = await firebase.firestore().collection(model.collectionName).get()
    return snapshot.docs.map(doc => doc.data().host);
}