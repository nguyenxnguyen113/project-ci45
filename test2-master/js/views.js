var sdkToken = "NETLESSSDK_YWs9Y1ZfQlRBMEcxekc5S19NbiZub25jZT0xNTk3NjEwMTAxNDE2MDAmcm9sZT0wJnNpZz1lMjU0MTQ4MWQzZDhhOTUyYTEzYTMxOTE2YjI5ZjNlMWMxYmU3NjYxNTZjOWFkNGI1M2U4OGRlOTRmZDQ2MDJm";
let uuid = 'namdaica123'
var url = `https://cloudcapiv4.herewhite.com/room?token=${sdkToken}&uuid=${uuid}`;
var requestInit = {
    method: 'POST',
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({
        name: "room name",
        limit: 0, // Limit on the number of rooms
        mode: "persistent", // Normal room, unable to play back
        // mode: "historied"， // Playback room
    }),
};
let view = {}
view.count = 0;
view.setActiveScreen = async(screen, id) => {
    switch (screen) {
        case 'loginScreen':
            {
                document.getElementById("app").innerHTML = components.loginScreen;
                const loginForm = document.getElementById("login-form");
                loginForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    const data = {
                        password: {
                            value: loginForm.password.value,
                            name: "password",
                            id: "password-error",
                        },
                        email: {
                            value: loginForm.email.value.trim(),
                            name: "email",
                            id: "email-error",
                        },
                    };
                    controller.Validate(data);
                });
                const redirectToLogin = document.getElementById("redirect-to-register");
                redirectToLogin.addEventListener("click", () => {
                    view.setActiveScreen("registerScreen");
                });
                break;
            }
        case 'selectRoomScreen':
            {
                // in ra man login
                document.getElementById('app').innerHTML = components.selectRoomScreen
                document.querySelector('.new-room-bnt').addEventListener('click', () => {
                    view.setActiveScreen('createRoomScreen')
                })
                const logOut = document.querySelector('.log-out-bnt')
                logOut.addEventListener('click', (e) => {
                    e.preventDefault()
                    firebase.auth().signOut().then(() => {
                        console.log('user signed out')
                        view.setActiveScreen('loginScreen')
                    })
                })
                console.log(model.currentUser.email)
                const response = await firebase.firestore().collection(model.collectionName).get()
                roomSearch = getDataFromDocs(response.docs)
                const searchBar = document.getElementById('myInput')
                searchBar.addEventListener('keyup', (e) => {
                    const searchString = e.target.value.toLowerCase();

                    const filteredCharacters = roomSearch.filter((character) => {
                        return (
                            character.title.toLowerCase().includes(searchString)
                        );
                    });
                    for (let index = 0; index < roomSearch.length; index++) {
                        view.getRooms(filteredCharacters[index])
                    }
                });
                break;

            }
        case 'createRoomScreen':
            {
                document.getElementById('app').innerHTML = components.createRoomScreen
                document.getElementById('back-to-chat').addEventListener('click', () => {
                    view.setActiveScreen('selectRoomScreen')
                    model.loadRooms()
                })

                const createRoomForm = document.getElementById('create-conversation-form')
                createRoomForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    fetch(url, requestInit).then(function(response) {
                        return response.json();
                    }).then(function(json) {
                        teacher = true
                        console.log(json)
                        const data = {
                            channel: createRoomForm.chanelName.value,
                            host: model.currentUser.email,
                            name: createRoomForm.roomName.value,
                            roomToken: json.msg.roomToken,
                            roomUUID: json.msg.room.uuid,
                            title: createRoomForm.roomTtitle.value,
                            createdAt: new Date().toLocaleString(),
                            password: createRoomForm.passwordRoom.value
                        }
                        model.loadRooms()
                        model.createRoom(data)
                    }).catch(function(err) {
                        console.error(err);
                    });
                })
                break;
            }
        case 'classRoomScreen':
            {
                document.getElementById("app").innerHTML = components.classRoomScreen;
                let signOutBnt = document.getElementById('sign-out')
                let inputChat = document.getElementById('input-chat')
                let roomInfo = await model.getRoomInfo(id)

                let room = await agora.initWhiteBoardAndJoinRoom(roomInfo)

                agora.addEventListenerToolBoard(room, roomInfo)

                roomInfo.host == firebase.auth().currentUser.email ?
                agora.joinChannel(roomInfo.channel, true) : agora.joinChannel(roomInfo.channel, false)
                agora.RtmLogin(firebase.auth().currentUser.displayName, roomInfo.channel)

                if (view.count > 0) {
                    agora.RtmCreateAndJoinChannel(roomInfo.channel)
                }
                inputChat.addEventListener('keyup', (e) => {
                    if (e.keyCode == "13") {
                        agora.RtmSendMessageToChannel(inputChat.value)
                        view.addMessage(firebase.auth().currentUser.displayName, inputChat.value)
                        console.log('send');
                        inputChat.value = ""
                    }
                })
                signOutBnt.addEventListener('click', () => {
                    console.log('leave');
                    agora.client.unpublish(agora.localStreams.camera.stream)
                    agora.client.off("stream-published")
                    agora.client.off("stream-added")
                    agora.client.off('stream-subscribed')
                    agora.client.leave()
                    agora.RtmLeaveChannel()
                    agora.remoteStreams = []
                    room.disconnect().then(function() {
                        console.log("Leave room success");
                        model.loadRooms()
                    });
                    model.removeUserInRoom(agora.localStreams.camera.id, model.currentRoomID)
                    agora.localStreams.camera.stream.close()
                    view.setActiveScreen('selectRoomScreen')
                })
                view.count++
            }
    }
}


