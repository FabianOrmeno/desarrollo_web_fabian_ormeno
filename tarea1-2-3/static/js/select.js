const regionSelect = document.getElementById("select-region");
const comunaSelect = document.getElementById("select-comuna");

regionSelect.addEventListener("change", async () => {

    let regionId = regionSelect.value;
    comunaSelect.innerHTML =
        '<option value="">Seleccione una comuna</option>';

    if (!regionId) {
        return;
    }

    try {
        let response = await fetch(`/comunas/${regionId}`);
        if (!response.ok) {
            throw new Error("Error al obtener las comunas");
        }
        let comunas = await response.json();
        comunas.forEach(comuna => {

            let option = document.createElement("option");

            option.value = comuna.id;
            option.textContent = comuna.nombre;

            comunaSelect.appendChild(option);
        });

    } catch (error) {
        console.error(error);
    }
});
