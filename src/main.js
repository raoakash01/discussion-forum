const loginBtn = document.getElementById('btn2');
const loginPage = document.getElementById('login_page');
const firstpage = document.getElementById('first_page');


const userProfileBtn = document.getElementById('user-profile-btn');
const home_btn = document.getElementById('home_btn');
const registerBtn = document.getElementById('btn1');
const registerPage = document.getElementById('register_page');
const dashboard = document.getElementById('dashboard');
const logoutBtn = document.getElementById('btn3');
const userProfile = document.getElementById('user-profile');
const backBtn = document.getElementById('back_btn');



// Adding click event listener to the login button
loginBtn.addEventListener('click', function() {
    // Changing the display property of login page to "block"
    loginPage.style.display = 'block';
    firstpage.style.display = 'none';
    registerPage.style.display = 'none';
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'inline';
    
});

registerBtn.addEventListener('click', function() {
    registerPage.style.display = 'block';
    loginPage.style.display = 'none';
    firstpage.style.display = 'none';
    registerBtn.style.display = 'none';
    loginBtn.style.display = 'inline';
    
});

userProfileBtn.addEventListener('click', function() {
    dashboard.style.display = 'none';
    firstpage.style.display = 'none';
    loginPage.style.display = 'none';
    registerPage.style.display = 'none';
    userProfileBtn.style.display = 'none';
    loginBtn.style.display = 'none';
    userProfile.style.display = 'flex';
    backBtn.style.display = 'inline';
    
});

backBtn.addEventListener('click', function() {
    dashboard.style.display = 'block';
    firstpage.style.display = 'none';
    loginPage.style.display = 'none';
    registerPage.style.display = 'none';
    userProfileBtn.style.display = 'inline';
    loginBtn.style.display = 'none';
    userProfile.style.display = 'none';
    backBtn.style.display = 'none';
});


const hideAllPages = () => {
    firstpage.style.display = 'none';
    loginPage.style.display = 'none';
    registerPage.style.display = 'none';
    dashboard.style.display = 'none';

}

        let token= null;

        

        logoutBtn.addEventListener('click', () =>{
            token = null;
            localStorage.removeItem('token');
            dashboard.style.display = 'none';
            firstpage.style.display = 'flex';
            loginBtn.style.display = 'inline';
            registerBtn.style.display = 'inline';
            logoutBtn.style.display = 'none';
            userProfileBtn.style.display = 'none';
        });
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('register-go').addEventListener('click', (event) => {
                event.preventDefault();
                if (confirmPasswordInput.value !== passwordInput.value) {
                    alert('The passwords do not match. Please try again.');
                    return;
                  }
              
                const name = document.getElementById('nameInput').value;
                const email = document.getElementById('emailInput').value;
                const password = document.getElementById('passwordInput').value;
    
                fetch('http://localhost:5005/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        
                    }),
                }).then((response) => {
                    response.json().then((data) => {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            const token = data.token;
                            localStorage.setItem('token', token);
                            console.log(token);
                            
                            // Assuming you have these elements in your HTML
                            dashboard.style.display = 'block';
                            registerPage.style.display = 'none';
                            loginBtn.style.display = 'none';
                            logoutBtn.style.display = 'inline';
                            userProfileBtn.style.display = 'inline';
                        }
                    });
                }).catch((error) => {
                    console.error('Error:', error);
                    alert('An error occurred while registering. Please try again.');
                });
            });
        });
    document.getElementById('login-go').addEventListener('click',()=>{
        const email = document.getElementById('emailInput2').value;
        const password = document.getElementById('passwordInput2').value;

        fetch('http://localhost:5005'+'/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email:email,
                password:password,
            }),
        }).then((response) => {
            response.json().then((data) =>{
                if(data.error){
                    alert(data.error);
                }
                else{
                token = data.token;
                localStorage.setItem('token', token);
                dashboard.style.display = 'block';
                loginPage.style.display = 'none';
                registerBtn.style.display = 'none';
                logoutBtn.style.display = 'inline';
                userProfileBtn.style.display = 'inline';
                
                console.log(localStorage);
                
            }
        });
    });
});