view.errorMessage = (id, message) => {
    document.getElementById(id).innerText = message;
};
view.showRooms = () => {
    for (oneRoom of model.rooms) {
        view.addNewRoom(oneRoom)
    }
}

view.addNewRoom = (room) => {
    const roomWrapper = document.createElement('div')
    roomWrapper.className = 'room-bar'
    roomWrapper.id = room.id
    roomWrapper.innerHTML = `
    <div class="room-id">ID: ${room.id}</div>
    <div class="room-host">Host: ${room.host}</div>
    
    <div class="room-title">Title: ${room.title}</div>
    <div class="room-createAt">Created At: ${room.createdAt}</div>
`
    document.querySelector(".room-list").appendChild(roomWrapper)

    let joinRoom = document.getElementById(roomWrapper.id)
    joinRoom.addEventListener('click', async() => {
        var person = prompt("Please enter password");
        if (person === room.password) {
            model.currentRoomID = room.id
            view.setActiveScreen('classRoomScreen', room.id)
        } else {
            alert('Join failed')
        }
    })
}

view.addMessage = (senderId, text) => {
    let messageContainer = document.getElementById('message-container')
    let html = `
        <div class="RTM-message">${senderId}: ${text}</div>
    `
    messageContainer.insertAdjacentHTML('beforeend', html)
}
view.getRooms = (data) => {
    let listRooms = document.querySelector('.room-list')
    let html = `
<div class="room-bar" id="${data.id}">
    <div class="room-id">ID: ${data.id}</div>
    <div class="room-host">Host: ${data.host}</div>
    <div class="room-title">Title: ${data.title}</div>
    <div class="room-createAt">Created At: ${data.createdAt}</div>
</div>
    `
    listRooms.innerHTML = html;
    let joinRoom = document.getElementById(data.id)
    joinRoom.addEventListener('click', async() => {
        var person = prompt("Please enter your name", "Harry Potter");
        if (person === data.password) {
            model.currentRoomID = data.id
            view.setActiveScreen('classRoomScreen', data.id)
        } else {
            alert('Join failed')
        }

    })
}