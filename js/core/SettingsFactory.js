import { settingsStore } from '../core/SettingsStore.js';

export function SettingsFactory(editor, desafios, feedback, pagesControl) {
  
  function applyAll() {
    const settings = settingsStore.getAll();

    // Saves antigos guardavam "Default" (maiúsculo), que o CodeMirror não reconhece
    editor.setTheme(settings.theme === "Default" ? "default" : settings.theme);
    editor.setFontSize(settings.fontSize);
    editor.setAutocomplete(settings.autocomplete);
    editor.setHighlightLine(settings.highlightLine);
    editor.setClearEditor(settings.clearEditor);

    pagesControl.setPageTheme(settings.themeSite);

    feedback.setHide(settings.hidePopUp);
  }

  function resetDesafio(){
    desafios.resetAll();
  }

  function update(key, value) {
    settingsStore.set(key, value);
    this.applyAll();
  }

  applyAll();

  return {
    applyAll,
    update,
    resetDesafio
  }
};
