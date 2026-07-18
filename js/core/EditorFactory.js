export function EditorFactory() {

    let editor = null;
    let autocompleteEnabled = true;
    let clearEditorEnabled = false;
    let palavrasAutoComplete = [];

    function addToAutoComplete(list) {
        palavrasAutoComplete = Array.from(
            new Set([...palavrasAutoComplete, ...list])
        );
    }

    function create(elementId, {
        theme = "railscasts",
        value = ""
    } = {}) {
        editor = CodeMirror(document.getElementById(elementId), {
            mode: "javascript",
            theme,
            readOnly: false,
            lineNumbers: true,
            tabSize: 2,
            indentUnit: 2,
            smartIndent: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            autofocus: true,
            styleActiveLine: true,
            javascriptHint: true,
            showHint: true,
            extraKeys: {
                'Ctrl-Space': 'autocomplete'
            },
            value
        });
        editor.getWrapperElement().id = "codeMirrorEditor";

        editor.on('inputRead', function (cm, change) {
            if (!autocompleteEnabled) return;
            if (
                change.text[0] === '.' ||
                /[a-zA-Z_]/.test(change.text[0])
            ) {
                cm.showHint({
                    hint: hintEducacional,
                    completeSingle: false
                });
            }
        });

        return editor;
    }

    function hintEducacional(cm) {
        const cursor = cm.getCursor();
        const token = cm.getTokenAt(cursor);

        const inicio = token.start;
        const fim = cursor.ch;
        const palavraAtual = token.string;

        const sugestoes = palavrasAutoComplete
            .filter(p => p.startsWith(palavraAtual))
            .map(p => ({
                text: p,
                displayText: p
            }));

        return {
            list: sugestoes,
            from: CodeMirror.Pos(cursor.line, inicio),
            to: CodeMirror.Pos(cursor.line, fim)
        };
    }

    function getValue() {
        return editor.getValue();
    }

    function setValue(value) {
        editor.setValue(value);
    }

    function toggleTheme() {
        const current = editor.getOption("theme");
        editor.setOption("theme", current === "default" ? "railscasts" : "default");
    }

    function limparDestaques() {
        editor.eachLine(line => {
            editor.removeLineClass(line, "background", "linha-erro");
        });
    }

    function destacarLinha(linha) {
        limparDestaques();
        editor.addLineClass(linha - 1, "background", "linha-erro");
        editor.scrollIntoView({ line: linha - 1, ch: 0 }, 100);
    }

    function animarExecucaoCodeMirror(velocidade = 40) {
        const totalLinhas = editor.lineCount();
        let linhaAtual = 0;

        // Remove Cursor
        const estadoOriginal = editor.getOption("styleActiveLine");
        editor.setOption("styleActiveLine", false);
        setTimeout(() => {
            editor.setOption("styleActiveLine", estadoOriginal);
        }, totalLinhas * velocidade);
        

        // limpa qualquer execução anterior
        for (let i = 0; i < totalLinhas; i++) {
            const handle = editor.getLineHandle(i);
            editor.removeLineClass(handle, "background", "executing-line");
        }

        function executarLinha() {
            if (linhaAtual > 0) {
                const linhaAnterior = editor.getLineHandle(linhaAtual - 1);
                editor.removeLineClass(linhaAnterior, "background", "executing-line");
            }

            if (linhaAtual < totalLinhas) {
                const linha = editor.getLineHandle(linhaAtual);
                editor.addLineClass(linha, "background", "executing-line");

                linhaAtual++;
                setTimeout(executarLinha, velocidade);
            }
        }

        executarLinha();
    }


    function setFontSize(size) {
        editor.getWrapperElement().style.fontSize = size + 'px';
    }

    function setAutocomplete(enabled) {

        autocompleteEnabled = enabled;

        editor.setOption('extraKeys', enabled ? {
            'Ctrl-Space': 'autocomplete'
        } : {});
    }

    function setClearEditor(clear) {
        clearEditorEnabled = clear;
    }

    function clearEditor() {
        if (!clearEditorEnabled) return;

        editor.setValue("")
    }

    function setHighlightLine(enabled) {
        editor.setOption('styleActiveLine', enabled);
    }

    function setTheme(theme) {
        editor.setOption("theme", theme);
    }

    function refresh() {
        editor.refresh();
    }

    create("editor", {
        value: "// Bem-vindo!\n"
    });

    return {
        create,
        addToAutoComplete,
        getValue,
        setValue,
        toggleTheme,
        destacarLinha,
        limparDestaques,
        setTheme,
        setFontSize,
        setAutocomplete,
        setHighlightLine,
        setClearEditor,
        clearEditor,
        animarExecucaoCodeMirror,
        refresh,
    };
}
