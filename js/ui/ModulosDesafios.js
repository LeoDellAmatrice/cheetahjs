

export function LoadHomeModuloDesafios(desafios, pagesControl) {

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
            const statusDesafio = desafios.getDesafioStatus(moduloIndex, index);
            desafioCard.className = `challenge-card ${statusDesafio}`; // done current locked

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
            desafioCard.dataset.module = moduloIndex;
            if (statusDesafio !== "locked") {
                desafioCard.addEventListener("click", () => { desafios.setDesafioAtual(desafioCard.dataset.module, desafioCard.dataset.challenge); LoadEditorPageDesafio(); });
            }
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

    function LoadEditorPageDesafio() {
        const dados = desafios.getDesafio();

        // document.getElementById("desafio-number").textContent =
        //     `Desafio ${ -1 + 1}`;

        document.getElementById("titulo").textContent = dados.titulo;
        document.getElementById("instrucoes").textContent = dados.instrucoes;

        pagesControl.navigateTo("editor");
    }

    renderModulos();

    return {
        LoadEditorPageDesafio
    };
}

