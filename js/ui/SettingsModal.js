import { settingsStore } from '../core/SettingsStore.js';
import { criarModal, ICONE_FECHAR } from "./Modal.js";

const FONTE_MIN = 10;
const FONTE_MAX = 32;

export function SettingsModalFactory(SettingsFactory, { abrirIntroducao } = {}) {

    let modal = null;

    function criarModalConfig() {
        if (modal) return;

        modal = criarModal({
            tituloId: "config-titulo",
            classe: "modal-config",
            html: `
                <header class="modal-topo">
                    <div>
                        <h2 id="config-titulo">Configurações</h2>
                        <p class="muted small">Deixe o CheetahJS do seu jeito.</p>
                    </div>
                    <button type="button" class="icon-button modal-fechar" id="config-fechar" aria-label="Fechar configurações">
                        ${ICONE_FECHAR}
                    </button>
                </header>

                <div class="modal-corpo">

                    <!-- Aparência -->
                    <section class="config-secao">
                        <h3 class="config-rotulo">Aparência</h3>
                        <div class="config-grupo">
                            <div class="config-item">
                                <div class="config-texto">
                                    <label for="config-theme-site">Tema do site</label>
                                    <span>Cores da interface</span>
                                </div>
                                <select class="config-select" id="config-theme-site">
                                    <option value="dark-mode">Escuro</option>
                                    <option value="light-mode">Claro</option>
                                </select>
                            </div>

                            <div class="config-item">
                                <div class="config-texto">
                                    <label for="config-theme-editor">Tema do editor</label>
                                    <span>Cores do código</span>
                                </div>
                                <select class="config-select" id="config-theme-editor">
                                    <option value="railscasts">Escuro</option>
                                    <option value="default">Claro</option>
                                </select>
                            </div>

                            <div class="config-item">
                                <div class="config-texto">
                                    <label for="config-font-size">Tamanho da fonte</label>
                                    <span>Texto do editor, em pixels</span>
                                </div>
                                <div class="stepper">
                                    <button type="button" class="stepper-btn" data-passo="-1" aria-label="Diminuir fonte">−</button>
                                    <input id="config-font-size" class="stepper-input" type="number" min="${FONTE_MIN}" max="${FONTE_MAX}" inputmode="numeric">
                                    <button type="button" class="stepper-btn" data-passo="1" aria-label="Aumentar fonte">+</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Editor -->
                    <section class="config-secao">
                        <h3 class="config-rotulo">Editor</h3>
                        <div class="config-grupo">
                            <label class="config-item">
                                <span class="config-texto">
                                    <span class="config-nome">Autocomplete</span>
                                    <span>Sugere palavras que você já desbloqueou</span>
                                </span>
                                <input type="checkbox" role="switch" class="switch" id="config-autocomplete">
                            </label>

                            <label class="config-item">
                                <span class="config-texto">
                                    <span class="config-nome">Destacar linha atual</span>
                                    <span>Realça a linha onde está o cursor</span>
                                </span>
                                <input type="checkbox" role="switch" class="switch" id="config-highlight-line">
                            </label>

                            <label class="config-item">
                                <span class="config-texto">
                                    <span class="config-nome">Começar desafios em branco</span>
                                    <span>Limpa o editor ao ir para um desafio sem código inicial</span>
                                </span>
                                <input type="checkbox" role="switch" class="switch" id="config-clear-editor">
                            </label>
                        </div>
                    </section>

                    <!-- Feedback -->
                    <section class="config-secao">
                        <h3 class="config-rotulo">Feedback</h3>
                        <div class="config-grupo">
                            <label class="config-item">
                                <span class="config-texto">
                                    <span class="config-nome">Esconder pop-ups</span>
                                    <span>Não recomendado para quem está começando</span>
                                </span>
                                <input type="checkbox" role="switch" class="switch" id="config-hide-pop-up">
                            </label>
                        </div>
                    </section>

                    <!-- Ajuda -->
                    <section class="config-secao">
                        <h3 class="config-rotulo">Ajuda</h3>
                        <div class="config-grupo">
                            <div class="config-item">
                                <div class="config-texto">
                                    <span class="config-nome">Introdução</span>
                                    <span>Veja de novo como o CheetahJS funciona</span>
                                </div>
                                <button type="button" class="btn btn-ghost btn-sm" id="config-rever-intro">Rever</button>
                            </div>
                        </div>
                    </section>

                    <!-- Progresso -->
                    <section class="config-secao">
                        <h3 class="config-rotulo">Progresso</h3>
                        <div class="config-grupo config-perigo">
                            <div class="config-item">
                                <div class="config-texto">
                                    <span class="config-nome">Reiniciar progresso</span>
                                    <span>Apaga todos os desafios concluídos. Não dá para desfazer.</span>
                                </div>
                                <button type="button" class="btn btn-danger btn-sm" id="config-reset-desafio">Reiniciar</button>
                            </div>
                        </div>
                    </section>
                </div>

                <footer class="modal-rodape">
                    <button type="button" class="btn btn-ghost" id="config-reset">Restaurar padrões</button>
                    <button type="button" class="btn btn-accent" id="config-sair" data-foco-inicial>Pronto</button>
                </footer>
            `
        });

        initModalButtons();
    }

    function showModal() {
        criarModalConfig();
        initConfigs(); // sempre mostra os valores atuais
        modal.abrir();
    }

    function closeModal() {
        modal?.fechar();
    }

    function resetConfig() {
        settingsStore.setDefault();
        SettingsFactory.applyAll();
        initConfigs();
    }

    function initConfigs() {
        const settings = settingsStore.getAll();
        const $ = (id) => modal.dialog.querySelector(`#${id}`);

        // saves antigos podiam ter "Default" com D maiúsculo
        $("config-theme-editor").value = settings.theme === "Default" ? "default" : settings.theme;
        $("config-theme-site").value = settings.themeSite;
        $("config-font-size").value = settings.fontSize;
        $("config-autocomplete").checked = settings.autocomplete;
        $("config-highlight-line").checked = settings.highlightLine;
        $("config-clear-editor").checked = settings.clearEditor;
        $("config-hide-pop-up").checked = settings.hidePopUp;
    }

    function definirFonte(valor) {
        const tamanho = Math.min(FONTE_MAX, Math.max(FONTE_MIN, Math.round(Number(valor) || 16)));
        modal.dialog.querySelector("#config-font-size").value = tamanho;
        SettingsFactory.update("fontSize", tamanho);
    }

    // Reiniciar progresso pede confirmação: o primeiro clique só "arma" o botão
    let timerConfirmacao = null;

    function reiniciarProgresso(botao) {
        if (botao.classList.contains("confirmando")) {
            SettingsFactory.resetDesafio();
            return;
        }
        botao.classList.add("confirmando");
        botao.textContent = "Tem certeza? Clique de novo";
        clearTimeout(timerConfirmacao);
        timerConfirmacao = setTimeout(() => {
            botao.classList.remove("confirmando");
            botao.textContent = "Reiniciar";
        }, 4000);
    }

    function initModalButtons() {
        const $ = (id) => modal.dialog.querySelector(`#${id}`);

        $("config-fechar").onclick = closeModal;
        $("config-sair").onclick = closeModal;
        $("config-reset").onclick = resetConfig;
        $("config-reset-desafio").onclick = (e) => reiniciarProgresso(e.currentTarget);

        $("config-rever-intro").onclick = () => {
            closeModal();
            abrirIntroducao?.();
        };

        $("config-theme-editor").onchange = (e) => SettingsFactory.update("theme", e.target.value);
        $("config-theme-site").onchange = (e) => SettingsFactory.update("themeSite", e.target.value);
        $("config-font-size").onchange = (e) => definirFonte(e.target.value);

        modal.dialog.querySelectorAll(".stepper-btn").forEach((btn) => {
            btn.onclick = () => definirFonte(Number($("config-font-size").value) + Number(btn.dataset.passo));
        });

        $("config-autocomplete").onchange = (e) => SettingsFactory.update("autocomplete", e.target.checked);
        $("config-highlight-line").onchange = (e) => SettingsFactory.update("highlightLine", e.target.checked);
        $("config-clear-editor").onchange = (e) => SettingsFactory.update("clearEditor", e.target.checked);
        $("config-hide-pop-up").onchange = (e) => SettingsFactory.update("hidePopUp", e.target.checked);
    }

    return {
        show: showModal,
        close: closeModal
    };
}
