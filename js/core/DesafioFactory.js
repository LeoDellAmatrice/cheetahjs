import { Modulos, validator_base } from "../desafios.js";

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

  function setDesafioAtual(indexModulo, indexDesafio) {
    moduloAtual = indexModulo;
    desafioAtual = indexDesafio;
  }

  function isTypeError(){
    return getDesafio().tipo === "erro-didatico"
  }

  function getDadosUnlock(){
    return getDesafio().unlockComplete || []
  }

  function getAllUnlock(){

    let listAllUnlock = []

    for (let i = 0; i<=Number(desafioAtual)-1;i++){
      getDesafios().unlockComplete?.forEach(word => {
        listAllUnlock.push(word)
      });
    }

    return listAllUnlock
  }

  function podeAvancar() {
    console.log("desafioAtual", getModulo().id, storage.get(getModulo().id))
    return desafioAtual < storage.get(getModulo().id).desafios;
  }

  function avancar() {
    if (desafioAtual < getDesafios().length) {
      storage.set(getModulo().id, desafioAtual + 1, desafioAtual + 1 >= getDesafios().length);
    }
  }

  function proximoDesafio() {
    if (desafioAtual < getDesafios().length - 1) {
      desafioAtual++;
    }
  }

  function anteriorDesafio() {
    if (desafioAtual > 0) desafioAtual--;
  }

  function validar(codigo) {
    return validator_base(codigo, getDesafio().validar);
  }

  function isUltimo() {
    return desafioAtual >= getDesafios().length - 1;
  }

  function resetAll(){
    storage.set(0);
    desafioAtual = 0;
    window.location.reload()
  }

  return {
    getDesafio,
    getDesafios,
    getModulo,
    getModulos,
    getIndexDesafio,
    setDesafioAtual,
    getAllUnlock,
    getDadosUnlock,
    podeAvancar,
    avancar,
    proximoDesafio,
    anteriorDesafio,
    isTypeError,
    validar,
    isUltimo,
    resetAll
  };
}
