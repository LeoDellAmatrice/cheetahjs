export function PagesControl() {

    window.addEventListener("hashchange", loadPage);
    document.querySelectorAll(".header-nav a").forEach(a => {
        a.addEventListener("click", BTNnavigateTo);
    });

    function BTNnavigateTo(ev) {
        ev.preventDefault();
        const pagina = ev.currentTarget.dataset.page;
        location.hash = pagina;
    }

    function navigateTo(pagina) {
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

        window.dispatchEvent(new CustomEvent("pageChanged", { detail: pagina }));
    }

    function setPageTheme(theme = 'dark-mode') {
        document.querySelector("html").classList.remove('light-mode', 'dark-mode');
        document.querySelector("html").classList.add(theme);
    }

    loadPage();
    setPageTheme();

    return {
        navigateTo,
        loadPage,
        setPageTheme,
    }
} 