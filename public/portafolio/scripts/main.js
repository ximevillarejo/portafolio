     
    (function($) {
    "use strict"; // Start of use strict
  
    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: (target.offset().top - 71)
          }, 1000, "easeInOutExpo");
          return false;
        }
      }
    });
  
    // Scroll to top button appear
    $(document).scroll(function() {
      var scrollDistance = $(this).scrollTop();
      if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
      } else {
        $('.scroll-to-top').fadeOut();
      }
    });
  
    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
      $('.navbar-collapse').collapse('hide');
    });
  
    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
      target: '#mainNav',
      offset: 80
    });
  
    // Collapse Navbar
    var navbarCollapse = function() {
      if ($("#mainNav").offset().top > 100) {
        $("#mainNav").addClass("navbar-shrink");
      } else {
        $("#mainNav").removeClass("navbar-shrink");
      }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
  
    // Floating label headings for the contact form
    $(function() {
      $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
      }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
      }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
      });
    });
  
  })(jQuery); // End of use strict

  filterSelection("all") // Execute the function and show all columns
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("column");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

//crud
const db = firebase.firestore();
const taskForm = document.getElementById("task-form");
const taskContainer = document.getElementById("tasks-container");

let editStatus = false;
let id;

async function uploadImage(file){
  const ref = firebase.storage().ref(); 
  const name = new Date() + "-" + file.name; 
  const metadata = { contenttype: file.type}; 
  const snapshot = await ref.child(name).put(file, metadata); 
  const url = await snapshot.ref.getDownloadURL(); 
  return url; 
}

const saveTask = (title, description, category, fileurl) =>
  db.collection("tasks").doc().set({
    title,
    description,
    category,
    fileurl
  });

const getTasks = () => db.collection("tasks").get();

const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);

const deleteTask = (id) => db.collection("tasks").doc(id).delete();

const getTask = (id) => db.collection("tasks").doc(id).get();

const updateTask = (id, updatedTask) =>
  db.collection("tasks").doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    taskContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      task.id = doc.id;
      
      if(!task.fileurl){
        task.fileurl = "https://firebasestorage.googleapis.com/v0/b/ximevillarejo.appspot.com/o/Sprite-0002.png?alt=media&token=758ba5cc-a3d4-456e-bcb6-068e54683d57";
      }

      taskContainer.innerHTML += `
            <div class="card card-body mt-2">
                <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-lg-8">
                                    <!-- Portfolio Modal - Title-->
                                    <h2 class="portfolio-modal-title text-secondary text-uppercase mb-0 text-center" id="portfolioModal6Label">${task.title}</h2>
                                    <!-- Icon Divider-->
                                    <div class="divider-custom">
                                        <div class="divider-custom-line"></div>
                                        <div class="divider-custom-icon"><i class="fas fa-star"></i></div>
                                        <div class="divider-custom-line"></div>
                                    </div>
                                    <!-- Portfolio Modal - Text-->
                                    <div class="row justify-content-center">
                                    <p class="mb-5 text-center">Categoria: ${task.category}</p>
                                    <img class="card-img-top img-fluid" src="${task.fileurl}" >
                                    <p class="mb-5 text-center">${task.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                <div class="row justify-content-center">
                    <button class="btn btn-primary btn-delete" data-id="${task.id}">Borrar</button>
                    <button class="btn btn-secondary btn-edit" data-id="${task.id}">Editar</button>
                </div>
            </div>
        `;
       
      document.getElementById("modals-portafolio").innerHTML+=`
      <div class="portfolio-modal modal fade" id="portfolioModal${task.title}" tabindex="-1" role="dialog" aria-labelledby="portfolioModal${task.title}Label" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content">
              <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true"><i class="fas fa-times"></i></span>
              </button>
              <div class="modal-body text-center">
                  <div class="container">
                      <div class="row justify-content-center">
                          <div class="col-lg-8">
                              <!-- Portfolio Modal - Title-->
                              <h2 class="portfolio-modal-title text-secondary text-uppercase mb-0 text-center" id="portfolioModal6Label">${task.title}</h2>
                              <!-- Icon Divider-->
                              <div class="divider-custom">
                                  <div class="divider-custom-line"></div>
                                  <div class="divider-custom-icon"><i class="fas fa-star"></i></div>
                                  <div class="divider-custom-line"></div>
                              </div>
                              <!-- Portfolio Modal - Image-->
                              <img class="card-img-top img-fluid" src="${task.fileurl}" >
                              <!-- Portfolio Modal - Text-->
                              <div class="row justify-content-center">
                                    <p class="mb-5 text-center">Categoria: ${task.category}</p>
                                    <p class="mb-5 text-center">${task.description}</p>
                                    </div>
                              <button class="btn btn-primary" data-dismiss="modal">
                                  <i class="fas fa-times fa-fw"></i>
                                  Cerrar
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
      `;

      document.getElementById("items-portafolio").innerHTML+=`
        <!-- Portfolio Item ${task.title}-->
                        <div class="col-md-6 col-lg-4 mb-5 column ${task.category}">
                          <div class="portfolio-item mx-auto" data-toggle="modal" data-target="#portfolioModal${task.title}">
                              <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100">
                                  <div class="portfolio-item-caption-content text-center text-white"><i class="fas fa-plus fa-3x"></i></div>
                              </div>
                              <img class="card-img-top img-fluid " src="${task.fileurl}" >
                          </div>
                      </div>`;

     const btnDelete = document.querySelectorAll(".btn-delete");

      btnDelete.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          await deleteTask(e.target.dataset.id);
        });
      });

      const btnEdit = document.querySelectorAll(".btn-edit");

      btnEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const task = await getTask(e.target.dataset.id);

          editStatus = true;
          id = task.id;
          taskForm["task-title"].value = task.data().title;
          taskForm["task-description"].value = task.data().description;
          taskForm["task-category"].value = task.data().category;
          taskForm["btn-task-form"].innerHTML = "Guardar cambios";
        });
      });
    });
  });
});
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskForm["task-title"];
  const description = taskForm["task-description"];
  const category = taskForm["task-category"];

  const file = taskForm["task-image"].files[0];

  let fileurl = null; 

  if(file){
    fileurl = await uploadImage(file); 
  }

  if(!editStatus){
    await saveTask(title.value, description.value, category.value, fileurl);
  }else {
    if(file){
      await updateTask(id, {
        title: title.value,
        description: description.value,
        category: category.value,
        fileurl
      });
    }else{
      await updateTask(id, {
        title: title.value,
        description: description.value,
        category: category.value
      });
    }

    editStatus = false;
    id = ''; 
    taskForm['btn-task-form'].innerText = 'Guardar';
    
  }
  
  await getTasks(); 

  taskForm.reset(); 
  title.focus();



});


