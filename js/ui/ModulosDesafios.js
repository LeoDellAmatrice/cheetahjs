

export function ModulosDesafios(desafios) {
    const modulosContainer = document.getElementById("modules-list");
    const desafiosContainer = document.getElementById("desafios-list");



    function renderDesafios(moduloIndex) {
        desafiosContainer.innerHTML = ""; // Limpa os desafios anteriores
        
    }

    function renderModulos() {
        desafios.getAllModulos().forEach((modulo, index) => {
            const moduloItem = document.createElement("div");
            moduloItem.className = "module-item";
            moduloItem.textContent = `📦 ${modulo.title}`;
            moduloItem.dataset.module = index;
            moduloItem.addEventListener("click", () => { renderDesafios(index); });
            modulosContainer.appendChild(moduloItem);
        });
    }

    renderModulos();
}