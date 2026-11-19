document.addEventListener("DOMContentLoaded", () => {
    const rows = document.querySelectorAll(".sighting-row");

    rows.forEach(row => {
        row.addEventListener("click", () => {
            const url = row.dataset.url;
            window.location.href = url;
        });
    });
});