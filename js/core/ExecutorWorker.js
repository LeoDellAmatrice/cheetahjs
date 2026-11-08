// =====================================================================
// ExecutorWorker
// ---------------------------------------------------------------------
// Este arquivo roda dentro de um Web Worker: uma "thread" separada da
// página. Se o código do aluno travar (ex.: while (true) {}), só o worker
// trava, e o CodeRunner (na página) o encerra depois do tempo limite.
//
// Fluxo:
//   1. Recebe { code, moduloIndex, desafioIndex } da página
//   2. Executa o código UMA vez e captura as variáveis criadas
//   3. Valida com as regras do desafio
//   4. Devolve só dados simples (texto, números) para a página
// =====================================================================

import { Modulos, validator_base, validator_erro_esperado } from "../desafios.js";

// Nome do objeto onde guardamos as variáveis do aluno ao final da execução.
// É um nome improvável para não colidir com variáveis do aluno.
const CAPTURA = "__cheetahCaptura__";

// Palavras que não podem ser lidas como variável (geraria erro de sintaxe)
// ou que não fazem sentido capturar.
const IGNORAR = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger", "default",
  "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for",
  "function", "if", "import", "in", "instanceof", "new", "null", "return", "super",
  "switch", "this", "throw", "true", "try", "typeof", "var", "void", "while", "with",
  "yield", "let", "static", "await", "async", "of", "implements", "package",
  "protected", "interface", "private", "public", "arguments", "eval",
  "undefined", "NaN", "Infinity", "console", CAPTURA
]);

// ---------------------------------------------------------------------
// Console falso: guarda tudo que o aluno imprimir
// ---------------------------------------------------------------------
function criarConsole() {
  const fakeConsole = {
    output: "",
    log(...args) {
      fakeConsole.output += args.join(" ") + "\n";
    }
  };
  // Evita o TypeError confuso "console.error is not a function"
  fakeConsole.error = fakeConsole.log;
  fakeConsole.warn = fakeConsole.log;
  fakeConsole.info = fakeConsole.log;
  return fakeConsole;
}

// ---------------------------------------------------------------------
// Captura de variáveis SEM reescrever o código do aluno
// ---------------------------------------------------------------------
// Em vez de trocar "let x =" por outra coisa (regex), deixamos o código
// intacto e ACRESCENTAMOS no final algo como:
//
//   try { __cheetahCaptura__["nome"] = nome; } catch (_) {}
//
// para cada palavra que aparece no código. Se "nome" foi declarada no
// nível principal, o valor é capturado. Se não existe, o ReferenceError
// é ignorado. Variáveis criadas dentro de blocos (if, for...) não são
// visíveis ali, igual ao JavaScript de verdade.
function nomesCandidatos(code) {
  // \p{ID_Start} aceita acentos: "let ação = 1" também funciona
  const palavras = code.match(/[\p{ID_Start}_$][\p{ID_Continue}$‌‍]*/gu) ?? [];
  return [...new Set(palavras)].filter((p) => !IGNORAR.has(p));
}

function montarCodigo(code, nomes) {
  const capturas = nomes
    .map((n) => `try { ${CAPTURA}[${JSON.stringify(n)}] = ${n}; } catch (_) {}`)
    .join("\n");

  // "\n;" protege contra código terminando em comentário "//" ou sem ";"
  return `${code}\n;\n${capturas}`;
}

// ---------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------
function executar(code) {
  const fakeConsole = criarConsole();
  const capturado = {};
  const nomes = nomesCandidatos(code);

  // Nomes que já existem no worker (Math, self, name, fetch...).
  // Só contam como "do aluno" se ele criou uma variável com esse nome.
  const globaisDoWorker = nomes.filter((n) => n in self);

  try {
    // A 1ª linha do código do aluno fica na linha 3 da função gerada
    // (o navegador adiciona 2 linhas de cabeçalho). Por isso o "- 2" em extrairLinha.
    const fn = new Function("console", CAPTURA, montarCodigo(code, nomes));
    fn(fakeConsole, capturado);
  } catch (error) {
    return {
      ok: false,
      error,
      context: { console: fakeConsole },
      consoleOutput: fakeConsole.output.trim()
    };
  }

  for (const n of globaisDoWorker) {
    if (capturado[n] === self[n]) delete capturado[n];
  }

  return {
    ok: true,
    context: { ...capturado, console: fakeConsole },
    consoleOutput: fakeConsole.output.trim()
  };
}

// ---------------------------------------------------------------------
// Validação
// ---------------------------------------------------------------------
function validar(exec, desafio) {
  try {
    const resultado = desafio.tipo === "erro-didatico"
      ? validator_erro_esperado(exec, desafio.validar)
      : validator_base(exec, desafio.validar);

    return { ok: Boolean(resultado.ok), message: resultado.message ?? null };
  } catch (e) {
    // Ex.: a regra chama saudacao("Joao") e a função do aluno dá erro
    return { ok: false, message: `Erro ao testar seu código: ${e?.name}: ${e?.message}` };
  }
}

// ---------------------------------------------------------------------
// Erros precisam virar objeto simples para atravessar o postMessage
// ---------------------------------------------------------------------
function extrairLinha(erro) {
  const stack = erro?.stack ?? "";
  const padroes = [
    /<anonymous>:(\d+):(\d+)/, // Chrome / Edge
    /Function:(\d+):(\d+)/     // Firefox
  ];

  for (const padrao of padroes) {
    const match = stack.match(padrao);
    if (match) return Number(match[1]) - 2;
  }
  return null;
}

function serializarErro(erro) {
  // O aluno pode fazer throw "texto" (sem ser um Error)
  if (!(erro instanceof Error)) {
    return { name: "Error", message: String(erro), linha: null };
  }
  return { name: erro.name, message: erro.message, linha: extrairLinha(erro) };
}

// ---------------------------------------------------------------------
// Comunicação com a página
// ---------------------------------------------------------------------
self.onmessage = ({ data }) => {
  const { code, moduloIndex, desafioIndex } = data;

  // Avisa a página que a execução começou (o cronômetro começa aqui,
  // assim o tempo de carregar o worker não conta como "código lento").
  self.postMessage({ tipo: "iniciado" });

  const desafio = Modulos[moduloIndex]?.Desafios[desafioIndex];
  const exec = executar(code);
  const validacao = desafio
    ? validar(exec, desafio)
    : { ok: false, message: "Desafio não encontrado." };

  self.postMessage({
    tipo: "resultado",
    consoleOutput: exec.consoleOutput,
    erro: exec.ok ? null : serializarErro(exec.error),
    validacao
  });
};
