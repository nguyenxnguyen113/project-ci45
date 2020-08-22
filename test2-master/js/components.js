const components = {}
components.loginScreen = `
<div class="login-container">
<div class="aside-right">
  <div class="header">
    <h3>MindX Chat</h3>
  </div>
  <form id="login-form">
    <div class="input-name-wrapper">
      <div class="input-wrapper">
        <input type="email" name="email" placeholder="Email" />
        <div class="error" id="email-error"></div>
      </div>
      <div class="input-wrapper">
        <input type="password" name="password" placeholder="password" />
        <div class="error" id="password-error"></div>
      </div>
    </div>
    <div class="form-action">
      <span id="redirect-to-register">
        Don't have an account? Register
      </span>
      <button class="btn" type="submit">
        login
      </button>
    </div>
  </form>
</div>`

components.selectRoomScreen = `
<div class="container">
<div class="header">
    <div class="logo"></div>
    <div class="search-bar">
        <input type="text" class="search-room" name="search" placeholder="search your friend">
    </div>
    <div class="current-user"></div>
</div>
</div>
<div class="main">
<div class="create-room">
    <button class="btn">+ New Room</button>
</div>
<div class="section-table">
    <div class="section-table-container">
        <table class="content-table">
            <thead>
                <tr>
                    <th>ID room</th>
                    <th>Host</th>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Created at</th>
                </tr>
            </thead>
            <tbody class="tr">

            </tbody>
        </table>
    </div>
</div>
</div>
`
components.classRoomScreen = `
<div class="class-room">
  <div class="video-bar">
      <div class="teacher-box " id="video-bar">
          <div class="video" id ="video-teacher">
              <div class="icon" id="icon"></div>
          </div>
          <div class="mic" id="teacher-mic">
              <i class="fas fa-microphone"></i>
          </div>
          <div class="info" id="infoTeacher"> Teacher</div>
      </div>
      <div class="video-student-box" id="video-student-box">

      </div>
  </div>
  <div class="sign-out" id="sign-out">
          <i class="fas fa-sign-out-alt"></i>
  </div>
  <div class="bottom-app ">
    <div class="tool-board ">
        <div class="tool" id="mouse-pointer"><i class="fas fa-mouse-pointer"></i></div>
        <div class="tool" id="hand"><i class="far fa-hand-rock"></i></div>
        <div class="tool" id="pencil"><i class="fas fa-pencil-alt"></i></div>
        <div class="tool" id="square"><i class="far fa-square"></i></div>
        <div class="tool" id="circle"><i class="far fa-circle"></i></div>
        <div class="tool" id="eraser"><i class="fas fa-eraser"></i></div>
        <div class="tool" id="text"><i class="fas fa-text-height"></i></div>
        <div class="tool" id="colorPicker" >
            <label for="pickColor"> 
                <i class="fas fa-palette"></i>
            </label>
            <input type="color" id="pickColor">
        </div>
        <div class="tool" id="newPage"><i class="far fa-file"></i></div>
        <div class="tool" id="uploadTool" >
            <label for="fileInput"> 
              <i class="fas fa-file-upload"></i>
            </label>
            <input type="file" accept="image/png, image/jpeg" id="fileInput"></div>
        </div>
    <div class="load-icon" id="load-icon"><i class="fas fa-spinner fa-spin"></i></div>
    <div class="" id="whiteboard">
    </div>
    <div class="chat-box ">
      <div class="message-container" id="message-container">

      </div>
      <input id="input-chat" placeholder="Enter your message" type="text">
    </div>
  </div>
</div>
`

components.createRoomScreen = `
<div class="create-conversation-container">
<div class="header">
    MindX chat
</div>
<div class="main" style="padding: 50px 20%;">
    <form id="create-conversation-form">
        <div>
            Create a new conversation
        </div>
        <div class="input-wrapper">
            <input type="text" placeholder="Room name" name="roomName">
            <div class="error" id="room-name-error"></div>
        </div>
        <div class="input-wrapper">
            <input type="text" placeholder="Title class" name="roomTtitle">
            <div class="error" id="room-title-error"></div>
        </div>
        <div class="input-wrapper">
            <input type="text" placeholder="chanel name" name="chanelName">
            <div class="error" id="room-chanel-error"></div>
        </div>
        <div class="input-wrapper">
        <input type="text" placeholder="password room" name="passwordRoom">
        <div class="error" id="room-password-error"></div>
    </div>
        <button class='btn' type="submit">Save</button>
        <button class='btn btn-light' type="button" id="back-to-chat">Cancel</button>
    </form>
</div>
</div>`