import { ErrorTranslator } from "../core/ErrorTranslator.js";

export function AppController(editor, desafios, feedback, output) {

    const errorTranslator = ErrorTranslator();

    function carregarDesafio() {
        const dados = desafios.getDados();

        document.getElementById("desafio-number").textContent =
            `Desafio ${desafios.getAtual() + 1}`;

        document.getElementById("titulo").textContent = dados.titulo;
        document.getElementById("instrucoes").textContent = dados.instrucoes;

        output.clear();
    }

    function extrairLinhaColuna(erro) {
        const match = erro.stack?.match(/<anonymous>:(\d+):(\d+)/);

        if (!match) return null;

        return {
            linha: Number(match[1]) - 2,
            coluna: Number(match[2])
        };
    }

    function executar() {
        const code = editor.getValue();
        editor.limparDestaques();
        editor.animarExecucaoCodeMirror()

        output.clear();

        // 1️⃣ Executar o código SEMPRE
        try {
            const fakeConsole = {
                _output: "",
                log: (...args) => {
                    fakeConsole._output += args.join(" ") + "\n";
                }
            };

            new Function("console", code)(fakeConsole);

            output.set(fakeConsole._output || "Código sem erros. Console sem mensagens.\nuse console.log() para exibir mensagens aqui :)");
        } catch (e) {

            const info = extrairLinhaColuna(e);
            const mensagemAmigavel = errorTranslator.traduzir(e);

            if (info) {
                editor.destacarLinha(info.linha);
                output.set(
                    `Erro na linha: ${info.linha}\n` +
                    `${mensagemAmigavel.text}\n\n` +
                    `Detalhe técnico:\n${e.name}: ${e.message}`
                );
            } else {
                output.set(
                    `Sem Informação de linha.\n` +
                    `${mensagemAmigavel.text}\n\n` +
                    `Detalhe técnico:\n${e.name}: ${e.message}`
                );
            }

            output.set(
                `❌ Erro na linha ${info?.linha ?? "desconhecida"}\n${mensagemAmigavel.text}\n\nDetalhe técnico:\n${e.name}: ${e.message}`
            );

            if (!desafios.isTypeError() && mensagemAmigavel.hint) {
                output.append(`\n💡 Dica:${mensagemAmigavel.hint}`);
            }
        }

        // 2️⃣ Validar SEPARADAMENTE
        try {
            const valido = desafios.validar(code);

            console.log(valido.message)

            if (valido.ok) {
                desafios.avancar();
                editor.addToAutoComplete(desafios.getDadosUnlock());
                feedback.show("Parabéns! Você completou o desafio.", "success");
            } else {
                feedback.show("Desafio não foi completo. Tente novamente.", "error");
                output.append(`\nDesafio não concluído. ${valido.message || "Revise as instruções e tente novamente."}`
                    );
            }
        } catch (e) {
            feedback.show("Erro na validação: " + e.message, "error");
        }
    }

    function proximoDesafio() {
        if (!desafios.podeAvancar()) {
            feedback.show(
                `Complete o desafio ${desafios.getAtual() + 1} antes de continuar`,
                "error"
            );
            return;
        }

        desafios.proximo();
        editor.clearEditor();
        carregarDesafio();
    }

    function desafioAnterior() {
        desafios.anterior();
        carregarDesafio();
    }

    return {
        carregarDesafio,
        executar,
        proximoDesafio,
        desafioAnterior
    };
}