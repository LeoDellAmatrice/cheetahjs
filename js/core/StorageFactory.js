const DefaultSave = {
  version: "1.0",
  Modulos: {
    intro: {
      desafios: 0,
      completo: false
    }
  }
};

const KEY = "ProgressSave";

export function StorageFactory() {

  function get(idModulo = null) {
    const data = JSON.parse(localStorage.getItem(KEY)) || DefaultSave;
    if (idModulo === null) { return data; }
    return data.Modulos[idModulo];
  }

  function set(idModulo, desafio, completo = false) {
    const data = JSON.parse(localStorage.getItem(KEY)) || DefaultSave;

    data.Modulos[idModulo] = { desafios: desafio, completo };

    localStorage.setItem(KEY, JSON.stringify(data));
  }

  return {
    get,
    set
  };
}