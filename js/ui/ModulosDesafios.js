// =====================================================================
// ModulosDesafios
// ---------------------------------------------------------------------
// Monta a Home (resumo de progresso, trilha de módulos e lista de
// desafios) e preenche o painel do desafio na página do editor.
// Tudo é calculado a partir do progresso salvo, nada fica fixo no HTML.
// =====================================================================

// Nível do aluno conforme a % da trilha concluída. Ajuste à vontade!
const NIVEIS = [
    { min: 0, nome: "Filhote" },
    { min: 0.25, nome: "Explorador" },
    { min: 0.5, nome: "Caçador" },
    { min: 0.75, nome: "Velocista" },
    { min: 1, nome: "Mestre Cheetah" }
];

const ICONE_STATUS = { done: "✓", current: "▶" };

// Pequeno helper para criar elementos sem usar innerHTML
function el(tag, className, text) {
    const elemento = document.createElement(tag);
    if (className) elemento.className = className;
    if (text !== undefined) elemento.textContent = text;
    return elemento;
}

export function LoadHomeModuloDesafios(desafios, pagesControl) {

    const $ = (id) => document.getElementById(id);

    const modulosContainer = $("modules-list");
    const desafiosContainer = $("desafios-list");

    // Começa pelo ponto onde o aluno parou
    const inicio = desafios.getPontoDeContinuacao();
    desafios.setDesafioAtual(inicio.modulo, inicio.desafio);
    let moduloSelecionado = inicio.modulo;

    // -----------------------------------------------------------------
    // HOME: resumo de progresso
    // -----------------------------------------------------------------
    function renderResumo() {
        const modulos = desafios.getModulos();

        let total = 0;
        let feitos = 0;
        let modulosCompletos = 0;

        modulos.forEach((modulo, i) => {
            const qtd = modulo.Desafios.length;
            const concluidos = desafios.getConcluidos(i);
            total += qtd;
            feitos += concluidos;
            if (concluidos >= qtd) modulosCompletos++;
        });

        const percentual = total ? feitos / total : 0;
        const nivel = NIVEIS.filter((n) => percentual >= n.min).pop();

        $("nivel-atual").textContent = nivel.nome;
        $("stat-desafios").textContent = `${feitos} de ${total}`;
        $("stat-desafios-bar").style.width = `${Math.round(percentual * 100)}%`;
        $("stat-desafios-bar").parentElement.setAttribute("aria-valuenow", Math.round(percentual * 100));
        $("stat-modulos").textContent = `${modulosCompletos}/${modulos.length}`;
        $("stat-percentual").textContent = `${Math.round(percentual * 100)}%`;

        renderContinuar(feitos);
    }

    function renderContinuar(feitos) {
        const ponto = desafios.getPontoDeContinuacao();
        const info = $("continuar-info");
        info.replaceChildren();

        if (ponto.tudoConcluido) {
            $("btn-continuar-label").textContent = "Revisar desafios";
            info.textContent = "Você concluiu toda a trilha! 🎉";
            return;
        }

        const modulo = desafios.getModulo(ponto.modulo);
        const desafio = desafios.getDesafio(ponto.modulo, ponto.desafio);

        $("btn-continuar-label").textContent = feitos === 0 ? "Começar agora" : "Continuar de onde parei";
        info.append(`${modulo.titulo} · `, el("strong", null, desafio.titulo));
    }

    function continuar() {
        const ponto = desafios.getPontoDeContinuacao();
        desafios.setDesafioAtual(ponto.modulo, ponto.desafio);
        LoadEditorPageDesafio();
    }

    // -----------------------------------------------------------------
    // HOME: lista de módulos
    // -----------------------------------------------------------------
    function renderModulos() {
        modulosContainer.replaceChildren();

        desafios.getModulos().forEach((modulo, index) => {
            const total = modulo.Desafios.length;
            const concluidos = desafios.getConcluidos(index);
            const completo = concluidos >= total;
            const ativo = index === moduloSelecionado;

            const item = el("button", "module-item");
            item.type = "button";
            item.setAttribute("role", "tab");
            item.setAttribute("aria-selected", String(ativo));
            item.classList.toggle("active", ativo);
            item.classList.toggle("complete", completo);

            const indice = el("span", "module-index", completo ? "✓" : String(index + 1));

            const info = el("span", "module-info");
            const barra = el("span", "progress");
            const preenchimento = el("span", "progress-fill");
            preenchimento.style.display = "block";
            preenchimento.style.width = `${(concluidos / total) * 100}%`;
            barra.append(preenchimento);
            info.append(el("span", "module-title", modulo.titulo), barra);

            const contagem = el("span", "module-count", `${concluidos}/${total}`);

            item.append(indice, info, contagem);
            item.addEventListener("click", () => selecionarModulo(index));
            modulosContainer.append(item);
        });
    }

    function selecionarModulo(index) {
        moduloSelecionado = Number(index);
        renderModulos();
        renderDesafios(moduloSelecionado);
    }

    // -----------------------------------------------------------------
    // HOME: desafios do módulo selecionado
    // -----------------------------------------------------------------
    function renderDesafios(moduloIndex) {
        const modulo = desafios.getModulo(moduloIndex);
        const lista = desafios.getDesafios(moduloIndex);

        $("titulo-modulo-selecionado").textContent = modulo.titulo;
        $("descricao-modulo-selecionado").textContent = modulo.description ?? "";
        $("contagem-desafios-concluidos").textContent =
            `${desafios.getConcluidos(moduloIndex)} de ${lista.length} concluídos`;

        desafiosContainer.replaceChildren();

        lista.forEach((desafio, index) => {
            const status = desafios.getDesafioStatus(moduloIndex, index);
            const bloqueado = status.style === "locked";

            const card = el("button", `challenge-card ${status.style}`);
            card.type = "button";
            if (bloqueado) {
                card.setAttribute("aria-disabled", "true");
                card.title = "Conclua o desafio anterior para desbloquear";
            }

            card.append(
                el("span", "challenge-icon", ICONE_STATUS[status.style] ?? String(index + 1)),
                el("span", "challenge-title", `${index + 1}. ${desafio.titulo}`),
                el("span", "challenge-status", bloqueado ? "🔒 Bloqueado" : status.text)
            );

            if (!bloqueado) {
                card.addEventListener("click", () => {
                    desafios.setDesafioAtual(moduloIndex, index);
                    LoadEditorPageDesafio();
                });
            }

            desafiosContainer.append(card);
        });
    }

    // -----------------------------------------------------------------
    // EDITOR: painel do desafio
    // -----------------------------------------------------------------
    const btnDica = $("btn-dica");
    const textoDica = $("dica");

    btnDica.addEventListener("click", () => {
        const abrir = textoDica.hidden;
        textoDica.hidden = !abrir;
        btnDica.setAttribute("aria-expanded", String(abrir));
        btnDica.textContent = abrir ? "💡 Esconder dica" : "💡 Ver dica";
    });

    function atualizarStatusEditor() {
        const status = desafios.getDesafioStatus();
        const badge = $("desafio-status");
        badge.className = `status-badge ${status.style}`;
        badge.textContent = status.style === "done" ? "✓ Concluído" : "Em andamento";
    }

    function LoadEditorPageDesafio(navigate = true) {
        const dados = desafios.getDesafio();
        const modulo = desafios.getModulo();
        const indice = desafios.getIndexDesafio();

        $("desafio-modulo").textContent = modulo.titulo;
        $("desafio-number").textContent = `Desafio ${indice + 1} de ${desafios.getDesafios().length}`;
        $("titulo").textContent = dados.titulo;
        $("instrucoes").textContent = dados.instrucoes;

        // Dica: sempre começa escondida
        const semPrefixo = (dados.tip ?? "").replace(/^💡\s*Dica:\s*/u, "");
        const dica = semPrefixo.charAt(0).toUpperCase() + semPrefixo.slice(1);
        textoDica.textContent = dica;
        textoDica.hidden = true;
        btnDica.hidden = !dica;
        btnDica.setAttribute("aria-expanded", "false");
        btnDica.textContent = "💡 Ver dica";

        $("btn-anterior").disabled = indice === 0;

        atualizarStatusEditor();

        // Ao voltar para a Home, mostra o módulo em que o aluno está
        moduloSelecionado = desafios.getIndexModulo();
        atualizar();

        if (navigate) {
            pagesControl.navigateTo("editor");
        }
    }

    // Re-renderiza tudo (ex.: depois de concluir um desafio)
    function atualizar() {
        renderResumo();
        renderModulos();
        renderDesafios(moduloSelecionado);
        atualizarStatusEditor();
    }

    $("btn-continuar").addEventListener("click", continuar);

    atualizar();

    return {
        LoadEditorPageDesafio,
        atualizar
    };
}
