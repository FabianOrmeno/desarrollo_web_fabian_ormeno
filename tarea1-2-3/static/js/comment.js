const validateText = (text, min, max) => {
    if(!text) return false;
    let trimmedName = text.trim();

    if (trimmedName.length < min || trimmedName.length > max) {
        return false;
    }

    return true;
}

const populateCommentList = (commentList) => {

    let comments = document.getElementById("comment-list");

    // delete previous childs
    while (comments.firstChild) {
        comments.removeChild(comments.firstChild);
    }

    // if there are no matches, hide the search list
    if (commentList.length === 0) {
        comments.hidden = true;
        return;
    }

    for (let commentData of commentList) {
        let comment = document.createElement("a");
        let user = document.createElement("label");
        user.innerText = commentData.nombre;
        let date = document.createElement("time");
        date.innerText = commentData.fecha;
        let text = document.createElement("p");
        text.innerText = commentData.texto;
        comment.append(user, date, text);
        comments.append(comment);
    }
    comments.hidden = false;
};

const setError = (errorList) => {
    let validationBox = document.getElementById("val-box");
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");

        validationListElem.textContent = "";
        // agregar elementos inválidos al elemento val-list.
        for (let error of errorList) {
            let listElement = document.createElement("li");
            listElement.innerText = error;
            validationListElem.append(listElement);
        }
        // establecer val-msg
        validationMessageElem.innerText = "Los siguientes campos son inválidos:";

        // aplicar estilos de error
        validationBox.className = "validation-error"
        // hacer visible el mensaje de validación
        validationBox.hidden = false;
}

const validateForm = () => {
    // obtener elementos del DOM usando el nombre del formulario.
    let myForm = document.forms["myForm"];

    let name = myForm["username"].value;
    let comment = myForm["comment"].value;
    let sightingId = myForm.dataset.sightingId;


    // variables auxiliares de validación y función.
    let invalidInputs = [];
    let isValid = true;
    const setInvalidInput = (inputName) => {
        invalidInputs.push(inputName);
        isValid &&= false;
    };

    // lógica de validación
    if (!validateText(name, 3, 50)) {
        setInvalidInput("Nombre");
    }
    if (!validateText(comment, 5, 300)) {
        setInvalidInput("Comentario");
    }
    if (!sightingId || !Number.isInteger(Number(sightingId))) {
        setInvalidInput("Id de post invalida");
    }

    if (!isValid) {
        setError(invalidInputs);
    } else {
        fetch("/post_comment", {
            method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: name,
                    comment: comment,
                    sighting_id: Number(sightingId)
        })})
        .then(async (response) => {
        let ajaxResponse = await response.json();
        if (!response.ok) {
            setError(ajaxResponse["data"]);
            return null;
        }
        return ajaxResponse; // 2 parseamos el response a un json
        })
        .then((ajaxResponse) => {
            if (ajaxResponse === null) {
                return;
            }

            document.getElementById("val-box").hidden = true;
            myForm.reset();

            loadComments();
        })
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
    }
};

const loadComments = () => {
    const myForm = document.forms["myForm"];
    const sightingId = myForm.dataset.sightingId;

    fetch(`/get_comments?sighting_id=${encodeURIComponent(sightingId)}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al cargar los comentarios");
            }
            return response.json();
        })
        .then((ajaxResponse) => {
            populateCommentList(ajaxResponse.data);
        })
        .catch((error) => {
            console.error("Error al cargar comentarios:", error);
        });
};

let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateForm);

document.addEventListener("DOMContentLoaded", () => {
    loadComments();
});