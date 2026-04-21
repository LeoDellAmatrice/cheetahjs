import { settingsStore } from '../core/SettingsStore.js';

export function SettingsModalFactory(SettingsFactory) {

    let modalElement = null;
    
    function criarModal() {
        if (modalElement) return;

        modalElement = document.createElement("div");
        modalElement.className = "modal-overlay";

        modalElement.innerHTML = `
        <!-- Modal de Configurações -->
        <div id="modal-configuracoes" class="modal">
        <div class="modal-conteudo modal-config">

            <!-- Cabeçalho -->
            <div class="modal-cabecalho">
            <h2>Configurações</h2>
            <button class="modal-fechar" id="config-fechar">&times;</button>
            </div>

            <!-- Conteúdo -->
            <div class="modal-config-conteudo">

            <!-- Seção: Aparência -->
            <div class="config-secao">
                <h3>Aparência</h3>

                <div class="config-item">
                <span>Tema do Editor</span>
                <select class="config-select" id="config-theme-editor">
                    <option value="Default">Light</option>
                    <option value="railscasts" selected>Dark</option>
                </select>
                </div>

                <div class="config-item">
                <span>Tema do Site</span>
                <select class="config-select" id="config-theme-site">
                    <option value="light-mode">Light</option>
                    <option value="dark-mode" selected>Dark</option>
                </select>
                </div>

                <div class="config-item">
                <span>Tamanho da Fonte</span>
                <input id="config-font-size" class='config-input' type="number" value="16" min='10' max='60'>
                </div>
            </div>

            <!-- Seção: Editor -->
            <div class="config-secao">
                <h3>Editor</h3>

                <label class="checkbox-container">
                <input type="checkbox" id="config-autocomplete">
                <span class="checkmark"></span>
                <span class="checkbox-text">Autocomplete</span>
                </label>

                <label class="checkbox-container">
                <input type="checkbox" id="config-highlight-line">
                <span class="checkmark"></span>
                <span class="checkbox-text">Destacar linha atual</span>
                </label>

                <label class="checkbox-container">
                <input type="checkbox" id="config-clear-editor">
                <span class="checkmark"></span>
                <span class="checkbox-text">Limpar editor ao passar de desafio</span>
                </label>
            </div>
            
            <!-- Seção: FeedBack -->
            <div class="config-secao">
                <h3>FeedBack</h3>

                <label class="checkbox-container">
                <input type="checkbox" id="config-hide-pop-up">
                <span class="checkmark"></span>
                <span class="checkbox-text">Esconder PopUp (Não recomendado para novos usuarios)</span>
                </label>
            </div>

            <!-- Seção: Progresso -->
            <div class="config-secao">
                <h3>Progresso</h3>

                <div class="config-item alerta">
                <span>Reiniciar progresso</span>
                <button class="btn btn-danger" id="config-reset-desafio">
                    Resetar
                </button>
                </div>
            </div>

            </div>

            <!-- Rodapé -->
            <div class="modal-rodape">
            <button class="btn btn-danger" id="config-reset">
                Resetar configurações
            </button>
            <button class="btn btn-primario" id="config-sair">
                Fechar
            </button>
            </div>

        </div>
        </div>
        `;


        document.body.appendChild(modalElement);

        initConfigs();

        initModalButtons();

    }

    function showModal() {
        criarModal();
        modalElement.style.display = "flex";
    }

    function closeModal() {
        modalElement.style.display = "none";
    }

    function resetConfig(){
        settingsStore.setDefault();
        SettingsFactory.applyAll();

        initConfigs();
    }

    function initConfigs(){

        const settings = settingsStore.getAll()

        console.log(settings)

        document.getElementById('config-theme-editor').value = settings.theme;

        document.getElementById('config-theme-site').value = settings.themeSite;

        document.getElementById("config-font-size").value = settings.fontSize;

        document.getElementById("config-autocomplete").checked = settings.autocomplete;

        document.getElementById('config-highlight-line').checked = settings.highlightLine;

        document.getElementById("config-clear-editor").checked = settings.clearEditor;

        document.getElementById("config-hide-pop-up").checked = settings.hidePopUp;
    }

    function initModalButtons() {

        document.getElementById('config-fechar').onclick = closeModal;

        document.getElementById('config-sair').onclick = closeModal;

        document.getElementById("config-reset").onclick = resetConfig;

        document.getElementById("config-reset-desafio").onclick = SettingsFactory.resetDesafio;

        document.getElementById('config-theme-editor').onchange = (e) => {
            SettingsFactory.update('theme', e.target.value);
        };

        document.getElementById('config-theme-site').onchange = (e) => {
            SettingsFactory.update('themeSite', e.target.value);
        };

        document.getElementById('config-font-size').onchange = (e) => {
            SettingsFactory.update('fontSize', Number(e.target.value));
        };

        document.getElementById('config-autocomplete').onchange = (e) => {
            SettingsFactory.update('autocomplete', e.target.checked);
        };

        document.getElementById('config-highlight-line').onchange = (e) => {
            SettingsFactory.update('highlightLine', e.target.checked);
        };

        document.getElementById('config-clear-editor').onchange = (e) => {
            SettingsFactory.update('clearEditor', e.target.checked)
        }

        document.getElementById("config-hide-pop-up").onchange = (e) => {
            SettingsFactory.update("hidePopUp", e.target.checked)
        }

    }

    return {
        show: showModal,
        close: closeModal
    };
}
