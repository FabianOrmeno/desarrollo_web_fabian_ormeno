let inputSearch = document.getElementById("filter-text");

let sightingsList = document.getElementById("sightings-list");

let valBox = document.getElementById("val-box");

let getEntry = (field) => {
    return Object.entries(field)[0];
};

let populateMatchList = (sightings, text) => {
    sightingsList.innerHTML = "";
    if (sightings.length === 0) {
        valBox.hidden = false;
        return;
    }
    valBox.hidden = true;

    sightings.forEach((sighting) => {
        let row = document.createElement("tr");

        let nombreEntry = getEntry(sighting.nombre);
        let voluntarioEntry = getEntry(sighting.voluntario);
        let comunaEntry = getEntry(sighting.comuna);
        let fechaEntry = getEntry(sighting.fecha);
        let promedioEntry = getEntry(sighting.promedio);

        let nombre = document.createElement("td");
        nombre.textContent = nombreEntry[0];

        let voluntario = document.createElement("td");
        voluntario.textContent = voluntarioEntry[0];

        let comuna = document.createElement("td");
        comuna.textContent = comunaEntry[0];

        let fecha = document.createElement("td");
        fecha.textContent = fechaEntry[0];

        let nota = document.createElement("td");
        nota.textContent = promedioEntry[0];

        let evaluar = document.createElement("td");

        let form = document.createElement("form");
        form.className = "evaluate-form";

        let id = document.createElement("input");
        id.type = "hidden";
        id.className = "id";
        id.name = "id";
        id.value = Object.keys(sighting.id)[0];

        let input = document.createElement("input");
        input.type = "number";
        input.className = "nota";
        input.name = "nota";
        input.min = "1";
        input.max = "7";
        input.step = "1";
        input.placeholder = "Ej: 6";
        input.required = true;

        let button = document.createElement("button");
        button.type = "submit";
        button.textContent = "Evaluar";

        form.append(id, input, button);

        evaluar.appendChild(form);

        if (text != "") {
            if (nombreEntry[1]) nombre.style.backgroundColor = "yellow";
            if (voluntarioEntry[1]) voluntario.style.backgroundColor = "yellow";
            if (comunaEntry[1]) comuna.style.backgroundColor = "yellow";
            if (fechaEntry[1]) fecha.style.backgroundColor = "yellow";
        }

        row.append(nombre, voluntario, comuna, fecha, nota, evaluar);
        sightingsList.appendChild(row);
    });
};

let filter_sighting = () => {
    let text = inputSearch.value.trim().toLowerCase();
    fetch(`/filter-by?filterText=${encodeURIComponent(text)}`) // 1 acceder al url
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json(); // 2 parseamos el response a un json
    })
    .then((ajaxResponse) => {
        populateMatchList(ajaxResponse.sightings, text);
    })
    .catch((error) => {
        console.error(
            "There has been a problem with your fetch operation:",
            error
        );
    });
}

inputSearch.addEventListener("input", filter_sighting);

inputSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
    }
});

document.addEventListener("submit", (event) => {

    let form = event.target.closest(".evaluate-form");

    if (!form) return;

    event.preventDefault();

    let id = form.querySelector(".id").value;
    let input = form.querySelector(".nota");

    let valor = input.value;
    let nota = Number(valor);

    if (!Number.isInteger(nota) || nota < 1 || nota > 7) {
        return;
    }

    fetch("/evaluate-sight", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams({id: id, nota: valor})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        console.log("Saved correctly");

        filter_sighting();
    })
    .catch(error => {
        console.error("There has been a problem:", error);
    });

});