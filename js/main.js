let posts = [{
    "type": "Anatidae",
    "species": "Pato",
    "name": "Gabriela Gajardo",
    "region": "Metropolitana de Santiago",
    "comuna": "Santiago",
    "location": "Parque O'higgins",
    "datetime": "2026-09-01T20:33",
    "files": ["../img/pato.jpeg"]
  },{"type": "Anatidae",
    "species": "Ganzo",
    "name": "Fabián Ormeño",
    "region": "Metropolitana de Santiago",
    "comuna": "Santiago",
    "location": "Parque O'higgins",
    "datetime": "2026-09-05T20:33",
    "files": ["../img/ganso.jpeg"]
  }];
let filteredPosts = posts;
let currentPage = 1;
const postsPerPage = 2;

const validateText = (text) => {
  if(!text) return false;
  let trimmedText = text.trim();

  if (trimmedText.length < 3 || trimmedText.length > 100) {
    return false;
  }

  let re = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  return re.test(trimmedText);
}

const validateLocation = (location) => {
  if (!location) return false;

  let trimmedLocation = location.trim();

  if (trimmedLocation.length < 3 || trimmedLocation.length > 100) {
    return false;
  }

  let re = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,'#-]+$/;

  return re.test(trimmedLocation);
};

const validateDateTime = (datetime) => {
    if (!datetime) return false;

    let selectedDateTime = new Date(datetime);
    let now = new Date();
    let minDate = new Date("2000-01-01T00:00");

    return (selectedDateTime <= now && selectedDateTime>=minDate);
};

const validateSelect = (select) => {
  if(!select) return false;
  return true
}

const validateFiles = (files) => {
    if (!files || files.length === 0) {
        return false;
    }

    for (let file of files) {
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
            return false;
        }
    }

    return true;
};

const validateForm = () => {
  // obtener elementos del DOM usando el nombre del formulario.
  let myForm = document.forms["myForm"];
  let type = myForm["type"].value;
  let species = myForm["species"].value;
  let region = myForm["select-region"].value;
  let comuna = myForm["select-comuna"].value;
  let location = myForm["location"].value;
  let datetime = myForm["datetime"].value;
  let files = myForm["files"].files;


  // variables auxiliares de validación y función.
  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputType) => {
    invalidInputs.push(inputType);
    isValid &&= false;
  };

  // lógica de validación
  if (!validateText(type)) {
    setInvalidInput("Tipo de ave");
  }
  if (!validateText(species)) {
    setInvalidInput("Nombre de la especie");
  }
  if (!validateSelect(region)) {
    setInvalidInput("Región");
  }
  if (!validateSelect(comuna)) {
    setInvalidInput("Comuna");
  }
  if (!validateLocation(location)) {
    setInvalidInput("Lugar");
  }
  if (!validateDateTime(datetime)) {
    setInvalidInput("Fecha y hora");
  }
  if (!validateFiles(files)) {
    setInvalidInput("Adjuntos");
  }

  // finalmente mostrar la validación
  let validationBox = document.getElementById("val-box");
  let validationMessageElem = document.getElementById("val-msg");
  let validationListElem = document.getElementById("val-list");

  if (!isValid) {
    validationListElem.textContent = "";
    // agregar elementos inválidos al elemento val-list.
    for (let input of invalidInputs) {
      let listElement = document.createElement("li");
      listElement.innerText = input;
      validationListElem.append(listElement);
    }
    // establecer val-msg
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";

    // aplicar estilos de error
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  } else {
    posts.push({
      type: type,
      species: species,
      name: localStorage.getItem("Nombre"),
      region: region,
      comuna: comuna,
      location: location,
      datetime: datetime,
      files: Array.from(files)
    });

    console.log({
      type: type,
      species: species,
      name: localStorage.getItem("Nombre"),
      region: region,
      comuna: comuna,
      location: location,
      datetime: datetime,
      files: Array.from(files)
    });

    myForm.reset();
    validationBox.hidden = true;
    filteredPosts = posts;
    currentPage = 1;
    showPosts();

    showInfo();
  }
};

const showPosts = () => {
  let postList = document.getElementById("post-list");

  postList.innerHTML = "";

  let start = (currentPage - 1) * postsPerPage;
  let end = start + postsPerPage;

  let postsToShow = filteredPosts.slice(start, end);

  postsToShow.forEach(postData => {
    let post = document.createElement("article");

    post.innerHTML = `
      <h3>${postData.species}</h3>
      <p><strong>Tipo de ave:</strong> ${postData.type}</p>
      <p><strong>Avistado por:</strong> ${postData.name}</p>
      <p><strong>Región:</strong> ${postData.region}</p>
      <p><strong>Comuna:</strong> ${postData.comuna}</p>
      <p><strong>Lugar:</strong> ${postData.location}</p>
      <p><strong>Fecha:</strong> ${postData.datetime}</p>
    `;

    for (let file of postData.files) {
      if (typeof file === "string") {
        let image = document.createElement("img");
        image.src = file;
        image.width = 200;
        post.appendChild(image);
    } else {
        let url = URL.createObjectURL(file);

        if (file.type.startsWith("image/")) {
          let image = document.createElement("img");
          image.src = url;
          image.width = 200;
          post.appendChild(image);
        }

        if (file.type.startsWith("video/")) {
          let video = document.createElement("video");
          video.src = url;
          video.width = 300;
          video.controls = true;
          post.appendChild(video);
        }
      }
    }
    postList.appendChild(post);
  });

  createPagination();
}

