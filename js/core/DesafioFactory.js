import { Modulos } from "../desafios.js";

export function DesafioFactory(storage) {
  let moduloAtual = 0;
  let desafioAtual = 0;

  function getDesafio(indexModulo = moduloAtual, indexDesafio = desafioAtual) {
    return Modulos[indexModulo].Desafios[indexDesafio];
  }

  function getDesafios(indexModulo = moduloAtual) {
    return Modulos[indexModulo].Desafios;
  }

  function getModulo(indexModulo = moduloAtual) {
    return Modulos[indexModulo];
  }

  function getModulos() {
    return Modulos;
  }

  function getIndexDesafio() {
    return desafioAtual;
  }

  function getIndexModulo() {
    return moduloAtual;
  }

  function getDesafioStatus(indexModulo = moduloAtual, indexDesafio = desafioAtual) {
    const progresso = storage.get(getModulo(indexModulo).id);

    if (indexDesafio < progresso.desafios) {
      return { style: "done", text: "Concluído" };
    } else if (indexDesafio === progresso.desafios) {
      return { style: "current", text: "Disponível" };
    } else {
      return { style: "locked", text: "Bloqueado" };
    }
  }

  // Quantos desafios do módulo já foram concluídos
  function getConcluidos(indexModulo = moduloAtual) {
    const total = getDesafios(indexModulo).length;
    return Math.min(storage.get(getModulo(indexModulo).id).desafios, total);
  }

  // Primeiro desafio ainda não concluído da trilha (botão "Continuar")
  function getPontoDeContinuacao() {
    for (let i = 0; i < Modulos.length; i++) {
      const concluidos = getConcluidos(i);
      if (concluidos < getDesafios(i).length) {
        return { modulo: i, desafio: concluidos, tudoConcluido: false };
      }
    }
    return { modulo: 0, desafio: 0, tudoConcluido: true };
  }

  function setDesafioAtual(indexModulo, indexDesafio) {
    moduloAtual = Number(indexModulo);
    desafioAtual = Number(indexDesafio);
  }

  function isTypeError() {
    return getDesafio().tipo === "erro-didatico"
  }

  function getDadosUnlock() {
    return getDesafio().unlockComplete || []
  }

  // Palavras do autocomplete de TODOS os desafios já concluídos,
  // em todos os módulos (usado ao abrir o site)
  function getAllUnlock() {
    const listAllUnlock = [];

    Modulos.forEach((modulo) => {
      const concluidos = storage.get(modulo.id).desafios;

      modulo.Desafios.slice(0, concluidos).forEach((desafio) => {
        listAllUnlock.push(...(desafio.unlockComplete || []));
      });
    });

    return listAllUnlock;
  }

  function proximoDesafioLivre() {
    return desafioAtual < storage.get(getModulo().id).desafios;
  }

  function DesbloquearProximo() {
    const progresso = storage.get(getModulo().id);
    const novoProgresso = desafioAtual + 1;

    // Refazer um desafio antigo não pode diminuir o progresso
    if (novoProgresso <= progresso.desafios) return;

    storage.set(getModulo().id, novoProgresso, novoProgresso >= getDesafios().length);
  }

  function proximoDesafio() {
    if (desafioAtual < getDesafios().length - 1) {
      desafioAtual++;
    }
  }

  function anteriorDesafio() {
    if (desafioAtual > 0) desafioAtual--;
  }

  function isUltimo() {
    return desafioAtual >= getDesafios().length - 1;
  }

  function resetAll() {
    storage.reset();
    moduloAtual = 0;
    desafioAtual = 0;
    window.location.reload();
  }

  return {
    getDesafio,
    getDesafios,
    getModulo,
    getModulos,
    getIndexDesafio,
    getIndexModulo,
    getDesafioStatus,
    getConcluidos,
    getPontoDeContinuacao,
    setDesafioAtual,
    getAllUnlock,
    getDadosUnlock,
    proximoDesafioLivre,
    DesbloquearProximo,
    proximoDesafio,
    anteriorDesafio,
    isTypeError,
    isUltimo,
    resetAll
  };
}
