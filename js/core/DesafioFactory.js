import { Desafios } from "../desafios.js";

export function DesafioFactory(storage) {
  let atual = storage.get();

  function getAtual() {
    return atual;
  }

  function isTypeError(){
    
    if (Desafios[atual].tipo === "erro-didatico"){
      return true
    }

    return false 
  }

  function getDados() {
    return Desafios[atual];
  }

  function getDadosUnlock(){
    return Desafios[atual].unlockComplete || []
  }

  function getAllUnlock(){

    let listAllUnlock = []

    for (let i = 0; i<=Number(atual)-1;i++){
      Desafios[i].unlockComplete?.forEach(word => {
        listAllUnlock.push(word)
      });
    }

    return listAllUnlock
  }

  function podeAvancar() {
    return atual < storage.get();
  }

  function avancar() {
    if (atual < Desafios.length - 1) {
      storage.set(atual+1);
    }
  }

  function proximo() {
    if (atual < Desafios.length - 1) {
      atual++;
    }
  }

  function anterior() {
    if (atual > 0) atual--;
  }

  function validar(codigo) {
    return Desafios[atual].validar(codigo);
  }

  function isUltimo() {
    return atual >= Desafios.length - 1;
  }

  function resetAll(){
    storage.set(0);
    atual = 0;
    window.location.reload()
  }

  return {
    getAtual,
    getDados,
    getAllUnlock,
    getDadosUnlock,
    podeAvancar,
    avancar,
    proximo,
    anterior,
    isTypeError,
    validar,
    isUltimo,
    resetAll
  };
}
