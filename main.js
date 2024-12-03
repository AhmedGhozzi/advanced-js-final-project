// const { default: axios } = require("axios")

const user = JSON.parse(localStorage.getItem("user"));

const userId = user ? user.id : null;

document.getElementById("logged-profile").setAttribute("onclick",`showUserPosts(${userId})`);



function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}



function showUserPosts(id){
  if(id){
    location.href = `user_profile.html?id=${id}`;
  }
  else{
    showAlert("danger","no user is logged in");
  }
}

function login(btn) {
  btn.setAttribute("disabled","true");
  btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
  console.log(btn.classList);
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  axios
  .post("https://tarmeezacademy.com/api/v1/login", {
    username: username,
    password: password,
  })
  .then((response) => {
    console.log(response);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    const modal = document.getElementById("login-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    location.reload();
    showAlert("success", "Logged in succesfully");
    setupUi();
    btn.setAttribute("disabled","false")
    })
    .catch((error) => {
      console.log(error);
    });
}

function register(btn) {
  btn.setAttribute("disabled","true");
  btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
  const userName = document.getElementById("newusername").value;
  const name = document.getElementById("name").value;
  const password = document.getElementById("newpassword").value;
  const profileImage = document.getElementById("image").files[0];
  const formData = new FormData();
  // const bodyParams = {
  //     username: userName,
  //     name: name,
  //     password: password,
  // };
  formData.append("username", userName);
  formData.append("password", password);
  if(profileImage){
    formData.append("image", profileImage);
  }
  formData.append("name", name);
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData, {
      headers: headers,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("success", "Registered succesfully");
      setupUi();
      getPosts();
      // location.reload();
      btn.setAttribute("disabled","true");
    })
    .catch((error) => {
      console.log(error.response.data.message);
      const errorType = error.response.data.message;
      showAlert("danger", errorType);
    });
}

function logout() {
  // localStorage.removeItem("token");
  // localStorage.removeItem("user");
  localStorage.clear();
  showAlert("success", "Logged out successfully");
  location.reload();
  setupUi();
}

function deletePost(){
  let postId = document.getElementById("post-id-input").value;
  const token = localStorage.getItem("token");
  if(!postId){
    showAlert("danger", "Please select a post to delete");
    return
  }
  const headers = {
    "authorization": `Bearer ${token}`,
  };
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`,{
      headers: headers,
    })
    .then((response) => {
      console.log(response);
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("success","the post has been deleted")
      getPosts();
    })
    .catch((error) => {
      console.log(error);
    });
}

function showAlert(type, message) {
  const alertPlaceHolder = document.getElementById("successAlert");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
        <div>
            <div class="alert alert-${type} d-flex align-items-center alert-dismissible" role="alert">
                <div>${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="close"></button>
            </div>
        </div>
        `;
  alertPlaceHolder.appendChild(wrapper);
  // Automatically fade out the alert after 5 seconds (5000 ms)
  setTimeout(() => {
    wrapper.querySelector(".alert").classList.remove("show");
    wrapper.querySelector(".alert").classList.add("fade");
  }, 4000);
  // Fades out

  // Remove from DOM after the transition ends (Bootstrap's fade time is 150ms)
  setTimeout(() => {
    wrapper.remove();
  }, 4500);
  // Fully remove
}

function setupUi() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const preLogin = document.getElementById("pre-login");
  const postLogin = document.getElementById("post-login");
  const profileImage = document.getElementById("nav-pdp");
  const profileName = document.getElementById("profile-name");
  const addBtn = document.getElementById("add-post");
  if (token != null) {
    preLogin.style.display = "none";
    postLogin.style.display = "flex";
    profileImage.src = user.profile_image.length ? user.profile_image : "profile-pics/default.png";
    profileName.innerHTML = `@${user.username}`;
    addBtn.style.display = "flex";
    console.log(token);
  } else {
    preLogin.style.display = "flex";
    postLogin.style.display = "none";
    addBtn.style.display = "none";
  }
}

setupUi();



// setInterval(() => {
//     location.reload()
// },60000)
