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
  let species_id = myForm["species_id"].value;
  let region = myForm["region_id"].value;
  let comuna = myForm["comuna_id"].value;
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
  if (!validateSelect(species_id)) {
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
    console.log("falle")
  } else {
    console.log("Lo logre")
    myForm.submit();
  }
};

let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateForm);