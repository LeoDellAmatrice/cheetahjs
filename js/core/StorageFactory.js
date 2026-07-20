const DefaultSave = {
  version: "1.0",
  Modulos: {
    intro: {
      desafios: 0,
      completo: false
    },
    condicionais: {
      desafios: 0,
      completo: false
    },
    loops: {
      desafios: 0,
      completo: false 
    },
    arrays: {
      desafios: 0,
      completo: false
    },
    funcoes: {
      desafios: 0,
      completo: false
    },
    erros: {
      desafios: 0,
      completo: false
    }
  }
}

const KEY = "ProgressSave";

export function StorageFactory() {

  let SaveStorage = startStorage();

  function startStorage() {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (!data) {
      localStorage.setItem(KEY, JSON.stringify(DefaultSave));
      return DefaultSave;
    }
    return data;
  }

  function get(idModulo = null) {
    if (idModulo === null) { return SaveStorage; }
    return SaveStorage.Modulos[idModulo];
  }

  function set(idModulo, desafio, completo = false) {
    SaveStorage.Modulos[idModulo] = { desafios: desafio, completo };

    localStorage.setItem(KEY, JSON.stringify(SaveStorage));
  }

  return {
    get,
    set
  };
}