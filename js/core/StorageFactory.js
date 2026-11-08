import { Modulos } from "../desafios.js";

const KEY = "ProgressSave";
const VERSION = "1.0";

// O save padrão é gerado a partir dos módulos de desafios.js.
// Assim, criar um módulo novo não exige mexer aqui.
function criarSaveVazio() {
  const save = { version: VERSION, Modulos: {} };

  for (const modulo of Modulos) {
    save.Modulos[modulo.id] = { desafios: 0, completo: false };
  }

  return save;
}

// Junta o save antigo com o padrão atual:
// - módulos novos entram zerados
// - progresso dos módulos existentes é mantido
function migrarSave(salvo) {
  const save = criarSaveVazio();

  for (const id of Object.keys(save.Modulos)) {
    const progresso = salvo?.Modulos?.[id];
    if (progresso && Number.isInteger(progresso.desafios)) {
      save.Modulos[id] = { desafios: progresso.desafios, completo: Boolean(progresso.completo) };
    }
  }

  return save;
}

function lerSave() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null; // save corrompido: começa do zero em vez de quebrar o site
  }
}

export function StorageFactory() {

  let SaveStorage = migrarSave(lerSave());
  salvar();

  function salvar() {
    localStorage.setItem(KEY, JSON.stringify(SaveStorage));
  }

  function get(idModulo = null) {
    if (idModulo === null) { return SaveStorage; }
    return SaveStorage.Modulos[idModulo];
  }

  function set(idModulo, desafio, completo = false) {
    SaveStorage.Modulos[idModulo] = { desafios: desafio, completo };
    salvar();
  }

  function reset() {
    SaveStorage = criarSaveVazio();
    salvar();
  }

  return {
    get,
    set,
    reset
  };
}