const loadThreads = () => {
    fetch('http://localhost:5005'+'/threads?start=0', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
    }).then((response) => {
        response.json().then((data) =>{
            if(data.error){
                alert(data.error);
            }
            else{
            document.getElementById('threads').innerText='';
            for(const threadId of data){
                const threadDom = document.createElement('div');
                threadDom.innerHTML = threadId;
                document.getElementById('threads').appendChild(threadDom);
            }

        }
    });
});    
};
const loadComments = (threadId) => {
  const parsedThreadId = parseInt(threadId, 10);
  if (isNaN(parsedThreadId)) {
    // Handle the error if the threadId cannot be parsed to an integer.
    alert('Invalid threadId');
    return;
  }

  fetch(`http://localhost:5005/comments?threadId=${parsedThreadId}&start=0`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (data.error) {
      alert(data.error);
    } else {
      document.getElementById('comment_here').innerHTML = '';
      for (const comment of data) {
        const commentDom = document.createElement('div');
        commentDom.innerHTML = `${comment.id}: ${comment.content}`;
        document.getElementById('comment_here').appendChild(commentDom);
      }
    }
  })
  .catch((error) => {
    console.error('Error fetching comments:', error);
    alert('Error fetching comments. Please check the console for details.');
  });
};


document.getElementById('thread-go').addEventListener('click',()=>{
    const title = document.getElementById('titleInput').value;
    const isPublic = document.getElementById('publicInput').checked;
    const content = document.getElementById('contentInput').value;

    fetch('http://localhost:5005'+'/thread', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({
            title:title,
            isPublic:isPublic,
            content:content,
        }),
    }).then((response) => {
        response.json().then((data) =>{
            if(data.error){
                alert(data.error);
            }
            else{
                loadThreads();

        }
    });
});
});
document.getElementById('getBtn').addEventListener('click', () => {
    const threadId = document.getElementById('searchInput').value;
    fetch('http://localhost:5005/thread?id=' + encodeURIComponent(threadId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
      .then(response => {
        response.json().then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            document.getElementById('createThread').style.display = 'none';
            document.getElementById('threadShow').style.display = 'block';
            document.getElementById('threadTitle').innerHTML = data.title;
            document.getElementById('threadContent').innerHTML = data.content;
  
            document.getElementById('update-go').addEventListener('click', function () {
              var title = document.getElementById('titleInput2').value;
              var isPublic = document.getElementById('publicInput2').checked;
              var content = document.getElementById('contentInput2').value;
              var lock = data.lock;
              var updatedData = {
                id: threadId,
                title: title,
                isPublic: isPublic,
                content: content,
                lock: lock,
              };
  
              fetch('http://localhost:5005/thread', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token,
                },
                body: JSON.stringify(updatedData),
              })
                .then(function (response) {
                  response.json().then(function (updatedThread) {
                    if (updatedThread.error) {
                      alert(updatedThread.error);
                    } else {
                      document.getElementById('updateThread').style.display = 'none';
                      document.getElementById('comments').style.display = 'block';
                      document.getElementById('thread-update').style.display = 'inline';
                      document.getElementById('threadTitle').innerHTML = title;
                      document.getElementById('threadContent').innerHTML = content;
                    }
                  });
                })
                .catch(function (error) {
                  console.error('Error updating thread:', error);
                });
            });
            ////deleteing thread
            document.getElementById('thread-delete').addEventListener('click', function () {
              fetch('http://localhost:5005/thread', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token,
                },
                body: JSON.stringify({ id: threadId }),
              })
                .then(function (response) {
                  response.json().then(function (deletedThread) {
                    if (deletedThread.error) {
                      alert(deletedThread.error);
                    } else {
                      loadThreads();
                      document.getElementById('createThread').style.display = 'block';
                      document.getElementById('threadShow').style.display = 'none';
                    }
                  });
                })
                .catch(function (error) {
                  console.error('Error deleting thread:', error);
                });
            });
            //likeing thread
            document.getElementById('like-button').addEventListener('click', function () {
              fetch('http://localhost:5005/thread/like', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token,
                },
                body: JSON.stringify({ id: threadId, turnon: true }),
              })
                .then(function (response) {
                  response.json().then(function (likedThread) {
                    if (likedThread.error) {
                      alert(likedThread.error);
                    } else {
                      loadThreads();
                    }
                  });
                })
                .catch(function (error) {
                  console.error('Error liking thread:', error);
                });
            });
            //watching thread
            document.getElementById('watch-button').addEventListener('click', function () {
              fetch('http://localhost:5005/thread/watch', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token,
                },
                body: JSON.stringify({ id: threadId, turnon: true }),
              })
                .then(function (response) {
                  response.json().then(function (watchedThread) {
                    if (watchedThread.error) {
                      alert(watchedThread.error);
                    } else {
                      loadThreads();
                    }
                  });
                })
                .catch(function (error) {
                  console.error('Error watching thread:', error);
                });
            });
            //comments
            document.getElementById('comment-go').addEventListener('click', () => {
                const content = document.getElementById('commentInput').value;
                const parentCommentId = document.getElementById('parentId').value||null;
              
                fetch('http://localhost:5005/comment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                  },
                  body: JSON.stringify({ threadId: threadId, parentCommentId: parentCommentId, content: content }),
                 
                })
                  .then(response => {
                    if (!response.ok) {
                      response.text().then(error => {
                        alert(error);
                     });
                    } else {
                      response.json().then(data => {
                        loadComments(threadId);
                      });
                    }
                  })
                  .catch(function (error) {
                    console.error('Error posting a comment:', error);
                  });
              });

              document.getElementById('delete-comment').addEventListener('click', () => {
                const commentId = document.getElementById('deleteId').value;
                fetch('http://localhost:5005/comment', {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                  },
                  body: JSON.stringify({ id: commentId }),
                })
                .then(response => {
                  if (!response.ok) {
                    response.text().then(error => {
                      alert(error);
                   });
                }else{
                    loadComments(threadId);
                   }}).catch(function (error) {
                    console.error('Error deleting a comment:', error);
                   });

          });
        }});
      })
      .catch(function (error) {
        console.error('Error fetching thread:', error);
      });
  });
  
 
    
