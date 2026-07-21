import { ErrorTranslator } from "../core/ErrorTranslator.js";

export function AppController(editor, desafios, HomeModuloDesafios, feedback, output) {

    const errorTranslator = ErrorTranslator();

    function carregarDesafio() {
        HomeModuloDesafios.LoadEditorPageDesafio();
        output.clear();
    }

    function extrairLinhaColuna(erro) {
        const stack = erro.stack ?? "";

        const patterns = [
            /Function:(\d+)/,                  // Firefox
            /<anonymous>:(\d+):(\d+)/          // Chrome/Edge
        ];

        for (const pattern of patterns) {
            const match = stack.match(pattern);
            if (match) {
                return {
                    linha: Number(match[1]) - 2,
                    coluna: match[2] ? Number(match[2]) : null
                };
            }
        }

        return null;
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
            
            if (valido.ok) {
                desafios.DesbloquearProximo();
                editor.addToAutoComplete(desafios.getDadosUnlock());
                feedback.show("Parabéns! Você completou o desafio.", "success");

                if (desafios.isTypeError()){
                    output.append(`\nDesafio concluido: ${valido.message}`)
                }
            } else {
                feedback.show("Desafio não foi completo. Tente novamente.", "error");
                output.append(`\nDesafio não concluído. ${valido.message || "Revise as instruções e tente novamente."}`);
            }

        } catch (e) {
            feedback.show("Erro na validação: " + e.message, "error");
        }
    }

    function proximoDesafio() {

        if (!desafios.proximoDesafioLivre()) {
            feedback.show(
                `Complete o desafio ${desafios.getIndexDesafio() + 1} antes de continuar`,
                "error"
            );
            return;
        }

        if (desafios.isUltimo()) {
            feedback.show("Você completou todos os desafios deste módulo!", "success");
            return;
        }

        desafios.proximoDesafio();
        editor.clearEditor();
        carregarDesafio();
    }

    function desafioAnterior() {
        desafios.anteriorDesafio();
        carregarDesafio();
    }

    return {
        carregarDesafio,
        executar,
        proximoDesafio,
        desafioAnterior
    };
}