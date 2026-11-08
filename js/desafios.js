// A execução do código do aluno acontece em js/core/ExecutorWorker.js.
// Aqui ficam só as regras de validação e os desafios.
// Os validadores recebem o resultado da execução ("exec"), que tem o formato:
//   { ok, error, code, context: { ...variaveisDoAluno, console }, consoleOutput }
//
// ---------------------------------------------------------------------
// FORMATO DE UM DESAFIO
// ---------------------------------------------------------------------
// {
//   titulo:        "Nome curto",
//   conceito: {    // explicação mostrada ANTES das instruções (opcional)
//     texto:   "Parágrafos separados por \n\n. Use `crases` para código.",
//     exemplo: "código de exemplo"   // mostra o conceito em OUTRO contexto: não pode
//                                    // virar a resposta trocando só um nome ou número
//   },
//   instrucoes:    "O que o aluno deve fazer",
//   codigoInicial: "código que já aparece no editor (opcional)",
//   tip:           "💡 Dica: ...",   // orienta o raciocínio, sem entregar o código
//   tipo:          "erro-didatico"  // só para desafios em que o objetivo é gerar um erro
//   unlockComplete: ["palavras", "liberadas", "no autocomplete"],
//   validar:       [ regras... ]
// }

function validarErroEsperado(exec, erroEsperado, message) {

  if (exec.ok) {
    return false;
  }

  if (exec.error.name === erroEsperado) {
    return true;
  }

  return false;
}

function runRules(exec, rules) {
  if (!exec.ok) {
    return {
      ok: false,
      message: null
    };
  }

  for (const rule of rules) {
    const result = rule(exec);
    if (!result.ok) return result;
  }

  return { ok: true };
}

function runRulesErroEsperado(exec, rules) {
  for (const rule of rules) {
    const result = rule(exec);
    if (!result.ok) return result;
  }

  return { ok: true };
}

