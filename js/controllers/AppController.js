import { ErrorTranslator } from "../core/ErrorTranslator.js";

export function AppController(editor, desafios, HomeModuloDesafios, feedback, output, codeRunner) {

    const errorTranslator = ErrorTranslator();
    const btnExecutar = document.getElementById("btn-executar");
    let executando = false;

    function carregarDesafio() {
        HomeModuloDesafios.LoadEditorPageDesafio();
        output.clear();
    }

    function setExecutando(valor) {
        executando = valor;
        btnExecutar.disabled = valor;
        btnExecutar.textContent = valor ? "⏳ Executando..." : "▶ Executar";
    }

    async function executar() {
        // Evita várias execuções ao mesmo tempo (ex.: Ctrl+Enter repetido)
        if (executando) return;
        setExecutando(true);

        const code = editor.getValue();
        editor.limparDestaques();
        editor.animarExecucaoCodeMirror();
        output.clear();

        try {
            // Executa e valida numa única passada, fora da página
            const resultado = await codeRunner.executar(
                code,
                desafios.getIndexModulo(),
                desafios.getIndexDesafio()
            );

            if (resultado.timeout) {
                mostrarTimeout();
                return;
            }

            if (resultado.falhaInterna) {
                output.set(`⚠️ Não foi possível executar o código.\n${resultado.falhaInterna}`);
                feedback.show("Erro interno ao executar o código.", "error");
                return;
            }

            mostrarSaida(resultado);
            mostrarValidacao(resultado.validacao);
        } finally {
            setExecutando(false);
        }
    }

    function mostrarTimeout() {
        const segundos = codeRunner.tempoLimite / 1000;
        output.set(
            `⏱️ Seu código passou de ${segundos} segundos e foi interrompido.\n\n` +
            `💡 Dica: isso normalmente é um loop infinito.\n` +
            `Confira se a condição do while/for fica falsa em algum momento\n` +
            `e se a variável de controle está sendo alterada (ex.: i++).`
        );
        feedback.show("Código interrompido: possível loop infinito.", "error");
    }

    function mostrarSaida({ consoleOutput, erro }) {
        if (!erro) {
            output.set(consoleOutput || "Código sem erros. Console sem mensagens.\nuse console.log() para exibir mensagens aqui :)");
            return;
        }

        const mensagemAmigavel = errorTranslator.traduzir(erro);
        if (erro.linha) editor.destacarLinha(erro.linha);

        // Mostra o que foi impresso ANTES do erro: ajuda a achar onde parou
        const saidaAnterior = consoleOutput ? `${consoleOutput}\n\n` : "";

        output.set(
            `${saidaAnterior}` +
            `❌ Erro na linha ${erro.linha ?? "desconhecida"}\n${mensagemAmigavel.text}\n\n` +
            `Detalhe técnico:\n${erro.name}: ${erro.message}`
        );

        if (!desafios.isTypeError() && mensagemAmigavel.hint) {
            output.append(`\n💡 Dica: ${mensagemAmigavel.hint}`);
        }
    }

    function mostrarValidacao(valido) {
        if (valido.ok) {
            desafios.DesbloquearProximo();
            editor.addToAutoComplete(desafios.getDadosUnlock());
            HomeModuloDesafios.atualizar(); // progresso da Home e selo "Concluído"
            feedback.show("Parabéns! Você completou o desafio.", "success");

            if (desafios.isTypeError()) {
                output.append(`\nDesafio concluido: ${valido.message ?? ""}`);
            }
        } else {
            feedback.show("Desafio não foi completo. Tente novamente.", "error");
            output.append(`\nDesafio não concluído. ${valido.message || "Revise as instruções e tente novamente."}`);
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
        carregarDesafio(); // o código do editor é trocado em LoadEditorPageDesafio
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
