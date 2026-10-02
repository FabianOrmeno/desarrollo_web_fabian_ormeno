const validateName = (name) => {
  if(!name) return false;
  let trimmedName = name.trim();

  if (trimmedName.length < 3 || trimmedName.length > 100) {
    return false;
  }

  let re = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  return re.test(trimmedName);
}

const validateEmail = (email) => {
  if (!email) return false;

  let trimmedEmail = email.trim();

  if (trimmedEmail.length < 6 || trimmedEmail.length > 100) {
    return false;
  }

  let re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return re.test(trimmedEmail);
};

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;

  let phone = phoneNumber.trim();

  let re = /^9[0-9]{8}$/;

  return re.test(phone);
};

const validatePassword = (password) => {
  if (!password) return false;

  return password.length >= 8;
};

const validateSelect = (select) => {
  if(!select) return false;
  return true
}

const validateForm = () => {
  // obtener elementos del DOM usando el nombre del formulario.
  let myForm = document.forms["myForm"];
  let email = myForm["email"].value;
  let phoneNumber = myForm["phone"].value;
  let name = myForm["username"].value;
  let region = myForm["select-region"].value;
  let comuna = myForm["select-comuna"].value;
  let password = myForm["pass"].value;
  let confirmPassword = myForm["val-pass"].value;


  // variables auxiliares de validación y función.
  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid &&= false;
  };

  // lógica de validación
  if (!validateName(name)) {
    setInvalidInput("Nombre");
  }
  if (!validateEmail(email)) {
    setInvalidInput("Email");
  }
  if (!validatePhoneNumber(phoneNumber)) {
    setInvalidInput("Número");
  }
  if (!validateSelect(region)) {
    setInvalidInput("Región");
  }
  if (!validateSelect(comuna)) {
    setInvalidInput("Comuna");
  }
  if (!validatePassword(password)) {
    setInvalidInput("Contraseña");
  }
  if (password !== confirmPassword) {
    setInvalidInput("Las contraseñas no coinciden");
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
    validationBox.class = "validation-error"
    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  } else {
    // Ocultar el formulario
    myForm.style.display = "none";

    // establecer mensaje de éxito
    validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver?";
    validationListElem.textContent = "";

    // aplicar estilos de éxito
    validationBox.class = "validation-success"
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    // Agregar botones para enviar el formulario o volver
    let submitButton = document.createElement("button");
    submitButton.innerText = "Enviar";
    submitButton.style.marginRight = "10px";
    submitButton.addEventListener("click", () => {
      myForm.submit();
    });

    let backButton = document.createElement("button");
    backButton.innerText = "Volver";
    backButton.addEventListener("click", () => {
      // Mostrar el formulario nuevamente
      myForm.style.display = "block";
      validationBox.hidden = true;
    });

    validationListElem.appendChild(submitButton);
    validationListElem.appendChild(backButton);

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  }
};


let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateForm);
