import { Desafios } from "../desafios.js";
import { Modulos, validator_base } from "../desafios.js";

export function DesafioFactory(storage) {
  let moduloAtual = 0 //storage.getModuloAtual();
  let desafioAtual = storage.get();


  function getDesafioAtual() {
    return desafioAtual;
  }

  function getModuloAtual() {
    return moduloAtual;
  }

  function getAllModulos() {
    return Modulos;
  }

  function isTypeError(){
    
    if (Modulos[moduloAtual].Desafios[desafioAtual].tipo === "erro-didatico"){
      return true
    }

    return false 
  }

  function getDados() {
    return Modulos[moduloAtual].Desafios[desafioAtual];
  }

  function getDadosUnlock(){
    return Modulos[moduloAtual].Desafios[desafioAtual].unlockComplete || []
  }

  function getAllUnlock(){

    let listAllUnlock = []

    for (let i = 0; i<=Number(desafioAtual)-1;i++){
      Desafios[i].unlockComplete?.forEach(word => {
        listAllUnlock.push(word)
      });
    }

    return listAllUnlock
  }

  function podeAvancar() {
    return desafioAtual < storage.get();
  }

  function avancar() {
    if (desafioAtual < Modulos[moduloAtual].Desafios.length - 1) {
      storage.set(desafioAtual+1);
    }
  }

  function proximoDesafio() {
    if (desafioAtual < Modulos[moduloAtual].Desafios.length - 1) {
      desafioAtual++;
    }
  }

  function anteriorDesafio() {
    if (desafioAtual > 0) desafioAtual--;
  }

  function validar(codigo) {
    return validator_base(codigo, Modulos[moduloAtual].Desafios[desafioAtual].validar);
  }

  function isUltimo() {
    return desafioAtual >= Modulos[moduloAtual].Desafios.length - 1;
  }

  function resetAll(){
    storage.set(0);
    desafioAtual = 0;
    window.location.reload()
  }

  return {
    getDesafioAtual,
    getModuloAtual,
    getAllModulos,
    getDados,
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
