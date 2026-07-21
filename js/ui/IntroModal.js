const INTRO_KEY = "intro_modal_v1";

export function IntroModalFactory() {

    let modalElement = null;
    let paginaAtual = 1;
    const totalPaginas = 4;

    function criarModal() {
        if (modalElement) return;

        modalElement = document.createElement("div");
        modalElement.className = "modal-overlay";

        modalElement.innerHTML = `
        <!-- Modal de Boas-Vindas com Páginas -->
        <div id="modal-bemvindo" class="modal">
        <div class="modal-conteudo">
            <!-- Cabeçalho fixo -->
            <div class="modal-cabecalho">
            <img src="assets/img/logo_01js.png" width="36" heigth="36">
            <h2 id="intro-modal-titulo">Bem-vindo ao CheetahJS!</h2>
            <div class="modal-indicadores">
                <span class="indicador ativo" data-pagina="1"></span>
                <span class="indicador" data-pagina="2"></span>
                <span class="indicador" data-pagina="3"></span>
                <span class="indicador" data-pagina="4"></span>
            </div>
            <button class="modal-fechar" id="intro-modal-fechar">&times;</button>
            </div>
            
            <!-- Container das páginas -->
            <div class="modal-paginas-container">
            <!-- Página 1 -->
            <div class="modal-pagina ativo" data-pagina="1">
                <div class="pagina-conteudo">
                <h3>Aprenda Lógica de Programação</h3>
                <p class="pagina-texto">
                    Vamos aprender juntos de forma prática e divertida!
                </p>
                <p class="pagina-destaque">
                    Resolva desafios, escreva código e veja os resultados instantaneamente.
                </p>
                </div>
            </div>
            
            <!-- Página 2 -->
            <div class="modal-pagina" data-pagina="2">
                <div class="pagina-conteudo">
                <h3>Como Funciona</h3>
                
                <div class="funcionalidade">
                    <div class="func-icon">
                        <img src="assets/img/progression-icon.svg" alt="">
                    </div>
                    <div class="func-texto">
                    <strong>Desafios Progressivos</strong>
                    <p>Comece do básico e avance em dificuldade</p>
                    </div>
                </div>
                
                <div class="funcionalidade">
                    <div class="func-icon">
                        <img src="assets/img/save-icon.svg" alt="">
                    </div>
                    <div class="func-texto">
                    <strong>Progresso Salvo</strong>
                    <p>Continue de onde parou a qualquer momento</p>
                    </div>
                </div>
                
                <div class="funcionalidade">
                    <div class="func-icon">
                        <img src="assets/img/code-icon.svg" alt="">
                    </div>
                    <div class="func-texto">
                    <strong>Autocomplete Progressivo</strong>
                    <p>Desbloqueie palavras ao completar desafios</p>
                    </div>
                </div>
                </div>
            </div>
            
            <!-- Página 3 -->
            <div class="modal-pagina" data-pagina="3">
                <div class="pagina-conteudo">
                <h3>Atalhos e Dicas</h3>
                
                <div class="dica-item">
                    <div class="dica-atalho">
                    <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
                    </div>
                    <div class="dica-texto">
                    Executa seu código rapidamente
                    </div>
                </div>
                
                <div class="dica-item">
                    <div class="dica-atalho">
                    <kbd>Ctrl</kbd> + <kbd>Seta Direita</kbd>
                    </div>
                    <div class="dica-texto">
                    Ir para o próximo desafio
                    </div>
                </div>
                
                <div class="dica-item">
                    <div class="dica-atalho">
                    <kbd>Ctrl</kbd> + <kbd>Seta Esquerda</kbd>
                    </div>
                    <div class="dica-texto">
                    Ir para o desafio anterior
                    </div>
                </div>
                
                <p class="pagina-nota">
                    Ou use os botões de navegação para ir para o próximo ou voltar para o desafio anterior.
                </p>
                </div>
            </div>
            
            <!-- Página 4 -->
            <div class="modal-pagina" data-pagina="4">
                <div class="pagina-conteudo">
                <h3>Pronto para Começar?</h3>
                
                <div class="checklist">
                    <div class="check-item">
                    <span class="check-icon">✓</span>
                    <span>Editor de código configurado</span>
                    </div>
                    <div class="check-item">
                    <span class="check-icon">✓</span>
                    <span>Desafios disponíveis</span>
                    </div>
                    <div class="check-item">
                    <span class="check-icon">✓</span>
                    <span>Console de saída pronto</span>
                    </div>
                </div>
                
                <div class="comecar-acoes">
                    <label class="checkbox-container">
                    <input type="checkbox" id="nao-mostrar-novamente">
                    <span class="checkmark"></span>
                    <span class="checkbox-text">Não mostrar novamente</span>
                    </label>
                </div>
                </div>
            </div>
            </div>
            
            <!-- Rodapé com navegação -->
            <div class="modal-rodape">
            <div class="pagina-info">
                <span id="pagina-atual">1</span> de <span id="total-paginas">4</span>
            </div>
            
            <div class="modal-navegacao">
                <button class="btn btn-secundario" id="intro-modal-anterior">
                <span class="seta">←</span> Anterior
                </button>
                <button class="btn btn-primario" id="intro-modal-proximo">
                Próximo <span class="seta">→</span>
                </button>
                <button class="btn btn-sucesso" id="intro-modal-comecar" style="display: none;">
                Começar a Programar!
                </button>
            </div>
            </div>
        </div>
        </div>
    `;

        document.body.appendChild(modalElement);

        initModalNavigation();

    }

    function showModal() {
        criarModal();
        modalElement.style.display = "flex";
    }

    function closeModal(showAgain = false) {
        modalElement.style.display = "none";
        if (showAgain){
            localStorage.setItem(INTRO_KEY, "true");
        }
    }

    function jaViuIntroducao() {
        return localStorage.getItem(INTRO_KEY) === "true";
    }

    function nextPage(){

        if (modalElement.style.display === "none") return;

        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            atualizarPagina();
        }

    }

    function previousPage(){

        if (modalElement.style.display === "none") return;

        if (paginaAtual > 1) {
            paginaAtual--;
            atualizarPagina();
        }
    }

    function initModalNavigation() {

        document.getElementById('intro-modal-proximo').addEventListener('click', nextPage);

        document.getElementById('intro-modal-anterior').addEventListener('click', previousPage);

        document.getElementById('intro-modal-comecar').addEventListener('click', () => {
            closeModal(document.getElementById('nao-mostrar-novamente').checked);
        });

        // Navegação pelos indicadores
        document.querySelectorAll('.indicador').forEach(ind => {
            ind.addEventListener('click', () => {
                paginaAtual = parseInt(ind.dataset.pagina);
                atualizarPagina();
            });
        });

        document.getElementById('intro-modal-fechar').addEventListener('click', () => {
            closeModal();
        });

        // Fechar ao clicar fora
        document.getElementById('modal-bemvindo').addEventListener('click', (e) => {
            if (e.target.id === 'modal-bemvindo') {
                closeModal();
            }
        });

        // Navegação com setas
        document.addEventListener('keydown', (e) => {

            if (!(e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') nextPage();

            if (!(e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') previousPage();
        });

        // Inicializar
        atualizarPagina();
    }

    function atualizarPagina() {

        document.querySelectorAll('.indicador').forEach(ind => {
            ind.classList.remove('ativo');
            if (parseInt(ind.dataset.pagina) === paginaAtual) {
                ind.classList.add('ativo');
            }
        });

        // Atualizar páginas
        document.querySelectorAll('.modal-pagina').forEach(pag => {
            pag.classList.remove('ativo');
            if (parseInt(pag.dataset.pagina) === paginaAtual) {
                pag.classList.add('ativo');
            }
        });

        // Atualizar contador
        document.getElementById('pagina-atual').textContent = paginaAtual;
        document.getElementById('total-paginas').textContent = totalPaginas;

        // Atualizar título
        const titulos = [
            "Bem-vindo ao CheetahJS!",
            "Como Funciona",
            "Atalhos e Dicas",
            "Pronto para Começar?"
        ];
        document.getElementById('intro-modal-titulo').textContent = titulos[paginaAtual - 1];

        // Atualizar botões
        const btnAnterior = document.getElementById('intro-modal-anterior');
        const btnProximo = document.getElementById('intro-modal-proximo');
        const btnComecar = document.getElementById('intro-modal-comecar');

        btnAnterior.style.display = paginaAtual === 1 ? 'none' : 'flex';
        btnProximo.style.display = paginaAtual === totalPaginas ? 'none' : 'flex';
        btnComecar.style.display = paginaAtual === totalPaginas ? 'block' : 'none';
    };

    if (!jaViuIntroducao()) {
        showModal();
    }

    return {
        show: showModal,
        close: closeModal
    };
}
