// const { default: axios } = require("axios");

getPosts();

function getPosts(page = 1,reload= true) {
    console.log("hellooo from getPosts");
    const posts = document.getElementById("posts");
    if(reload){
      posts.innerHTML = "";
    }
    let data = {};
    let tags = [];
    toggleLoader(true);
    document.body.style.overflow = "hidden";
    axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=15&page=${page}`) 
    .then((response) => {
      toggleLoader(false);
      document.body.style.overflow = "auto";
      data = response.data.data;
      lastPage = response.data.meta.last_page;
        const user = JSON.parse(localStorage.getItem("user"));
        // console.log("this is id "+user.id)
        // let liverpool = [];
        // liverpool.push(data);
        // console.log(liverpool);
        for (post of data) {
          tags = post.tags;
          // let isDisabled = user && user.id == post.author.id ? "" : "";
          let editDeleteBtns = "";
          if(user && user.id == post.author.id){
            console.log("User: ", user.id);
            console.log("Post Author ID: ", post.author.id);
            editDeleteBtns = `
              <div class="buttons">
                <button type="button" class="btn btn-secondary owner-btns" data-post='${JSON.stringify(post)}' onclick='fillPostModal(this)'>Edit</button>
                <button type="button" class="btn btn-danger owner-btns" onclick='fillDeletePost(${post.id})' data-bs-toggle="modal" data-bs-target="#delete-post-modal">Delete</button>
              </div>
            `;
          }
          let p = `
              <div class="card shadow-sm mb-5" data-id=${post.id}>
                          <div class="card-header d-flex align-items-center justify-content-between">
                              <div class="d-flex align-items-center gap-1" style="cursor:pointer;" onclick="showUserPosts(${post.author.id})">
                                  <div style="width: 30px; height: 30px; overflow: hidden;">
                                      <img src="${post.author.profile_image.length ? post.author.profile_image : "profile-pics/default.png"}" alt="" class="rounded-circle" style="object-fit: cover; width: 100%; height: 100%;"/>
                                  </div>
                                  <b>@${post.author.username}</b>
                              </div>
                              ${editDeleteBtns}
                          </div>
                          <div class="card-body" onclick="showPostDetails(${post.id})">
                              <img src="${post.image}" alt="" class="w-100" />
                              <h6 style="color: #999" class="mt-1">${post.created_at}</h6>
                              <h5>${post.title || ""}</h5>
                              <p class="caption">
                                  ${post.body}
                              </p>
                              <hr>
                              <div class="about d-flex flex-wrap" style="display: inline;">
                                  <div class="comments d-flex align-items-center gap-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                          class="bi bi-pen" viewBox="0 0 16 16">
                                          <path
                                              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                      </svg>
                                      <span>(${post.comments_count}) comments</span>
                                  </div>
                                  <div class="tag ms-3 d-flex" id="tags-${
                          post.id
                        }" style="display: inline;">
                                      ${tags
                                      .map((t) => {
                                      return `<span
                                          class="me-2 bg-secondary text-white p-2 rounded-pill">${t.name}</span>`;
                                      })
                                      .join("")}
                                  </div>
                              </div>
                          </div>
                      </div>
              `;
              posts.innerHTML += p;
          s++;
        }
      //   console.log("s : " + s);
  });
}

function toggleLoader(show = true){
  if(show){
    document.getElementById("posts-loader").style.display = "flex";
  }else{
    document.getElementById("posts-loader").style.display = "none";
  }
}

function fillPostModal(button = null){
  console.log("hello");
  let post = button ? JSON.parse(button.getAttribute('data-post')) : button;
  console.log(post ? post : "no post provided");
  let postId = document.getElementById("post-id");
  const modalTitle = document.getElementById("modal-title");
  const modalMainButton = document.getElementById("confirm-post");
  const title = document.getElementById("post-title");
  const body = document.getElementById("post-desc");
  modalTitle.innerHTML = post ? "Edit Post" : "Create Post";
  modalMainButton.innerHTML = post ? "Save Changes" : "Create Post";
  title.value = post ? post.title : "";
  body.value = post ? post.body : "";
  postId.value = post ? post.id : "";
  const postModal = new bootstrap.Modal(document.getElementById("post-modal"),{});
  postModal.toggle();
}

function createOrEditPost(btn) {
    const postId = document.getElementById("post-id").value;
    console.log("you are "+(postId ? `Editing the post with the id ${postId}` : "creating a post"));
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-desc").value;
    const image = document.getElementById("post-image").files[0];
    const token = localStorage.getItem("token");
    const headers = {
      authorization: `Bearer ${token}`
    };
    let formData = new FormData();
    formData.append("title", title);
    formData.append("body", content);
    if(image){
      formData.append("image", image);
    }
    btn.setAttribute("disabled","true");
    // if i'am editing the post
    if (postId) {
      btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> saving...`;
      formData.append("_method","put");
      axios
      .post(`https://tarmeezacademy.com/api/v1/posts/${postId}`, formData, {
        headers: headers,
      })
      .then((response) => {
        console.log(response);
        btn.disabled = false;
        showAlert("success", "Post edited");
        getPosts();
      })
      .catch((error) => {
        console.log(error.response.data.message);
        showAlert("danger", error.response.data.message);
        console.log(image == undefined);
      });
    }
    // if i'am creating a post
    else{
      btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ubloading...`;
      axios
      .post("https://tarmeezacademy.com/api/v1/posts", formData, {
        headers: headers,
      })
      .then((response) => {
        btn.disabled = false;
        console.log(response);
        showAlert("success", "Post created");
        getPosts();
        })
        .catch((error) => {
          console.log(error.response.data.message);
          showAlert("danger", error.response.data.message);
        });
      }
    const modal = document.getElementById("post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    title.value = "";
    content.value = "";
}

function fillDeletePost(postId){
  document.getElementById("post-id-input").value = postId;
}

function showPostDetails(id){
  location.href = `post_details.html?id=${id}`;
}
// function showUserPosts(id){
//   location.href = `user_profile.html?id=${id}`;
// }


// console.log(document.getElementById("home-link").classList)

  


let currentPage = 1;
let lastPage = 2;
let s = 0;

window.addEventListener("scroll", () => {
  let offset = Math.ceil(window.innerHeight + window.scrollY) >= document.body.scrollHeight;
  if (offset && currentPage < lastPage) {
    console.log("helllo from handle infinite posts function");
    currentPage++;
    getPosts(currentPage,false);
  }
});