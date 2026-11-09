import { criarModal, ICONE_FECHAR } from "./Modal.js";

const INTRO_KEY = "intro_modal_v2";

// ---------------------------------------------------------------------
// Conteúdo de cada passo da introdução
// ---------------------------------------------------------------------
const PASSOS = [
    {
        icone: "🐆",
        titulo: "Bem-vindo ao CheetahJS!",
        conteudo: `
            <p class="intro-lead">
                Aqui você aprende <strong>lógica de programação</strong> escrevendo JavaScript de verdade,
                direto no navegador. Sem instalar nada.
            </p>
            <div class="intro-preview" aria-hidden="true">
                <div class="intro-preview-barra">
                    <span></span><span></span><span></span>
                    <em>main.js</em>
                </div>
                <pre class="intro-preview-codigo"><span class="t-obj">console</span>.<span class="t-fn">log</span>(<span class="t-str">"Olá, Mundo!"</span>)</pre>
                <div class="intro-preview-saida"><span class="t-seta">›</span> Olá, Mundo!</div>
            </div>
        `
    },
    {
        icone: "🧭",
        titulo: "Como funciona",
        conteudo: `
            <ol class="intro-passos">
                <li>
                    <span class="intro-num">1</span>
                    <div>
                        <strong>Leia o conceito</strong>
                        <p>Cada desafio começa com uma explicação curta e um exemplo.</p>
                    </div>
                </li>
                <li>
                    <span class="intro-num">2</span>
                    <div>
                        <strong>Escreva e execute</strong>
                        <p>Programe no editor e veja o resultado no console na hora.</p>
                    </div>
                </li>
                <li>
                    <span class="intro-num">3</span>
                    <div>
                        <strong>Avance na trilha</strong>
                        <p>Ao concluir, o próximo desafio é liberado e novas palavras entram no autocomplete.</p>
                    </div>
                </li>
            </ol>
        `
    },
    {
        icone: "💡",
        titulo: "Para não travar",
        conteudo: `
            <ul class="intro-dicas">
                <li><span><kbd>Ctrl</kbd> + <kbd>Enter</kbd></span> Executa o seu código</li>
                <li><span><kbd>Ctrl</kbd> + <kbd>→</kbd> / <kbd>←</kbd></span> Próximo / anterior desafio</li>
                <li><span class="intro-chip">💡 Ver dica</span> Uma pista quando você empacar</li>
            </ul>
            <p class="intro-nota">
                Errar faz parte! Quando algo der errado, o console mostra a linha e explica o que aconteceu.
            </p>
        `
    },
    {
        icone: "🚀",
        titulo: "Tudo pronto!",
        conteudo: `
            <p class="intro-lead">
                Seu progresso fica salvo neste navegador, então você pode parar e voltar quando quiser.
            </p>
            <p class="intro-nota">
                O primeiro desafio leva menos de um minuto. Você pode rever esta introdução
                quando quiser em <strong>Configurações</strong>.
            </p>
        `
    }
];

