

export function LoadHomeModuloDesafios(desafios) {

    const modulosContainer = document.getElementById("modules-list");
    const desafiosContainer = document.getElementById("desafios-list");
    const tituloModuloSelecionado = document.getElementById("titulo-modulo-selecionado");
    const contagemDesafiosConcluidos = document.getElementById("contagem-desafios-concluidos");

    function renderDesafios(moduloIndex) {
    
        desafiosContainer.innerHTML = "";

        tituloModuloSelecionado.textContent = desafios.getModulo(moduloIndex).titulo;
        contagemDesafiosConcluidos.textContent = `${desafios.getDesafios(moduloIndex).length} de ${desafios.getDesafios(moduloIndex).length} concluídos`;

        desafios.getDesafios(moduloIndex).forEach((desafio, index) => {
            const desafioCard = document.createElement("div");
            desafioCard.className = `challenge-card done`; // done current locked

            const desafioInfo = document.createElement("div");
            desafioInfo.className = "challenge-info";
            const desafioTitle = document.createElement("h4");
            desafioTitle.textContent = `${index + 1} - ${desafio.titulo}`;

            desafioInfo.appendChild(desafioTitle);
            desafioCard.appendChild(desafioInfo);

            const status = document.createElement("div");
            status.className = "challenge-status";
            status.textContent = 'Concluído';
            desafioCard.appendChild(status);

            desafioCard.dataset.challenge = index;
            desafioCard.addEventListener("click", () => { desafios.setDesafioAtual(moduloIndex, index); });
            desafiosContainer.appendChild(desafioCard);
        });
    }

    function renderModulos() {
        desafios.getModulos().forEach((modulo, index) => {
            const moduloItem = document.createElement("div");
            moduloItem.className = "module-item";
            moduloItem.textContent = `📦 ${modulo.titulo}`;
            moduloItem.dataset.module = index;
            moduloItem.addEventListener("click", () => { renderDesafios(moduloItem.dataset.module); });
            modulosContainer.appendChild(moduloItem);
        });
    }

    renderModulos();
}

