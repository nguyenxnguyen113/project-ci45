let init = () => {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyB-GTJb8eYa945i34u-rOvedSTYaQUIzqg",
        authDomain: "chat-6bc04.firebaseapp.com",
        databaseURL: "https://chat-6bc04.firebaseio.com",
        projectId: "chat-6bc04",
        storageBucket: "chat-6bc04.appspot.com",
        messagingSenderId: "71368848088",
        appId: "1:71368848088:web:c3182f74002be640a19dad"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if (user.emailVerified) {
                model.currentUser = {
                    displayName: user.displayName,
                    email: user.email,
                };
                view.setActiveScreen("selectRoomScreen");
                model.loadRooms()
            } else {
                view.setActiveScreen("loginScreen");
                alert("please verify your email");
            }
        } else {
            view.setActiveScreen("loginScreen");
        }
    });
}

window.onload = init
getDataFromDoc = (doc) => {
    const data = doc.data()
    data.id = doc.id
    return data
}
getDataFromDocs = (docs) => {
    return docs.map(item => getDataFromDoc(item))
        // for (let index = 0; index < listData.length; index++) {
        //     const element = getDataFromDoc(docs[index])
        //     listData.push(element)
        // }
        // return listData;

}