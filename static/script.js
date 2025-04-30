document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("category");
    const saveButton = document.getElementById("saveButton");
    const clearButton = document.getElementById("clearButton");
    const TotalClear =  document.getElementById("clearTotal")
    const output = document.getElementById("output");
    const API_URL = "http://127.0.0.1:8001";

    function getSelectedData() {
        const selectedCategory = categorySelect.value;
        if (!selectedCategory ) return [];

        return Array.from(document.querySelectorAll(".cycle:checked")).map(cb => ({
            description: cb.dataset.description,
            cycle: parseInt(cb.dataset.cycle, 10),
            business_unit: selectedCategory
        }));
    }

    function updateSummaryAndTotals() {
        const selectedCategory = categorySelect.value;
        if (!selectedCategory) return;

        const checkedCycles = Array.from(document.querySelectorAll(".cycle:checked"));
        const results = checkedCycles.map(cb => ({
            description: cb.dataset.description,
            cycle: parseInt(cb.dataset.cycle, 10),
            category: selectedCategory
        }));

        results.sort((a, b) => a.cycle - b.cycle || a.description.localeCompare(b.description));

        // Calcular totales por descripción
        const totals = {};
        results.forEach(({ description }) => {
            totals[description] = (totals[description] || 0) + 1;
        });

        // Actualizar tabla de Resumen
        const totalsBody = document.querySelector(`#${selectedCategory}Totals tbody`);
        totalsBody.innerHTML = Object.entries(totals).map(([desc, count]) =>
            `<tr><td>${desc}</td><td>${count}</td></tr>`).join('');

        // Actualizar tabla de Parrilla
        const summaryBody = document.querySelector(`#${selectedCategory}Summary tbody`);
        summaryBody.innerHTML = results.map(({ cycle, description }) =>
            `<tr><td>${cycle}</td><td>${description}</td><td>${selectedCategory}</td></tr>`).join('');
    }

    async function saveSelection() {
        const selections = getSelectedData();
        if (selections.length === 0) return;
    
        output.innerHTML = "Guardando...";
    
        const selectedCategory = categorySelect.value;
    
        try {
            // Primero eliminamos las selecciones anteriores
            await fetch(`${API_URL}/clear/${selectedCategory}`, { method: "DELETE" });
    
            // Luego guardamos todas las nuevas selecciones en una sola petición
            const response = await fetch(`${API_URL}/save/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selections)  // Ahora enviamos todas las selecciones en un solo array
            });
    
            if (response.ok) {
                output.innerHTML = "Selección guardada con éxito";
            } else {
                output.innerHTML = "Error al guardar la selección";
            }
    
        } catch (error) {
            console.error("Error al guardar la selección:", error);
            output.innerHTML = "Error en la operación";
        }
    
        updateSummaryAndTotals();
    }

    async function loadSelections() {
        const selectedCategory = categorySelect.value;
        if (!selectedCategory) return;

        const response = await fetch(`${API_URL}/selections/${selectedCategory}`);
        const data = await response.json();

        document.querySelectorAll(".cycle").forEach(cb => {
            cb.checked = false;
        });

        data.forEach(({ description, cycle }) => {
            const checkbox = document.querySelector(`.cycle[data-description='${description}'][data-cycle='${cycle}']`);
            if (checkbox) checkbox.checked = true;
        });

        updateSummaryAndTotals();
    }

    async function clearSelections() {
        const selectedCategory = categorySelect.value;
        if (!selectedCategory) return;

        output.innerHTML = "Eliminando...";
        await fetch(`${API_URL}/clear/${selectedCategory}`, { method: "DELETE" });

        document.querySelectorAll(".cycle").forEach(cb => {
            cb.checked = false;
        });
        output.innerHTML = "Selecciones eliminadas";
        updateSummaryAndTotals();
    }

    async function clearSelectionsTot() {
        const selectedCategory = categorySelect.value;
        if (!selectedCategory) return;

        output.innerHTML = "Eliminando...";
        await fetch(`${API_URL}/cleartot/${selectedCategory}`, { method: "DELETE" });

        document.querySelectorAll(".cycle").forEach(cb => {
            cb.checked = false;
        });
        output.innerHTML = "Selecciones eliminadas";
        updateSummaryAndTotals();
    }

saveButton.addEventListener("click", saveSelection);
categorySelect.addEventListener("change", loadSelections);
clearButton.addEventListener("click", clearSelections);
TotalClear.addEventListener("click", clearSelectionsTot);

document.querySelectorAll(".select-all").forEach(button => {
    button.addEventListener("click", () => {
        const rowDescription = button.getAttribute("data-row");
        const checkboxes = document.querySelectorAll(`.cycle[data-description="${rowDescription}"]`);
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);

        checkboxes.forEach(cb => cb.checked = !allChecked);
        updateSummaryAndTotals();
    });
});

    // Inicializar resumen y totales al cargar la página
    updateSummaryAndTotals();
});