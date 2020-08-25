let model = {}
model.userMic = []
model.classRoomID = []
model.collectionName = 'rooms'
model.rooms = undefined
model.currentUser = undefined
model.room = undefined
model.register = (data) => {
    firebase.auth().createUserWithEmailAndPassword(data.email.value, data.password.value)
        .then((res) => {
            firebase.auth().currentUser.updateProfile({
                displayName: data.lastName.value + data.firstName.value,
                photoURL: "https://firebasestorage.googleapis.com/v0/b/chat-app-bc2a8.appspot.com/o/user.png?alt=media&token=28e24cc2-86bd-43f8-aa54-2a62ef76650a"
            }).then(() => {
                let check = false
                data.isTeacher.value == 'true' ? check = true : check = false
                model.addFireStore("users", {
                    name: res.user.displayName,
                    email: res.user.email,
                    isTeacher: check,
                    password: data.password.value
                });
            })
            firebase.auth().currentUser.sendEmailVerification()
            alert("Congratulation! you have successfully registed\n please check your email to verify your account. ")
            view.setActiveScreen("login", data)
        })
        .catch(function(error) {
            console.log(error);
            controller.authenticate(error)
        });
}
model.login = (data) => {
    firebase.auth().signInWithEmailAndPassword(data.email.value, data.password.value)
        .then((res) => {
            if (!res.user.emailVerified) {

                alert('please verify your email')
            }

        })
        .catch(function(error) {
            console.log(error);
            controller.authenticate(error)
        });
}
model.initFirebaseStore = () => {
    return firebase.firestore()
}
model.getRoomInfo = async(id) => {
    let data = await model.initFirebaseStore().collection(model.collectionName).doc(`${id}`).get()
    return data.data()
}
model.getUserIntoRoom = async(idstream, currentRoomID) => {
    let data = await firebase.database().ref(`${currentRoomID}/` + idstream).once('value')
    console.log(data.val())
}
model.createRoom = async(room) => {
    await firebase.firestore().collection(model.collectionName).add(room)
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
    return snapshot.docs.map(doc => doc.data());
}