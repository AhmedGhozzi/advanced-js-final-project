// Function to get the query parameter value
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

  // Fetch and display the post details
function loadPostDetails() {
    const postId = getQueryParam("id"); // Get the post ID from the URL
    const token = localStorage.getItem("token");
    if (!postId) {
      console.error("Post ID not found in the URL");
      return;
    }
    if (!token) {
        document.getElementById("button-addon2").setAttribute("disabled", "true");
    }
    else{
        document.getElementById("button-addon2").removeAttribute("disabled");
    }
    // Fetch post details using the ID
    axios
      .get(`https://tarmeezacademy.com/api/v1/posts/${postId}`)
      .then((response) => {
        const post = response.data.data;
        console.log(post)
        // Update the DOM with post details
        document.getElementById("user-profile-link").setAttribute("onclick",`showUserPosts(${post.author.id})`);
        document.getElementById("pdp").src = post.author.profile_image.length ? post.author.profile_image : "profile-pics/default.png";
        document.getElementById("post-owner").innerText = post.author.username;
        document.getElementById("post-author").innerText = post.author.username;
        document.getElementById("post-img").src = post.image;
        document.getElementById("post-timing").innerText = post.created_at;
        document.getElementById("title").innerText = post.title;
        document.getElementById("caption").innerText = post.body;
        document.getElementById("comments-count").innerText = post.comments_count;
        document.getElementById("post-tags").innerHTML = post.tags.map(tag => {`<span class="me-2 bg-secondary text-white p-2 rounded-pill">${tag.name}</span>`;}).join("")
        document.getElementById("comments-section").innerHTML = "";
        for(comment of post.comments){
            console.log();
            const commentElement = `
                <div class="comment">
                    <div class="comment-author">
                        <div style="width: 20px; height: 20px; overflow: hidden;" class="d-flex align-items-center">
                            <img src="${comment.author.profile_image.length ? comment.author.profile_image : "profile-pics/default.png"}" alt="" style="object-fit: cover; width: 100%; height: 100%;" class="rounded-circle">
                        </div>
                        <b class="comment-username">${comment.author.username}</b>
                    </div>
                    <div class="comment-body">${comment.body}</div>
                </div>
            `
            document.getElementById("comments-section").innerHTML += commentElement
        }
        
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
      });
}

loadPostDetails();

// function showUserPosts(id){
//     location.href = `user_profile.html?id=${id}`;
// }

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
    // ! todo
    // setTimeout(() => {
    //     const modal = document.getElementById("successAlert");
    //     const modalInstance = bootstrap.Modal.getInstance(modal);
    //     modalInstance.hide();
    // }, 3000);
}

function addComment(){
    const btn = document.getElementById("button-addon2")
    btn.setAttribute("disabled", "true");
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> sending...`;
    const comment = document.getElementById("new-comment");
    const token = localStorage.getItem("token");
    body = {
        "body": comment.value.trim()
    }
    headers = {
        Accept: 'application/json',
        authorization: `Bearer ${token}`
    }
    axios
    .post(`https://tarmeezacademy.com/api/v1/posts/${getQueryParam("id")}/comments`,body,{
        headers:headers
    })
    .then((response) => {
            btn.disabled = false;
            btn.innerHTML = "send";
            console.log(response.data);
            loadPostDetails();
            comment.value = "";
        })
        .catch((error) => {
            console.log(comment.value);
            showAlert("danger",error.response.data.message);
        })
}