export function IntroModalFactory() {

    let modal = null;
    let passoAtual = 0;

    function marcarComoVisto() {
        try { localStorage.setItem(INTRO_KEY, "true"); } catch { /* sem storage: só não lembra */ }
    }

    function jaViuIntroducao() {
        try { return localStorage.getItem(INTRO_KEY) === "true"; } catch { return false; }
    }

    function criar() {
        if (modal) return;

        const paginas = PASSOS.map((passo, i) => `
            <section class="intro-pagina" data-passo="${i}" ${i === 0 ? "" : "hidden"}>
                ${passo.conteudo}
            </section>`).join("");

        const pontos = PASSOS.map((_, i) => `
            <button type="button" class="intro-ponto" data-ir="${i}" aria-label="Ir para o passo ${i + 1}"></button>`).join("");

        modal = criarModal({
            tituloId: "intro-titulo",
            classe: "modal-intro",
            aoFechar: marcarComoVisto,
            aoTeclar: (e) => {
                if (e.target.closest("input, select, textarea")) return;
                if (e.key === "ArrowRight") irPara(passoAtual + 1);
                if (e.key === "ArrowLeft") irPara(passoAtual - 1);
            },
            html: `
                <header class="intro-topo">
                    <div class="intro-icone" id="intro-icone" aria-hidden="true">${PASSOS[0].icone}</div>
                    <div>
                        <span class="eyebrow" id="intro-contador">Passo 1 de ${PASSOS.length}</span>
                        <h2 id="intro-titulo">${PASSOS[0].titulo}</h2>
                    </div>
                    <button type="button" class="icon-button modal-fechar" data-acao="fechar" aria-label="Fechar introdução">
                        ${ICONE_FECHAR}
                    </button>
                </header>

                <div class="modal-corpo">${paginas}</div>

                <footer class="modal-rodape">
                    <div class="intro-pontos">${pontos}</div>
                    <div class="modal-acoes">
                        <button type="button" class="btn btn-ghost" id="intro-voltar">Pular</button>
                        <button type="button" class="btn btn-accent" id="intro-proximo" data-foco-inicial>Próximo →</button>
                    </div>
                </footer>
            `
        });

        const d = modal.dialog;
        d.querySelector("[data-acao='fechar']").addEventListener("click", modal.fechar);
        d.querySelectorAll(".intro-ponto").forEach((p) =>
            p.addEventListener("click", () => irPara(Number(p.dataset.ir))));

        d.querySelector("#intro-voltar").addEventListener("click", () => {
            if (passoAtual === 0) modal.fechar(); // no primeiro passo o botão é "Pular"
            else irPara(passoAtual - 1);
        });

        d.querySelector("#intro-proximo").addEventListener("click", () => {
            if (passoAtual < PASSOS.length - 1) {
                irPara(passoAtual + 1);
            } else {
                modal.fechar();
                // Leva direto ao primeiro desafio pendente
                document.getElementById("btn-continuar")?.click();
            }
        });

        atualizar();
    }

    function irPara(indice) {
        if (indice < 0 || indice >= PASSOS.length || indice === passoAtual) return;
        const direcao = indice > passoAtual ? "avancar" : "voltar";
        passoAtual = indice;
        atualizar(direcao);
    }

    function atualizar(direcao) {
        const d = modal.dialog;
        const passo = PASSOS[passoAtual];
        const ultimo = passoAtual === PASSOS.length - 1;

        d.querySelector("#intro-titulo").textContent = passo.titulo;
        d.querySelector("#intro-icone").textContent = passo.icone;
        d.querySelector("#intro-contador").textContent = `Passo ${passoAtual + 1} de ${PASSOS.length}`;

        d.querySelectorAll(".intro-pagina").forEach((pagina) => {
            const ativa = Number(pagina.dataset.passo) === passoAtual;
            pagina.hidden = !ativa;
            pagina.classList.remove("entra-avancar", "entra-voltar");
            if (ativa && direcao) pagina.classList.add(`entra-${direcao}`);
        });

        d.querySelectorAll(".intro-ponto").forEach((ponto) => {
            const ativo = Number(ponto.dataset.ir) === passoAtual;
            ponto.classList.toggle("ativo", ativo);
            if (ativo) ponto.setAttribute("aria-current", "step");
            else ponto.removeAttribute("aria-current");
        });

        d.querySelector("#intro-voltar").textContent = passoAtual === 0 ? "Pular" : "← Voltar";
        d.querySelector("#intro-proximo").textContent = ultimo ? "Começar a programar 🚀" : "Próximo →";
    }

    function show() {
        criar();
        passoAtual = 0;
        atualizar();
        modal.abrir();
    }

    function close() {
        modal?.fechar();
    }

    if (!jaViuIntroducao()) {
        show();
    }

    return { show, close };
}
