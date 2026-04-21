export function PagesControl() {

    function navigateTo(ev) {
        ev.preventDefault();
        const pagina = ev.currentTarget.dataset.page;
        location.hash = pagina;
    }

    function loadPage() {
        const pagina = location.hash.replace("#", "") || "home";
        
        document.querySelectorAll(".page").forEach(p => {
            p.classList.remove("active");
        });

        const destino = document.getElementById(`pg-${pagina}`);

        if (destino) {
            destino.classList.add("active");
        }
    }

    return {
        navigateTo,
        loadPage,
    }
} 