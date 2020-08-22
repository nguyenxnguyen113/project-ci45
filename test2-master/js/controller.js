const controller = {}
controller.Validate = (data, check = false) => {
    for (let i in data) {
      data[i].value !== ""
        ? view.errorMessage(data[i].id, "")
        : view.errorMessage(data[i].id, "Please input " + data[i].name);
    }
    if (check) {
      if ((data.title.value !== "", data.email.value)) {
        model.addNewConversation(data);
      }
      return;
    }
  
    if (Object.keys(data)[4] === "confirmPassword") {
      if (data.password.value !== data.confirmPassword.value) {
        view.errorMessage(
          data.confirmPassword.id,
          "Password and Confirm Password doesn't macth"
        );
      } else {
        view.errorMessage(data.confirmPassword.id, "");
  
        if (
          data.firstName.value !== "" &&
          data.lastName.value !== "" &&
          data.email.value !== "" &&
          data.password.value !== ""
        ) {
          model.register(
            data.firstName.value,
            data.lastName.value,
            data.email.value,
            data.password.value
          );
        }
      }
    } else {
      if (data.email.value !== "" && data.password.value !== "") {
        model.login(data.email.value, data.password.value);
      }
    }
  };
controller.onOfMic = async (id)=>{
  let data =  await model.getUserIntoRoom(id,model.currentRoomID)
  let ref = firebase.database().ref(`${model.currentRoomID}/` + id)
  if(data.onMic){
    if(id == agora.localStreams.camera.id){
      agora.localStreams.camera.stream.muteAudio()
      ref.update({
        onMic:false
      })
      if(id == 12345){
        let micBox = document.getElementById('video-bar')
        micBox.querySelector('.mic i').className = 'fas fa-microphone-slash'
      }
      else{
        let micBox = document.getElementById(`${id}1`)
        micBox.querySelector('.mic i').className = 'fas fa-microphone-slash'
      }
      console.log('mute self');
    }
    else{
      let find = agora.remoteStreams.find((item)=>item.id == id)
      find.stream.muteAudio()
      console.log('mute :' + find.id);
      ref.update({
        onMic:false
      })
    }
  }
  else{
    if(id == agora.localStreams.camera.id){
      agora.localStreams.camera.stream.unmuteAudio()
      ref.update({
        onMic:true
      })
      if(id == 12345){
        let micBox = document.getElementById('video-bar')
        micBox.querySelector('.mic i').className = 'fas fa-microphone'
      }
      else{
        let micBox = document.getElementById(`${id}1`)
        micBox.querySelector('.mic i').className = 'fas fa-microphone'
      }
      console.log('unmute self');
    }
    else{
      let find = agora.remoteStreams.find((item)=>item.id == id)
      find.stream.unmuteAudio()
      console.log('unmute :' + find.id);
      ref.update({
        onMic:true
      })
    }
  }
    
}