const createPagination = () => {
  let postList = document.getElementById("post-list");

  let totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  let pagination = document.createElement("section");
  pagination.classList.add("pagination");

  for (let i = 1; i <= totalPages; i++) {
    let button = document.createElement("button");

    button.textContent = i;

    button.addEventListener("click", function () {
      currentPage = i;
      showPosts();
    });

    pagination.appendChild(button);
  }

  postList.appendChild(pagination);
}

const filterForm = () => {
  let filterForm = document.forms["filterForm"];
  let birdType = filterForm["filter-type"].value;
  let order = filterForm["select-order"].value;

  filteredPosts = posts.filter((post) => post.type.toLowerCase().includes(birdType.toLowerCase()));

  if (order === "datetime") {
    filteredPosts.sort((b, a) => {
      return new Date(a.datetime) - new Date(b.datetime);
    });
  }

  if (order === "location") {
    filteredPosts.sort((a, b) => {
      return a.location.localeCompare(b.location);
    });
  }
 
  currentPage = 1;
  showPosts();

}

const createRegionChart = () => {
  let canvas = document.getElementById("region-chart");
  let ctx = canvas.getContext("2d");

  let regionCounts = {};

  for (let post of posts) {
    if (regionCounts[post.region]) {
      regionCounts[post.region]++;
    } else {
      regionCounts[post.region] = 1;
    }
  }

  let regions = Object.keys(regionCounts);
  let values = Object.values(regionCounts);

  if (values.length === 0) {
    return;
  }

  let maxValue = Math.max(...values);

  let barHeight = 30;
  let gap = 20;

  // Calcular automáticamente el alto del canvas
  canvas.height = 30 + regions.length * (barHeight + gap) + 20;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let startX = 180;
  let maxBarWidth = 350;

  for (let i = 0; i < regions.length; i++) {

    let barWidth = (values[i] / maxValue) * maxBarWidth;

    let y = 30 + i * (barHeight + gap);

    // Nombre de la región
    ctx.fillStyle = "#000";
    ctx.font = "8px Arial";
    ctx.textAlign = "right";
    ctx.fillText(regions[i], startX - 10, y + 20);

    // Barra
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(startX, y, barWidth, barHeight);

    // Cantidad
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.fillText(values[i], startX + barWidth + 10, y + 20);
  }
};

const createTypeChart = () => {
  let canvas = document.getElementById("type-chart");
  let ctx = canvas.getContext("2d");

  let typeCounts = {};

  for (let post of posts) {
    if (typeCounts[post.type]) {
      typeCounts[post.type]++;
    } else {
      typeCounts[post.type] = 1;
    }
  }

  let types = Object.keys(typeCounts);
  let values = Object.values(typeCounts);

  if (values.length === 0) {
    return;
  }

  let maxValue = Math.max(...values);

  let barHeight = 30;
  let gap = 20;

  // Calcular automáticamente el alto del canvas
  canvas.height = 30 + types.length * (barHeight + gap) + 20;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let startX = 180;
  let maxBarWidth = 350;

  for (let i = 0; i < types.length; i++) {

    let barWidth = (values[i] / maxValue) * maxBarWidth;

    let y = 30 + i * (barHeight + gap);

    ctx.fillStyle = "#000";
    ctx.font = "8px Arial";
    ctx.textAlign = "right";
    ctx.fillText(types[i], startX - 10, y + 20);

    // Barra
    ctx.fillStyle = "#2196F3";
    ctx.fillRect(startX, y, barWidth, barHeight);

    // Cantidad
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.fillText(values[i], startX + barWidth + 10, y + 20);
  }
};

const createUserChart = () => {
  let canvas = document.getElementById("user-chart");
  let ctx = canvas.getContext("2d");

  let nameCounts = {};

  for (let post of posts) {
    if (nameCounts[post.name]) {
      nameCounts[post.name]++;
    } else {
      nameCounts[post.name] = 1;
    }
  }

  let names = Object.keys(nameCounts);
  let values = Object.values(nameCounts);

  if (values.length === 0) {
    return;
  }

  let maxValue = Math.max(...values);

  let barHeight = 30;
  let gap = 20;

  // Calcular automáticamente el alto del canvas
  canvas.height = 30 + names.length * (barHeight + gap) + 20;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let startX = 180;
  let maxBarWidth = 350;

  for (let i = 0; i < names.length; i++) {

    let barWidth = (values[i] / maxValue) * maxBarWidth;

    let y = 30 + i * (barHeight + gap);

    ctx.fillStyle = "#000";
    ctx.font = "8px Arial";
    ctx.textAlign = "right";
    ctx.fillText(names[i], startX - 10, y + 20);

    // Barra
    ctx.fillStyle = "#f32121";
    ctx.fillRect(startX, y, barWidth, barHeight);

    // Cantidad
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.fillText(values[i], startX + barWidth + 10, y + 20);
  }
};

const showInfo = () => {
  createRegionChart();
  createTypeChart();
  createUserChart();

  let totalPosts = document.getElementById("total-posts");
  totalPosts.innerHTML = posts.length;
  let totalUsers = document.getElementById("total-users");
  totalUsers.innerHTML = 3;
}

let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateForm);
let filterBtn = document.getElementById("filter-btn");
filterBtn.addEventListener("click", filterForm);
window.addEventListener("load", () => {
  showInfo();
  showPosts();
});