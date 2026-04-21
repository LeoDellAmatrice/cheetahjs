import { EditorFactory } from "./core/EditorFactory.js";
import { StorageFactory } from "./core/StorageFactory.js";
import { DesafioFactory } from "./core/DesafioFactory.js";
import { Feedback } from "./ui/FeedbackToast.js";
import { Output } from "./ui/Output.js";
import { IntroModalFactory } from "./ui/IntroModal.js";
import { SettingsModalFactory } from "./ui/SettingsModal.js"
import { SettingsFactory } from "./core/SettingsFactory.js";
import { AppController } from "./controllers/AppController.js";
import { FeedbackService } from "./ui/FeedbackService.js"
import { HeaderUI } from "./ui/Header.js"
import { PagesControl } from "./ui/PagesControl.js";

window.onload = () => {

  // Inicialização do editor
  const editor = EditorFactory();
  editor.create("editor", {
    value: "// Bem-vindo!\n"
  });

  // Atualiza o editor ao navegar para a página do editor
  window.addEventListener("pageChanged", (ev) => {
    const page = ev.detail;
    if (page !== "editor") return;

    editor.refresh();
    setTimeout(() => {editor.refresh()}, 500);
  });
  
  // Sistema de navegação interna
  const pagesControl = PagesControl();
  window.addEventListener("hashchange", pagesControl.loadPage);
  document.querySelectorAll(".header-nav a").forEach(a => {
    a.addEventListener("click", pagesControl.navigateTo);
  });
  pagesControl.loadPage();
  pagesControl.setPageTheme();
  


  const storage = StorageFactory();
  const desafios = DesafioFactory(storage);

  const feedbackToast = Feedback();
  const feedbackHeader = HeaderUI();

  const feedback = FeedbackService(feedbackToast, feedbackHeader);
  
  const Settings = SettingsFactory(editor, desafios, feedback, pagesControl);
  const SettingsModal = SettingsModalFactory(Settings);

  Settings.applyAll()

  const output = Output(editor, feedback);
  const IntroModal = IntroModalFactory();

  IntroModal.needOpen();

  editor.addToAutoComplete(desafios.getAllUnlock())

  const app = AppController(editor, desafios, feedback, output);

  app.carregarDesafio();

  document.getElementById("icon-setting").onclick = SettingsModal.show;

  document.getElementById("btn-executar").onclick = app.executar;
  document.getElementById("btn-proximo").onclick = app.proximoDesafio;
  document.getElementById("btn-anterior").onclick = app.desafioAnterior;


  
  document.addEventListener("keydown",  function(e) {

    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") app.executar();

    if ((e.ctrlKey || e.metaKey) && e.key === "ArrowRight") app.proximoDesafio();

    if ((e.ctrlKey || e.metaKey) && e.key === "ArrowLeft") app.desafioAnterior();

  });

  document.getElementById("btn-limpar-console").onclick = output.clear;
};

const modules = document.querySelectorAll(".module-item")
const contents = document.querySelectorAll(".module-content")

modules.forEach(module => {
    module.addEventListener("click", () => {

        // remove active de todos
        modules.forEach(m => m.classList.remove("active"))
        contents.forEach(c => c.classList.remove("active"))

        // ativa o clicado
        module.classList.add("active")

        const id = module.dataset.module
        document.querySelector(`.module-content[data-module="${id}"]`)
            .classList.add("active")
    })
})