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
                document.querySelector('.create-room .btn').addEventListener('click', () => {
                    view.setActiveScreen('createRoomScreen')
                })
                break;
            }
        case 'createRoomScreen':
            {
                document.getElementById('app').innerHTML = components.createRoomScreen
                document.getElementById('back-to-chat').addEventListener('click', () => {
                    view.setActiveScreen('selectRoomScreen')
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

view.addNewRoom = (room, data) => {
    const roomTable = document.createElement('tr')
    roomTable.id = room.id
    roomTable.innerHTML = `
    <td>${room.id}</td>
    <td>${room.host}</td>
    <td>${room.name}</td>
    <td>${room.title}</td>
    <td>${room.createdAt}</td>
`
    document.querySelector(".tr").appendChild(roomTable)

    let joinRoom = document.getElementById(roomTable.id)
    joinRoom.addEventListener('click', async() => {
        model.currentRoomID = room.id
        view.setActiveScreen('classRoomScreen', room.id)
    })
}

view.addMessage = (senderId, text) => {
    let messageContainer = document.getElementById('message-container')
    let html = `
        <div class="RTM-message">${senderId}: ${text}</div>
    `
    messageContainer.insertAdjacentHTML('beforeend', html)
}