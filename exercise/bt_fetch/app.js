const buttonElement = document.querySelector(".btn");
console.log(buttonElement);

function getApi() {
  // var a = fetch("http://192.168.181.165:8083/coffee")
  // const a = fetch("https://api.sampleapis.com/coffee/hot")
  fetch("http://localhost:8080/coffee")
    .then((response) => response.json())
    .then((json) => {
      // console.log("jjj", json);
      renderCourses(json);
    });
}


function renderCourses(courses) {
  const listContent = document.querySelector(".list");

  const html = courses.map((course) => {
    return `
      <div class="item" data-id="${course.id}">
        <img src="${course.thumbnail}" width="100px" height="100px" style="display: block;">
        <div class="content">
          <h4>${course.title}</h4>
          <h5>${course.description}</h5>
        </div>
        <button class="btn-edit">Edit</button>
        <form class="form__update hidden">
          <input type="text" name="title" value="${course.title}">
          <input type="text" name="description" value="${course.description}">
          
          <button type="button" class="btn-update">Update</button>
        </form>
      </div>
    `;
  });

  listContent.innerHTML = html.join("");

  // add event edit
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", (event) => handleEdit(event));
  });

  // add event update
  document.querySelectorAll(".btn-update").forEach((btn) => {
    btn.addEventListener("click", (event) => handleUpdate(event));
  });
}

function handleEdit(event) {
  const parentElement = event.target.closest(".item"); 
  const formUpdateElement = parentElement.querySelector(".form__update");
  const contentElement = parentElement.querySelector(".content");
  const btnEditElement = parentElement.querySelector(".btn-edit");

  
  formUpdateElement.classList.add("active");
  contentElement.classList.add("hidden");
  btnEditElement.classList.add("hidden");
}

function handleCreateForm() {
  const createBtn = document.querySelector("#add");
  createBtn.onclick = function () {
    const title = document.querySelector('input[name="title"]').value;
    console.log(title);
    const description = document.querySelector(
      'input[name="description"]'
    ).value;
    console.log(description);
    const inputFile = document.querySelector('input[type="file"]');
    console.log(inputFile.files);

    let formData = new FormData();

    formData.append("thumbnail", inputFile.files[0]);
    formData.append("title", title);
    formData.append("description", description);

    fetch("http://localhost:8080/coffee", { method: "POST", body: formData })
      .then((response) => response.json())
      .then((json) => {
        // console.log("jjj", json);
        getApi();
      });
  };
}

function handleUpdate(event) {
  const parentElement = event.target.closest(".item");
  const id = parentElement.getAttribute("data-id");
  const title = parentElement.querySelector('input[name="title"]').value;
  const description = parentElement.querySelector('input[name="description"]').value;

  console.log("id", id);
  console.log("title", title);
  console.log("description", description);

  const updateData = {
    title: title,
    description: description,
  };

  fetch(`http://localhost:8080/coffee/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(updateData), 
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Error with the request:", response);
        throw new Error("Network response was not ok.");
      }
      return response.json(); 
    })
    .then((data) => {
      console.log("Update response:", data); 
      getApi(); 
    })
    .catch((error) => {
      console.error("Error updating item:", error);
    });
}

getApi();
handleCreateForm();
handleUpdateForm();