// Remove comentários para que "// for" não conte como usar um for
function codigoSemComentarios(code = "") {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

// Linhas impressas no console (sem linhas vazias no fim)
function linhasConsole(exec) {
  return exec.consoleOutput ? exec.consoleOutput.split("\n") : [];
}

const ok = { ok: true };
const falha = (message) => ({ ok: false, message });

const rules = {
  exists(name, message) {
    return (exec) =>
      name in exec.context
        ? ok
        : falha(message);
  },

  equals(name, value, message) {
    return (exec) =>
      exec.context[name] === value
        ? ok
        : falha(message);
  },

  isNumber(name, message) {
    return (exec) =>
      typeof exec.context[name] === "number"
        ? ok
        : falha(message);
  },

  isString(name, message) {
    return (exec) =>
      typeof exec.context[name] === "string"
        ? ok
        : falha(message);
  },

  isFunction(name, message) {
    return (exec) =>
      typeof exec.context[name] === "function"
        ? ok
        : falha(message);
  },

  functionReturns(name, arg, expected, message) {
    return (exec) =>
      exec.context[name](arg) === expected
        ? ok
        : falha(message);
  },

  // Chama a função com vários argumentos: callReturns("soma", [2, 3], 5, "...")
  callReturns(name, args, expected, message) {
    return (exec) =>
      exec.context[name](...args) === expected
        ? ok
        : falha(message);
  },

  consoleIncludes(text, message) {
    return (exec) =>
      exec.context.console.output.includes(text)
        ? ok
        : falha(message);
  },

  // A saída do console é exatamente este texto (ignorando espaços nas pontas)
  consoleEquals(text, message) {
    return (exec) =>
      exec.consoleOutput === text
        ? ok
        : falha(message);
  },

  consoleEmpty(message) {
    return (exec) =>
      exec.consoleOutput === ""
        ? ok
        : falha(message);
  },

  // Quantas linhas do console são exatamente "texto"
  consoleCount(text, quantidade, message) {
    return (exec) =>
      linhasConsole(exec).filter((l) => l.trim() === text).length === quantidade
        ? ok
        : falha(message);
  },

  // O código (sem comentários) precisa conter este trecho/regex.
  // Usado para garantir que o aluno usou o recurso ensinado (ex.: um for).
  codeIncludes(padrao, message) {
    const regex = padrao instanceof RegExp ? padrao : new RegExp(padrao.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    return (exec) =>
      regex.test(codigoSemComentarios(exec.code))
        ? ok
        : falha(message);
  },

  FindError(erroEsperado, message) {
    return (exec) =>
      validarErroEsperado(exec, erroEsperado, message)
        ? ok
        : falha(message);
  }
};

export function validator_base(exec, rules) {
  return runRules(exec, rules);
}

export function validator_erro_esperado(exec, rules) {
  return runRulesErroEsperado(exec, rules);
}

// =====================================================================
// MÓDULOS E DESAFIOS
// ---------------------------------------------------------------------
// O progresso é salvo por "id" do módulo e pela quantidade de desafios
// concluídos. Evite trocar o id de um módulo que já existe.
// =====================================================================
export const Modulos = [

  // -------------------------------------------------------------------
  // 1. PRIMEIROS PASSOS
  // -------------------------------------------------------------------
  {
    id: "intro",
    titulo: "Primeiros passos",
    description: "Seu primeiro programa: mostrar mensagens e guardar valores.",
    icon: "",
    Desafios: [
      {
        titulo: "Seu primeiro programa",
        conceito: {
          texto: "Um programa é uma lista de instruções que o computador executa.\n\nA instrução `console.log()` mostra uma mensagem no **Console** (o quadro preto logo abaixo do editor). O texto vai entre aspas, para o JavaScript saber que aquilo é um texto e não um comando.",
          exemplo: 'console.log("Oi!")'
        },
        instrucoes: "O código já está pronto no editor. Clique em ▶ Executar (ou aperte Ctrl + Enter) e veja a mensagem aparecer no Console.",
        codigoInicial: 'console.log("Olá, Mundo!")\n',
        tip: "💡 Dica: não precisa mudar nada, só executar.",
        unlockComplete: ["console", "log"],
        validar: [
          rules.consoleIncludes("Olá, Mundo!", "Execute o código para ver 'Olá, Mundo!' no console.")
        ]
      },
      {
        titulo: "Escrevendo sua mensagem",
        conceito: {
          texto: "Agora é sua vez de escrever. A estrutura é sempre a mesma: `console.log(` + texto entre aspas + `)`.\n\nAspas simples `'...'` e duplas `\"...\"` funcionam igual, só não misture as duas na mesma mensagem.",
          exemplo: "console.log('Bom dia!')"
        },
        instrucoes: "Apague o que estiver no editor e escreva um código que mostre a mensagem: Estou aprendendo JavaScript",
        tip: "💡 Dica: siga a mesma estrutura do exemplo, trocando só o texto. Confira letra por letra se a mensagem ficou igual à pedida.",
        unlockComplete: [],
        validar: [
          rules.codeIncludes(/console\.log\s*\(/, "Use console.log( ) para mostrar a mensagem."),
          rules.consoleIncludes("Estou aprendendo JavaScript", "A mensagem deve ser exatamente: Estou aprendendo JavaScript")
        ]
      },
      {
        titulo: "Uma linha de cada vez",
        conceito: {
          texto: "O computador lê o código de **cima para baixo**, uma linha por vez. Por isso a ordem das linhas importa: o que vem primeiro acontece primeiro.\n\nCada `console.log` mostra uma linha no console.",
          exemplo: 'console.log("Primeiro")\nconsole.log("Segundo")'
        },
        instrucoes: "Mostre três mensagens, nesta ordem, uma em cada linha:\nAcordar\nEscovar os dentes\nTomar café",
        tip: "💡 Dica: use três console.log, um embaixo do outro.",
        unlockComplete: [],
        validar: [
          rules.consoleIncludes("Acordar", "Falta a mensagem 'Acordar'."),
          rules.consoleIncludes("Escovar os dentes", "Falta a mensagem 'Escovar os dentes'."),
          rules.consoleIncludes("Tomar café", "Falta a mensagem 'Tomar café'."),
          rules.consoleIncludes("Acordar\nEscovar os dentes\nTomar café", "As mensagens estão fora de ordem. A ordem das linhas importa!")
        ]
      },
      {
        titulo: "Variáveis: guardando valores",
        conceito: {
          texto: "Uma **variável** é como uma caixa com etiqueta: você dá um nome para ela e guarda um valor dentro.\n\nPara criar uma variável usamos `let`, depois o nome, o sinal `=` e o valor. O `=` aqui quer dizer \"guarde este valor\", não \"é igual\".",
          exemplo: 'let cidade = "Recife"'
        },
        instrucoes: "Crie uma variável chamada nome e guarde nela o texto 'Maria'.",
        tip: "💡 Dica: são 4 partes, nesta ordem: a palavra let, o nome da variável, o sinal = e o valor. Texto vai entre aspas.",
        unlockComplete: ["let"],
        validar: [
          rules.exists("nome", "A variável nome não foi criada."),
          rules.equals("nome", "Maria", "A variável nome deve guardar o texto 'Maria'.")
        ]
      },
      {
        titulo: "Usando uma variável",
        conceito: {
          texto: "Depois de criada, você usa a variável pelo **nome**, sem aspas.\n\nRepare na diferença:\n`console.log(\"cidade\")` mostra a palavra cidade.\n`console.log(cidade)` mostra o **valor guardado** em cidade.",
          exemplo: "let ano = 2026\nconsole.log(\"ano\")   // mostra: ano  (e não 2026!)"
        },
        instrucoes: "A variável nome já foi criada no editor. Na linha de baixo, mostre o valor dela no console usando o nome da variável.",
        codigoInicial: 'let nome = "Maria"\n',
        tip: "💡 Dica: o exemplo mostra a palavra em vez do valor. O que precisa mudar para o JavaScript entender que é o nome de uma variável?",
        unlockComplete: [],
        validar: [
          rules.consoleIncludes("Maria", "O console deve mostrar Maria."),
          rules.codeIncludes(/console\.log\s*\(\s*nome\s*\)/, "Mostre o valor usando a variável: console.log(nome), sem aspas.")
        ]
      },
      {
        titulo: "Mudando o valor",
        conceito: {
          texto: "O valor de uma variável criada com `let` pode mudar. Para trocar, use o nome e `=` de novo, **sem** o `let` (ele só aparece na criação).\n\nJá `const` cria uma variável que **não pode** mudar depois. Use quando o valor for fixo.",
          exemplo: "let vidas = 3\nvidas = vidas - 1   // agora vidas vale 2\n\nconst PI = 3.14    // const: nunca muda"
        },
        instrucoes: "O código cria pontos com o valor 0. Na linha de baixo, mude o valor de pontos para 10. Depois mostre pontos no console.",
        codigoInicial: "let pontos = 0\n",
        tip: "💡 Dica: para trocar o valor você não cria a variável de novo. Qual palavra só aparece na criação?",
        unlockComplete: ["const"],
        validar: [
          rules.codeIncludes(/let\s+pontos\s*=\s*0/, "Mantenha a primeira linha: let pontos = 0"),
          rules.equals("pontos", 10, "No final, pontos deve valer 10."),
          rules.codeIncludes(/(^|[^\w.$])pontos\s*=\s*10/m, "Mude o valor com: pontos = 10"),
          rules.consoleIncludes("10", "Mostre o valor de pontos no console.")
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // 2. NÚMEROS E OPERAÇÕES
  // -------------------------------------------------------------------
  {
    id: "operadores",
    titulo: "Números e operações",
    description: "Faça contas e compare valores.",
    icon: "",
    Desafios: [
      {
        titulo: "Números",
        conceito: {
          texto: "Números são escritos **sem aspas**. Com aspas, viram texto!\n\n`let a = 20` guarda o número 20.\n`let b = \"20\"` guarda o texto \"20\", que o JavaScript não usa para fazer contas.",
          exemplo: "let altura = 1.75   // número com casas decimais usa ponto\nlet ano = 2026"
        },
        instrucoes: "Crie uma variável idade com o número 25 (como número, sem aspas).",
        tip: "💡 Dica: lembre da diferença entre 25 e \"25\".",
        unlockComplete: [],
        validar: [
          rules.exists("idade", "A variável idade não foi criada."),
          rules.isNumber("idade", "idade deve ser um número. Tire as aspas!"),
          rules.equals("idade", 25, "idade deve valer 25.")
        ]
      },
      {
        titulo: "Operações matemáticas",
        conceito: {
          texto: "O JavaScript faz contas com estes operadores:\n`+` soma, `-` subtração, `*` multiplicação e `/` divisão.\n\nO resultado pode ir direto para uma variável.",
          exemplo: "console.log(10 * 2)   // 20\nconsole.log(9 / 2)    // 4.5"
        },
        instrucoes: "Crie uma variável soma que receba o resultado de 2 + 3.",
        tip: "💡 Dica: o exemplo mostra a conta direto no console. Aqui o resultado precisa ir para uma variável.",
        unlockComplete: [],
        validar: [
          rules.exists("soma", "A variável soma não foi criada."),
          rules.isNumber("soma", "A variável soma deve ser numérica."),
          rules.equals("soma", 5, "A variável soma deve ser igual a 5."),
          rules.codeIncludes(/\+/, "Use o operador + para fazer a conta.")
        ]
      },
      {
        titulo: "Contas com variáveis",
        conceito: {
          texto: "Você pode fazer contas usando variáveis no lugar dos números. Assim, se o valor mudar, a conta continua certa.",
          exemplo: "let lado = 5\nconsole.log(lado * 4)   // 20\n\nlado = 8\nconsole.log(lado * 4)   // 32: a conta acompanha o valor"
        },
        instrucoes: "Já existem as variáveis preco e quantidade. Crie a variável total com o preço vezes a quantidade (use as variáveis, não o número pronto) e mostre total no console.",
        codigoInicial: "let preco = 15\nlet quantidade = 4\n",
        tip: "💡 Dica: qual operador multiplica? Use os nomes das variáveis na conta, não os números.",
        unlockComplete: [],
        validar: [
          rules.equals("total", 60, "total deve ser 60 (15 × 4)."),
          rules.codeIncludes(/preco\s*\*\s*quantidade|quantidade\s*\*\s*preco/, "Calcule usando as variáveis: preco * quantidade."),
          rules.consoleIncludes("60", "Mostre o total no console.")
        ]
      },
      {
        titulo: "Resto da divisão",
        conceito: {
          texto: "O operador `%` dá o **resto** de uma divisão.\n\n`7 % 2` é 1, porque 7 dividido por 2 dá 3 e sobra 1.\n\nIsso é muito usado para saber se um número é par: se `numero % 2` for 0, ele é par.",
          exemplo: "let sobra = 7 % 2   // 1\nlet par = 8 % 2     // 0"
        },
        instrucoes: "Você tem 17 balas para dividir igualmente entre 5 amigos. Cada um recebe a mesma quantidade e o que não dá para dividir sobra. Crie a variável sobra com quantas balas sobram (use as variáveis, faça a conta no código).",
        codigoInicial: "let balas = 17\nlet amigos = 5\n",
        tip: "💡 Dica: dividir igualmente e ver o que sobra... qual operador faz exatamente isso?",
        unlockComplete: [],
        validar: [
          rules.exists("sobra", "A variável sobra não foi criada."),
          rules.equals("sobra", 2, "Ainda não. 17 balas para 5 amigos: cada um recebe 3 e sobram..."),
          rules.codeIncludes(/balas\s*%\s*amigos/, "Faça a conta com as variáveis e o operador que dá o resto.")
        ]
      },
      {
        titulo: "Comparando valores",
        conceito: {
          texto: "Comparações respondem perguntas com **true** (verdadeiro) ou **false** (falso):\n`>` maior, `<` menor, `>=` maior ou igual, `<=` menor ou igual, `===` igual e `!==` diferente.\n\nRepare: para **comparar** usamos `===`. Um `=` sozinho serve para **guardar**.",
          exemplo: "let nota = 8\nconsole.log(nota >= 7)    // true\nconsole.log(nota === 10)  // false"
        },
        instrucoes: "Crie a variável maiorDeIdade que guarde o resultado da comparação: idade é maior ou igual a 18?",
        codigoInicial: "let idade = 20\n",
        tip: "💡 Dica: \"maior ou igual\" tem um operador próprio. O resultado da comparação pode ir direto para a variável.",
        unlockComplete: [],
        validar: [
          rules.exists("maiorDeIdade", "A variável maiorDeIdade não foi criada."),
          rules.equals("maiorDeIdade", true, "maiorDeIdade deve ser o resultado de idade >= 18 (que dá true)."),
          rules.codeIncludes(/idade\s*>=\s*18/, "Use a comparação idade >= 18.")
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // 3. TEXTOS (STRINGS)
  // -------------------------------------------------------------------
  {
    id: "strings",
    titulo: "Textos (strings)",
    description: "Junte, monte e transforme textos.",
    icon: "",
    Desafios: [
      {
        titulo: "Juntando textos",
        conceito: {
          texto: "Em programação, texto se chama **string**.\n\nCom textos, o `+` não soma: ele **junta** (concatena). Cuidado com os espaços: eles também fazem parte do texto.",
          exemplo: "let primeiro = \"Ana\"\nlet ultimo = \"Souza\"\nconsole.log(primeiro + \" \" + ultimo)   // Ana Souza"
        },
        instrucoes: "Crie a variável saudacao juntando o texto 'Olá, ' com a variável nome. O resultado deve ser: Olá, Ana",
        codigoInicial: 'let nome = "Ana"\n',
        tip: "💡 Dica: o resultado precisa ter a vírgula e o espaço depois de Olá. Eles fazem parte do texto entre aspas.",
        unlockComplete: [],
        validar: [
          rules.exists("saudacao", "A variável saudacao não foi criada."),
          rules.equals("saudacao", "Olá, Ana", "saudacao deve ser exatamente 'Olá, Ana' (repare na vírgula e no espaço)."),
          rules.codeIncludes(/\+\s*nome|nome\s*\+/, "Use a variável nome com o +.")
        ]
      },
      {
        titulo: "Template strings",
        conceito: {
          texto: "Juntar muitos pedaços com `+` fica confuso. A alternativa é a **template string**: um texto escrito entre **crases** (o acento grave, em vez de aspas) onde você coloca variáveis dentro de `${ }`.",
          exemplo: "let pet = \"Rex\"\nconsole.log(`O ${pet} está com fome`)   // O Rex está com fome"
        },
        instrucoes: "Usando template string, crie a variável frase com o texto: Meu nome é Ana e tenho 25 anos (use as variáveis nome e idade).",
        codigoInicial: 'let nome = "Ana"\nlet idade = 25\n',
        tip: "💡 Dica: escreva a frase inteira entre crases e, no lugar de cada valor, use ${nomeDaVariavel}.",
        unlockComplete: [],
        validar: [
          rules.equals("frase", "Meu nome é Ana e tenho 25 anos", "frase deve ser: Meu nome é Ana e tenho 25 anos"),
          rules.codeIncludes(/`[^`]*\$\{\s*nome\s*\}[^`]*\$\{\s*idade\s*\}[^`]*`/, "Use uma template string com ${nome} e ${idade}.")
        ]
      },
      {
        titulo: "Tamanho de um texto",
        conceito: {
          texto: "Todo texto sabe o próprio tamanho. Basta colocar `.length` depois dele, que você recebe a quantidade de caracteres (espaços também contam).",
          exemplo: 'let palavra = "sol"\nconsole.log(palavra.length)  // 3'
        },
        instrucoes: "Um site exige senhas com pelo menos 8 caracteres. Crie a variável senhaValida que guarde true ou false, comparando o tamanho de senha com 8.",
        codigoInicial: 'let senha = "gato123"\n',
        tip: "💡 Dica: junte duas coisas que você já sabe: .length para o tamanho e uma comparação (que já dá true ou false).",
        unlockComplete: ["length"],
        validar: [
          rules.exists("senhaValida", "A variável senhaValida não foi criada."),
          rules.codeIncludes(/senha\.length/, "Use senha.length para saber o tamanho."),
          rules.codeIncludes(/>=\s*8|8\s*<=/, "A senha precisa ter PELO MENOS 8 caracteres. Qual comparação inclui o 8?"),
          rules.equals("senhaValida", false, "\"gato123\" tem 7 caracteres, então senhaValida deve ser false.")
        ]
      },
      {
        titulo: "Transformando textos",
        conceito: {
          texto: "Textos têm **métodos**: ações que você chama com um ponto e parênteses.\n`.toUpperCase()` deixa tudo em MAIÚSCULAS.\n`.toLowerCase()` deixa tudo em minúsculas.\n\nO texto original não muda: o método devolve um texto novo.",
          exemplo: "let cidade = \"SÃO PAULO\"\nconsole.log(cidade.toLowerCase())   // são paulo"
        },
        instrucoes: "Crie a variável grito com a palavra em letras maiúsculas e mostre grito no console.",
        codigoInicial: 'let palavra = "socorro"\n',
        tip: "💡 Dica: o exemplo usa o método que deixa tudo minúsculo. Qual é o outro, citado no texto?",
        unlockComplete: ["toUpperCase", "toLowerCase"],
        validar: [
          rules.equals("grito", "SOCORRO", "grito deve ser 'SOCORRO'."),
          rules.codeIncludes(/\.toUpperCase\s*\(\s*\)/, "Use .toUpperCase()."),
          rules.consoleIncludes("SOCORRO", "Mostre grito no console.")
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // 4. CONDICIONAIS
  // -------------------------------------------------------------------
  {
    id: "condicionais",
    titulo: "Condicionais",
    description: "Faça o programa tomar decisões com if e else.",
    icon: "",
    Desafios: [
      {
        titulo: "if: só se for verdade",
        conceito: {
          texto: "O `if` (\"se\") executa um bloco de código **somente se** a condição entre parênteses for verdadeira (true).\n\nO bloco é tudo que está entre as chaves `{ }`. Se a condição for falsa, o programa pula o bloco.",
          exemplo: 'let chovendo = true\n\nif (chovendo) {\n  console.log("Leve o guarda-chuva")\n}'
        },
        instrucoes: "Execute o código e veja a mensagem. Depois mude a temperatura para 15 e execute de novo: repare que nada aparece, porque a condição ficou falsa.",
        codigoInicial: 'let temperatura = 30\n\nif (temperatura > 25) {\n  console.log("Está calor!")\n}\n',
        tip: "💡 Dica: só precisa mudar o valor da temperatura, na primeira linha.",
        unlockComplete: ["if"],
        validar: [
          rules.codeIncludes(/if\s*\(/, "Mantenha o if no código."),
          rules.equals("temperatura", 15, "Mude a temperatura para 15."),
          rules.consoleEmpty("Com temperatura 15 o console deve ficar vazio.")
        ]
      },
      {
        titulo: "else: senão...",
        conceito: {
          texto: "O `else` (\"senão\") é o caminho alternativo: ele roda quando a condição do `if` é **falsa**.\n\nAssim, sempre um dos dois blocos é executado, nunca os dois.",
          exemplo: "if (saldo > 0) {\n  console.log(\"Pode comprar\")\n} else {\n  console.log(\"Sem saldo\")\n}"
        },
        instrucoes: "Adicione um else que mostre 'Está frio!' quando a temperatura não for maior que 25.",
        codigoInicial: 'let temperatura = 15\n\nif (temperatura > 25) {\n  console.log("Está calor!")\n}\n',
        tip: "💡 Dica: o else vem logo depois da chave } que fecha o if, e tem o próprio bloco { }.",
        unlockComplete: ["else"],
        validar: [
          rules.codeIncludes(/\}\s*else\s*\{/, "Use else { ... } logo depois do bloco do if."),
          (exec) => {
            const esperado = exec.context.temperatura > 25 ? "Está calor!" : "Está frio!";
            return rules.consoleEquals(esperado, `Com temperatura ${exec.context.temperatura}, o console deve mostrar apenas: ${esperado}`)(exec);
          }
        ]
      },
      {
        titulo: "Maior de idade",
        conceito: {
          texto: "Agora junte tudo: uma variável, uma comparação e o if/else.\n\nDica de leitura: \"**se** idade for maior ou igual a 18, mostre isso; **senão**, mostre aquilo\".",
          exemplo: ""
        },
        instrucoes: "Use if/else para mostrar 'maior de idade' se idade for maior ou igual a 18, senão 'menor de idade'.",
        codigoInicial: "let idade = 16\n",
        tip: "💡 Dica: leia em voz alta: \"se idade for maior ou igual a 18... senão...\". Agora traduza para if/else.",
        unlockComplete: [],
        validar: [
          rules.exists("idade", "A variável idade não foi criada."),
          rules.codeIncludes(/if\s*\(/, "Use um if."),
          rules.codeIncludes(/else/, "Use um else."),
          (exec) =>
            exec.context.idade >= 18
              ? rules.consoleEquals("maior de idade", "Para idade >= 18, mostre apenas 'maior de idade'.")(exec)
              : rules.consoleEquals("menor de idade", "Para idade < 18, mostre apenas 'menor de idade'.")(exec)
        ]
      },
      {
        titulo: "else if: várias opções",
        conceito: {
          texto: "Quando existem mais de dois caminhos, use `else if` (\"senão, se\"). O JavaScript testa as condições **em ordem** e executa só o primeiro bloco cuja condição for verdadeira.",
          exemplo: 'if (hora < 12) {\n  console.log("Bom dia")\n} else if (hora < 18) {\n  console.log("Boa tarde")\n} else {\n  console.log("Boa noite")\n}'
        },
        instrucoes: "Mostre 'Aprovado' se a nota for 7 ou mais, 'Recuperação' se for 5 ou mais, e 'Reprovado' nos outros casos.",
        codigoInicial: "let nota = 6\n",
        tip: "💡 Dica: a ordem importa! Teste primeiro a nota mais alta. Se testar >= 5 primeiro, quem tirou 8 também entraria ali.",
        unlockComplete: [],
        validar: [
          rules.codeIncludes(/else\s+if\s*\(/, "Use else if para a segunda condição."),
          (exec) => {
            const n = exec.context.nota;
            const esperado = n >= 7 ? "Aprovado" : n >= 5 ? "Recuperação" : "Reprovado";
            return rules.consoleEquals(esperado, `Com nota ${n}, o console deve mostrar apenas: ${esperado}`)(exec);
          }
        ]
      },
      {
        titulo: "E / OU",
        conceito: {
          texto: "Você pode combinar condições:\n`&&` (E): verdadeiro só se **as duas** forem verdadeiras.\n`||` (OU): verdadeiro se **pelo menos uma** for verdadeira.",
          exemplo: 'if (temDinheiro && lojaAberta) {\n  console.log("Vamos às compras")\n}'
        },
        instrucoes: "Mostre 'Pode entrar' se a pessoa tiver 18 anos ou mais E tiver ingresso. Senão, mostre 'Entrada negada'.",
        codigoInicial: "let idade = 20\nlet temIngresso = true\n",
        tip: "💡 Dica: são duas condições que precisam ser verdadeiras ao mesmo tempo. Qual operador significa \"E\"?",
        unlockComplete: [],
        validar: [
          rules.codeIncludes("&&", "Use o operador && para combinar as condições."),
          (exec) => {
            const { idade, temIngresso } = exec.context;
            const esperado = idade >= 18 && temIngresso ? "Pode entrar" : "Entrada negada";
            return rules.consoleEquals(esperado, `Com esses valores, o console deve mostrar apenas: ${esperado}`)(exec);
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // 5. LAÇOS DE REPETIÇÃO
  // -------------------------------------------------------------------
  {
    id: "loops",
    titulo: "Laços de repetição",
    description: "Repita tarefas sem copiar e colar código.",
    icon: "",
    Desafios: [
      {
        titulo: "Por que repetir?",
        conceito: {
          texto: "Imagine mostrar \"Olá\" 100 vezes: copiar 100 linhas não dá! O `for` repete um bloco de código.\n\nEle tem três partes, separadas por `;`:\n1. **início**: `let i = 0` cria um contador;\n2. **condição**: `i < 3`, repete enquanto for verdade;\n3. **passo**: `i++` soma 1 ao contador a cada volta.",
          exemplo: 'for (let i = 0; i < 2; i++) {\n  console.log("Tchau")\n}\n// mostra Tchau 2 vezes'
        },
        instrucoes: "Execute e veja 'Olá' aparecer 3 vezes. Depois mude o código para mostrar 'Olá' 5 vezes.",
        codigoInicial: 'for (let i = 0; i < 3; i++) {\n  console.log("Olá")\n}\n',
        tip: "💡 Dica: qual das três partes do for decide quantas vezes ele repete?",
        unlockComplete: ["for"],
        validar: [
          rules.codeIncludes(/for\s*\(/, "Mantenha o for."),
          rules.consoleCount("Olá", 5, "'Olá' deve aparecer exatamente 5 vezes.")
        ]
      },
      {
        titulo: "Usando o contador",
        conceito: {
          texto: "A variável `i` muda a cada volta do laço, e você pode usá-la dentro do bloco. Começando em 1 e indo até 5 (`i <= 5`), dá para contar!",
          exemplo: "for (let i = 0; i < 3; i++) {\n  console.log(i)\n}\n// mostra 0, 1, 2"
        },
        instrucoes: "Use um for para mostrar os números de 1 a 5, um por linha.",
        tip: "💡 Dica: o exemplo começa no 0 e para antes do 3. Em qual número o seu precisa começar? E qual condição faz ele chegar no 5?",
        unlockComplete: [],
        validar: [
          rules.codeIncludes(/for\s*\(/, "Use um for."),
          rules.consoleEquals("1\n2\n3\n4\n5", "O console deve mostrar só os números de 1 a 5, um por linha.")
        ]
      },
      {
        titulo: "Contagem regressiva",
        conceito: {
          texto: "O passo também pode **diminuir**: `i--` subtrai 1 a cada volta. Nesse caso, comece no número maior e repita enquanto `i` for maior ou igual ao menor.",
          exemplo: "let x = 5\nx--\nconsole.log(x)   // 4"
        },
        instrucoes: "Faça uma contagem regressiva de 5 até 1 com for e, depois do laço, mostre 'Fogo!'.",
        tip: "💡 Dica: pense nas três partes: onde começa, até quando repete e se o contador sobe ou desce. E o Fogo! só aparece uma vez, então fica fora do laço.",
        unlockComplete: [],
        validar: [
          rules.codeIncludes(/for\s*\(/, "Use um for."),
          rules.codeIncludes(/--|-=/, "Use i-- para diminuir o contador."),
          rules.consoleEquals("5\n4\n3\n2\n1\nFogo!", "O console deve mostrar 5, 4, 3, 2, 1 e depois Fogo!")
        ]
      },
      {
        titulo: "Acumulando valores",
        conceito: {
          texto: "Um uso clássico do laço é **acumular**: criar uma variável antes do laço e ir somando a ela a cada volta.\n\n`total = total + i` (ou o atalho `total += i`) pega o valor atual e soma `i`.",
          exemplo: "let estrelas = \"\"\nfor (let i = 1; i <= 3; i++) {\n  estrelas += \"*\"\n}\nconsole.log(estrelas)   // ***"
        },
        instrucoes: "Use um for para somar todos os números de 1 a 10 na variável soma. No final, mostre soma no console.",
        codigoInicial: "let soma = 0\n",
        tip: "💡 Dica: em cada volta, some o valor do contador à variável soma. Ela começa em 0, fora do laço.",
        unlockComplete: [],
        validar: [
          rules.codeIncludes(/for\s*\(/, "Use um for."),
          rules.equals("soma", 55, "soma deve ser 55 (1 + 2 + ... + 10)."),
          rules.consoleIncludes("55", "Mostre soma no console.")
        ]
      },
      {
        titulo: "while: enquanto for verdade",
        conceito: {
          texto: "O `while` (\"enquanto\") repete enquanto a condição for verdadeira. Ele é mais simples que o for, mas **você** precisa mudar a variável dentro do bloco.\n\nSe esquecer, a condição nunca fica falsa e o laço não termina (loop infinito). O CheetahJS interrompe seu código depois de 2 segundos se isso acontecer.",
          exemplo: "let vidas = 3\nwhile (vidas > 0) {\n  console.log(vidas)\n  vidas--\n}"
        },
        instrucoes: "Use um while para mostrar os números de 1 a 3.",
        codigoInicial: "let i = 1\n",
        tip: "💡 Dica: qual é a condição para continuar repetindo? E não esqueça de aumentar o i dentro do bloco, senão o laço nunca termina.",
        unlockComplete: ["while"],
        validar: [
          rules.codeIncludes(/while\s*\(/, "Use um while."),
          rules.consoleEquals("1\n2\n3", "O console deve mostrar só 1, 2 e 3.")
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // 6. ARRAYS
  // -------------------------------------------------------------------
  {
    id: "arrays",
    titulo: "Arrays (listas)",
    description: "Guarde vários valores em uma única variável.",
    icon: "",
    Desafios: [
      {
        titulo: "Criando uma lista",
        conceito: {
          texto: "Um **array** é uma lista de valores guardada em uma só variável. Os itens ficam entre colchetes `[ ]`, separados por vírgula.",
          exemplo: 'let notas = [7, 9, 10]\nlet cores = ["azul", "verde"]'
        },
        instrucoes: "Crie um array chamado frutas com 'maçã', 'banana' e 'laranja'.",
        tip: "💡 Dica: colchetes por fora, cada texto entre aspas e vírgulas entre os itens.",
        unlockComplete: [],
        validar: [
          rules.exists("frutas", "O array frutas não foi criado."),
          (exec) =>
            Array.isArray(exec.context.frutas)
              ? ok
              : falha("frutas deve ser um array (use colchetes [ ])."),
          (exec) =>
            ["maçã", "banana", "laranja"].every((f) => exec.context.frutas.includes(f))
              ? ok
              : falha("O array deve conter 'maçã', 'banana' e 'laranja'.")
        ]
      },
      {
        titulo: "Acessando pela posição",
        conceito: {
          texto: "Cada item tem uma posição, chamada **índice**. Atenção: a contagem começa no **0**!\n\nPara pegar um item, use o nome do array e o índice entre colchetes.",
          exemplo: 'let cores = ["azul", "verde", "rosa"]\nconsole.log(cores[0])  // azul\nconsole.log(cores[2])  // rosa'
        },
        instrucoes: "Mostre no console o segundo valor do array numeros.",
        codigoInicial: "let numeros = [10, 20, 30]\n",
        tip: "💡 Dica: se o primeiro item é a posição 0, qual é a posição do segundo?",
        unlockComplete: [],
        validar: [
          rules.codeIncludes(/numeros\s*\[\s*1\s*\]/, "Acesse o item com numeros[1]."),
          rules.consoleEquals("20", "O console deve mostrar 20.")
        ]
      },
      {
        titulo: "Tamanho e último item",
        conceito: {
          texto: "Assim como os textos, arrays têm `.length`, a quantidade de itens.\n\nComo o índice começa em 0, o **último** item fica na posição `length - 1`. Isso funciona para listas de qualquer tamanho.",
          exemplo: "let letras = [\"a\", \"b\", \"c\"]\nconsole.log(letras.length)   // 3\nconsole.log(letras[2])       // c, a última posição é 2"
        },
        instrucoes: "Crie a variável ultimo com o último item de frutas, usando frutas.length (não use o número 3 direto).",
        codigoInicial: 'let frutas = ["maçã", "banana", "pera", "uva"]\n',
        tip: "💡 Dica: repare no exemplo: o tamanho é 3, mas a última posição é 2. Como escrever essa posição usando .length?",
        unlockComplete: [],
        validar: [
          rules.equals("ultimo", "uva", "ultimo deve ser 'uva'."),
          rules.codeIncludes(/frutas\.length\s*-\s*1/, "Use frutas.length - 1 como índice.")
        ]
      },
      {
        titulo: "Adicionando itens",
        conceito: {
          texto: "Para colocar um item no **final** da lista, use o método `.push()`. O array cresce automaticamente.",
          exemplo: 'let tarefas = ["estudar"]\ntarefas.push("treinar")\n// ["estudar", "treinar"]'
        },
        instrucoes: "Adicione 'leite' ao final da lista de compras usando push. Depois mostre a lista no console.",
        codigoInicial: 'let compras = ["arroz", "feijão"]\n',
        tip: "💡 Dica: o método vem depois do nome da lista, com um ponto, e o item vai dentro dos parênteses.",
        unlockComplete: ["push"],
        validar: [
          rules.codeIncludes(/compras\.push\s*\(/, "Use compras.push( )."),
          (exec) =>
            Array.isArray(exec.context.compras) && exec.context.compras[exec.context.compras.length - 1] === "leite" && exec.context.compras.length === 3
              ? ok
              : falha("A lista deve ficar: arroz, feijão, leite."),
          rules.consoleIncludes("leite", "Mostre a lista no console.")
        ]
      },
      {
        titulo: "Percorrendo uma lista",
        conceito: {
          texto: "Para fazer algo com **cada** item, junte o `for` com o índice: o contador vai de 0 até `length - 1`, e `lista[i]` pega o item daquela volta.",
          exemplo: "for (let i = 0; i < 3; i++) {\n  console.log(\"posição \" + i)\n}\n// posição 0, posição 1, posição 2"
        },
        instrucoes: "Use um for para mostrar cada cor da lista, uma por linha.",
        codigoInicial: 'let cores = ["vermelho", "verde", "azul"]\n',
        tip: "💡 Dica: o exemplo mostra só as posições. Como usar o i para pegar o item da lista naquela posição? E para a lista de qualquer tamanho, use .length na condição.",
        unlockComplete: [],
        validar: [
          rules.codeIncludes(/for\s*\(/, "Use um for."),
          rules.consoleEquals("vermelho\nverde\nazul", "O console deve mostrar vermelho, verde e azul, um por linha.")
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // 7. FUNÇÕES
  // -------------------------------------------------------------------
  {
    id: "funcoes",
    titulo: "Funções",
    description: "Organize seu código em blocos reutilizáveis.",
    icon: "",
    Desafios: [
      {
        titulo: "Criando e chamando",
        conceito: {
          texto: "Uma **função** é um bloco de código com nome, que você pode usar quantas vezes quiser.\n\nCriar a função só **ensina** o que ela faz. Ela só roda quando você a **chama**: o nome seguido de parênteses.",
          exemplo: "function pular() {\n  console.log(\"Pulou!\")\n}\n\npular()   // chama a função"
        },
        instrucoes: "A função dizerOla já existe, mas ninguém chamou ela ainda. Chame a função duas vezes, para 'Olá!' aparecer 2 vezes no console.",
        codigoInicial: 'function dizerOla() {\n  console.log("Olá!")\n}\n\n',
        tip: "💡 Dica: para chamar, use o nome da função seguido de parênteses. Quantas vezes precisa aparecer?",
        unlockComplete: ["function"],
        validar: [
          rules.isFunction("dizerOla", "Mantenha a função dizerOla."),
          rules.consoleCount("Olá!", 2, "'Olá!' deve aparecer exatamente 2 vezes. Chame dizerOla() duas vezes.")
        ]
      },
      {
        titulo: "Parâmetros",
        conceito: {
          texto: "**Parâmetros** são valores que a função recebe para trabalhar. Eles vão entre os parênteses da criação e funcionam como variáveis dentro da função.\n\nNa chamada, você passa o valor que quer usar.",
          exemplo: "function mostrarDobro(numero) {\n  console.log(numero * 2)\n}\n\nmostrarDobro(4)   // 8"
        },
        instrucoes: "Crie uma função chamada saudacao que recebe um nome e mostra 'Olá, ' seguido do nome.",
        tip: "💡 Dica: o nome que a função recebe é o parâmetro. Junte \"Olá, \" com ele usando o +.",
        unlockComplete: [],
        validar: [
          rules.exists("saudacao", "A função saudacao não foi criada."),
          rules.isFunction("saudacao", "saudacao deve ser uma função."),
          (exec) => {
            exec.context.saudacao("Joao");
            return rules.consoleIncludes(
              "Olá, Joao\n",
              "Testamos saudacao(\"Joao\") e esperávamos ver: Olá, Joao"
            )(exec);
          }
        ]
      },
      {
        titulo: "Retornando um valor",
        conceito: {
          texto: "Até agora as funções só **mostravam** coisas. Com `return`, a função **devolve** um valor para quem chamou, e esse valor pode ir para uma variável ou para uma conta.\n\nO `return` também encerra a função naquele ponto.",
          exemplo: "function saudacaoPara(nome) {\n  return \"Oi, \" + nome\n}\n\nlet msg = saudacaoPara(\"Bia\")   // msg vale \"Oi, Bia\""
        },
        instrucoes: "Crie uma função chamada dobro que recebe um número e retorna o dobro dele.",
        tip: "💡 Dica: aqui a função não deve mostrar nada no console. Ela precisa devolver o resultado da conta com return.",
        unlockComplete: ["return"],
        validar: [
          rules.isFunction("dobro", "Crie a função dobro."),
          rules.functionReturns("dobro", 4, 8, "Testamos dobro(4) e esperávamos 8. Lembre de usar return."),
          rules.functionReturns("dobro", 10, 20, "Testamos dobro(10) e esperávamos 20.")
        ]
      },
      {
        titulo: "Vários parâmetros",
        conceito: {
          texto: "Uma função pode receber vários parâmetros, separados por vírgula. A ordem importa: o primeiro valor da chamada vai para o primeiro parâmetro, e assim por diante.",
          exemplo: "function apresentar(nome, idade) {\n  return nome + \" tem \" + idade + \" anos\"\n}\n\napresentar(\"Leo\", 30)   // \"Leo tem 30 anos\""
        },
        instrucoes: "Crie uma função soma que recebe dois números (a e b) e retorna a soma deles.",
        tip: "💡 Dica: a função recebe a e b. O que ela precisa devolver?",
        unlockComplete: [],
        validar: [
          rules.isFunction("soma", "Crie a função soma."),
          rules.callReturns("soma", [2, 3], 5, "Testamos soma(2, 3) e esperávamos 5."),
          rules.callReturns("soma", [10, -4], 6, "Testamos soma(10, -4) e esperávamos 6.")
        ]
      },
      {
        titulo: "Juntando tudo: par ou ímpar",
        conceito: {
          texto: "Hora de combinar o que você aprendeu: função, parâmetro, `%`, comparação e `return`.\n\nLembre: um número é par quando o resto da divisão por 2 é 0. E uma comparação já devolve true ou false, então ela pode ir direto no return.",
          exemplo: "function ehMaior(a, b) {\n  return a > b\n}\n\nehMaior(5, 2)  // true"
        },
        instrucoes: "Crie a função ehPar que recebe um número e retorna true se ele for par, ou false se for ímpar.",
        tip: "💡 Dica: qual operador dá o resto da divisão? E qual comparação diz se o resto é zero?",
        unlockComplete: [],
        validar: [
          rules.isFunction("ehPar", "Crie a função ehPar."),
          rules.functionReturns("ehPar", 4, true, "Testamos ehPar(4) e esperávamos true."),
          rules.functionReturns("ehPar", 7, false, "Testamos ehPar(7) e esperávamos false."),
          rules.functionReturns("ehPar", 0, true, "Testamos ehPar(0) e esperávamos true (zero é par).")
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // 8. ERROS
  // -------------------------------------------------------------------
  {
    id: "erros",
    titulo: "Entendendo erros",
    description: "Leia mensagens de erro e aprenda com elas.",
    icon: "",
    Desafios: [
      {
        titulo: "Lendo uma mensagem de erro",
        conceito: {
          texto: "Errar faz parte de programar! Quando algo dá errado, o console mostra **em qual linha** foi e **o que** aconteceu. A linha com problema também fica destacada em vermelho no editor.\n\nLer a mensagem com calma é o primeiro passo para corrigir.",
          exemplo: "// ReferenceError: total is not defined\n// quer dizer: \"total não foi criada\""
        },
        instrucoes: "Execute o código e leia o erro. Depois corrija o problema para o console mostrar Olá.",
        codigoInicial: 'let mensagem = "Olá"\nconsole.log(mensagen)\n',
        tip: "💡 Dica: compare com atenção o nome da variável nas duas linhas.",
        unlockComplete: [],
        validar: [
          rules.consoleEquals("Olá", "O console deve mostrar apenas: Olá")
        ]
      },
      {
        titulo: "Erro de referência",
        tipo: "erro-didatico",
        conceito: {
          texto: "Um **ReferenceError** acontece quando você usa um nome que o JavaScript não conhece, como uma variável que nunca foi criada ou um nome digitado errado.\n\nAgora o desafio é ao contrário: provoque esse erro de propósito!",
          exemplo: "// Mensagem que aparece no console:\n// ReferenceError: pontuacao is not defined"
        },
        instrucoes: "Escreva um código que gere um ReferenceError.",
        tip: "💡 Dica: o que acontece se você usar um nome que o JavaScript nunca viu?",
        erroEsperado: "ReferenceError",
        unlockComplete: [],
        validar: [
          rules.FindError("ReferenceError", "O código deve gerar um ReferenceError.")
        ]
      },
      {
        titulo: "Erro de tipo",
        tipo: "erro-didatico",
        conceito: {
          texto: "Um **TypeError** acontece quando você usa um valor de um jeito que o tipo dele não permite. Por exemplo, chamar como função algo que é um número.",
          exemplo: "// Mensagem que aparece no console:\n// TypeError: idade is not a function"
        },
        instrucoes: "Escreva um código que gere um TypeError.",
        tip: "💡 Dica: leia a mensagem do exemplo. O que alguém tentou fazer com idade?",
        erroEsperado: "TypeError",
        unlockComplete: [],
        validar: [
          rules.FindError("TypeError", "O código deve gerar um TypeError.")
        ]
      },
      {
        titulo: "Erro de sintaxe",
        tipo: "erro-didatico",
        conceito: {
          texto: "Um **SyntaxError** é um erro de \"gramática\" do código: algo escrito fora das regras da linguagem, como um parêntese ou uma aspa que abriu e não fechou.\n\nEsse erro impede o código inteiro de rodar, até as linhas que estavam certas.",
          exemplo: "// Mensagem que aparece no console:\n// SyntaxError: missing ) after argument list"
        },
        instrucoes: "Escreva um código que gere um SyntaxError.",
        tip: "💡 Dica: pense em algo que abre e não fecha: parênteses, chaves ou aspas.",
        erroEsperado: "SyntaxError",
        unlockComplete: [],
        validar: [
          rules.FindError("SyntaxError", "O código deve gerar um SyntaxError.")
        ]
      }
    ]
  }
];
