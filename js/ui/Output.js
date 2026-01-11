export function Output(editor, feedback) {
  const el = document.getElementById("output");

  function set(text) {
    el.textContent = text;
  }

  function append(text) {
    el.textContent += "\n" + text;
  }

  function clear() {
    el.textContent = "";
    editor.limparDestaques();
  }

  return { set, append, clear };
}