document.getElementById('createThreadBtn').addEventListener('click', () => {
    document.getElementById('createThread').style.display = 'block';
    document.getElementById('threadShow').style.display = 'none';
})

document.getElementById('thread-update').addEventListener('click', () => {
    document.getElementById('updateThread').style.display = 'block';
    document.getElementById('comments').style.display = 'none';
    document.getElementById('thread-update').style.display = 'none';
})
document.getElementById('back').addEventListener('click', () => {
    document.getElementById('updateThread').style.display = 'none';
    document.getElementById('comments').style.display = 'block';
    document.getElementById('thread-update').style.display = 'inline';
})

document.getElementById('user-profile-btn').addEventListener('click', () => {
  
  fetch(`http://localhost:5005/user`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // Make sure token is defined
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      // Assuming data returned from the server contains user information
      const profileNameElement = document.getElementById('profileName');
      profileNameElement.textContent = data.name; // Adjust property name according to your data structure
  })
  .catch(error => {
      console.error('Error fetching user:', error);
      // Handle error appropriately, e.g., show error message to user
  });
});



if(localStorage.getItem('token')){
    token = localStorage.getItem('token');
    hideAllPages();
    dashboard.style.display = 'block';
    loadThreads();
}else{
    hideAllPages();
    firstpage.style.display = 'flex';
}