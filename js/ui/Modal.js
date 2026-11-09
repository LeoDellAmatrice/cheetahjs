// =====================================================================
// Modal
// ---------------------------------------------------------------------
// Base compartilhada pelos modais (introdução e configurações):
// - abre/fecha com animação
// - fecha com Esc ou clicando fora
// - mantém o foco do teclado dentro do modal (Tab não "foge" para a página)
// - devolve o foco para onde estava ao fechar
// - impede os atalhos do site (Ctrl+Enter etc.) enquanto está aberto
// =====================================================================

const FOCAVEIS = [
    "button:not([disabled]):not([hidden])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
].join(",");

const DURACAO_MS = 200;

export function criarModal({ html, tituloId, classe = "", aoFechar, aoTeclar }) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
        <div class="modal-dialog ${classe}" role="dialog" aria-modal="true" aria-labelledby="${tituloId}" tabindex="-1">
            ${html}
        </div>`;
    document.body.append(overlay);

    const dialog = overlay.firstElementChild;
    let aberto = false;
    let focoAnterior = null;
    let timerFechar = null;

    function elementosFocaveis() {
        return [...dialog.querySelectorAll(FOCAVEIS)].filter((el) => el.offsetParent !== null);
    }

    function abrir() {
        if (aberto) return;
        aberto = true;
        clearTimeout(timerFechar);

        focoAnterior = document.activeElement;
        overlay.hidden = false;
        void overlay.offsetWidth; // força o navegador a aplicar o estado inicial antes da animação
        overlay.classList.add("aberto");

        (dialog.querySelector("[data-foco-inicial]") ?? dialog).focus();
    }

    function fechar() {
        if (!aberto) return;
        aberto = false;

        overlay.classList.remove("aberto");
        timerFechar = setTimeout(() => { overlay.hidden = true; }, DURACAO_MS);

        focoAnterior?.focus?.();
        aoFechar?.();
    }

    // Clique no fundo escuro (fora da caixa) fecha
    overlay.addEventListener("mousedown", (e) => {
        if (e.target === overlay) fechar();
    });

    overlay.addEventListener("keydown", (e) => {
        e.stopPropagation(); // atalhos da página não disparam com o modal aberto

        if (e.key === "Escape") {
            e.preventDefault();
            fechar();
            return;
        }

        if (e.key === "Tab") {
            const focaveis = elementosFocaveis();
            if (!focaveis.length) return;
            const primeiro = focaveis[0];
            const ultimo = focaveis[focaveis.length - 1];

            if (e.shiftKey && document.activeElement === primeiro) {
                e.preventDefault();
                ultimo.focus();
            } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault();
                primeiro.focus();
            }
            return;
        }

        aoTeclar?.(e);
    });

    return {
        dialog,
        abrir,
        fechar,
        get aberto() { return aberto; }
    };
}

// Ícone "×" usado no botão de fechar dos modais
export const ICONE_FECHAR = `
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/>
    </svg>`;