//firebase auth
const auth = firebase.auth();

const signUpForm = document.querySelector("#login-form");

console.log("Main");
signUpForm.addEventListener("submit", (e) => {

  console.log("Main2");
  e.preventDefault();
  const signUpEmail = document.querySelector("#login-email").value;
  const signUpPasword = document.querySelector("#login-password").value;

  auth
  .createUserWithEmailAndPassword(signUpEmail, signUpPasword)
    .then((userCredential) => {
      //clear form
      signUpForm.reset();

      $('#portfolioModal1').modal('hide');
      console.log("Cuenta creada");
    })
    .catch((err) => {
      console.log(err);
    });

});

//Log in

const IniciarSesicon = document.querySelector("#IniciarSesicon"); 

signUpForm.addEventListener("click", (e) => {
  e.preventDefault();
  const signUpEmail = document.querySelector("#login-email").value;
  const signUpPasword = document.querySelector("#login-password").value;
  auth
    .signInWithEmailAndPassword(signUpEmail, signUpPasword)
    .then((userCredential) => {
      //clear form
      signUpForm.reset();
      
      $('#portfolioModal1').modal('hide');

      console.log("ingresar");
    });
});
/*
const logOut = document.querySelector("#logout");
*/

const logOut = document.querySelector('#cerrarSesicon'); 

logOut.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {

    console.log("Sing out");
    
  });
});

auth.onAuthStateChanged((user) => {
  const crud = document.getElementById("crud-portafolio");
  if (user) {
    if(user.uid === "ecvUHpHEfpNJNpJAGjoIWRGmKsJ2"){
      crud.classList.remove("d-none"); 
    }
    
    logOut.classList.remove("d-none"); 
    IniciarSesicon.classList.add("d-none"); 

  } else {
    console.log("auth: sing out");
    crud.classList.add("d-none"); 
    logOut.classList.add("d-none"); 
    IniciarSesicon.classList.remove("d-none"); 
  }
});

// google

const googleButton = document.querySelector("#googlelogin");

googleButton.addEventListener("click", (e) => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      console.log("ingresar con google");
    })
    .catch((err) => {
      console.log(err);
    });
});
