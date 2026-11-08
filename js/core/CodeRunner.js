// =====================================================================
// CodeRunner
// ---------------------------------------------------------------------
// Lado da PÁGINA. Cria um Web Worker novo a cada execução, envia o código
// e espera a resposta. Se o código passar do tempo limite (loop infinito),
// o worker é encerrado com worker.terminate() e a página continua viva.
//
// Um worker novo por execução também garante que variáveis de uma
// execução não "vazem" para a próxima.
// =====================================================================

const TEMPO_LIMITE_MS = 2000;      // tempo máximo para o código do aluno
const TEMPO_CARREGAMENTO_MS = 10000; // tempo máximo para o worker carregar

export function CodeRunner({ tempoLimite = TEMPO_LIMITE_MS } = {}) {

  /**
   * Executa e valida o código.
   * Resolve com um destes formatos:
   *   { consoleOutput, erro, validacao }   -> executou
   *   { timeout: true }                    -> demorou demais
   *   { falhaInterna: "mensagem" }         -> o worker não conseguiu rodar
   */
  function executar(code, moduloIndex, desafioIndex) {
    return new Promise((resolve) => {
      const worker = new Worker(
        new URL("./ExecutorWorker.js", import.meta.url),
        { type: "module" }
      );

      let timer = setTimeout(
        () => finalizar({ falhaInterna: "O executor demorou para carregar." }),
        TEMPO_CARREGAMENTO_MS
      );

      function finalizar(resultado) {
        clearTimeout(timer);
        worker.terminate();
        resolve(resultado);
      }

      worker.onmessage = ({ data }) => {
        if (data.tipo === "iniciado") {
          // Agora sim começa a contar o tempo do código do aluno
          clearTimeout(timer);
          timer = setTimeout(() => finalizar({ timeout: true }), tempoLimite);
          return;
        }
        finalizar(data);
      };

      worker.onerror = (ev) => {
        ev.preventDefault();
        finalizar({ falhaInterna: ev.message || "Falha ao carregar o executor." });
      };

      worker.postMessage({ code, moduloIndex, desafioIndex });
    });
  }

  return { executar, tempoLimite };
}
