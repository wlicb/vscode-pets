import * as vscode from 'vscode';


let currentDecoration: vscode.TextEditorDecorationType | undefined;

let decoratedRanges: { uri: vscode.Uri, range: vscode.Range }[] = [];

export function setCodeLineColor(reset: boolean) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        if (!reset) {
            // add code
            const selection = editor.selection;
            const range = new vscode.Range(selection.start, selection.end);
            decoratedRanges = mergeRanges([...decoratedRanges, { uri: editor.document.uri, range }]);
            highlightLines(editor);
        } else {
            // remove code
            const selection = editor.selection;
            const rangeToRemove = new vscode.Range(selection.start, selection.end);
            decoratedRanges = decoratedRanges.flatMap(decorated => {
                if (decorated.uri.fsPath === editor.document.uri.fsPath) {
                    const intersection = decorated.range.intersection(rangeToRemove);
                    if (intersection) {
                        const newRanges = [];
                        if (decorated.range.start.isBefore(rangeToRemove.start)) {
                            newRanges.push({ uri: decorated.uri, range: new vscode.Range(decorated.range.start, rangeToRemove.start) });
                        }
                        if (decorated.range.end.isAfter(rangeToRemove.end)) {
                            newRanges.push({ uri: decorated.uri, range: new vscode.Range(rangeToRemove.end, decorated.range.end) });
                        }
                        return newRanges;
                    }
                    return [decorated];
                }
                return [decorated];
            });
            highlightLines(editor);

        }
    }
}

function mergeRanges(ranges: { uri: vscode.Uri, range: vscode.Range }[]): { uri: vscode.Uri, range: vscode.Range }[] {
    if (ranges.length === 0) {
        return [];
    }

    // Sort ranges by start position
    ranges.sort((a, b) => {
        if (a.uri.fsPath < b.uri.fsPath) {return -1;}
        if (a.uri.fsPath > b.uri.fsPath) {return 1;}
        if (a.range.start.isBefore(b.range.start)) {return -1;}
        if (a.range.start.isAfter(b.range.start)) {return 1;}
        return 0;
    });

    const merged: { uri: vscode.Uri, range: vscode.Range }[] = [];
    let current = ranges[0];

    for (let i = 1; i < ranges.length; i++) {
        const next = ranges[i];

        if (current.uri.fsPath === next.uri.fsPath && current.range.end.isAfterOrEqual(next.range.start)) {
            current.range = new vscode.Range(current.range.start, current.range.end.isAfter(next.range.end) ? current.range.end : next.range.end);
        } else {
            merged.push(current);
            current = next;
        }
    }

    merged.push(current);
    return merged;
}

export function formulateCodeString() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const linesByFile: { [key: string]: { startLine: number, endLine: number, content: string }[] } = {};

        decoratedRanges.forEach(decorated => {
            const { uri, range } = decorated;
            const startLine = range.start.line;
            const endLine = range.end.line;
            const content = editor.document.getText(range);

            if (!linesByFile[uri.fsPath]) {
                linesByFile[uri.fsPath] = [];
            }

            linesByFile[uri.fsPath].push({
                startLine: startLine + 1,
                endLine: endLine + 1,
                content
            });
        });

        let result = "";
        for (const file in linesByFile) {
            result += `From ${file}:\n`;
            linesByFile[file].forEach(lineInfo => {
                result += `Line ${lineInfo.startLine}-${lineInfo.endLine}:\n`;
                result += `${lineInfo.content}\n`;
            });
        }
        console.log(result);
        return result;
    } else {
        return "";
    }
}

export function clearSelection() {
    decoratedRanges = [];

    vscode.window.visibleTextEditors.forEach(editor => {
        if (currentDecoration) {
            editor.setDecorations(currentDecoration, []);
        }
    });

    if (currentDecoration) {
        currentDecoration.dispose();
        currentDecoration = undefined;
    }
}

function highlightLines(editor: vscode.TextEditor) {
    if (editor) {
        if (currentDecoration) {
            editor.setDecorations(currentDecoration, []);
            currentDecoration.dispose();
        }
        currentDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 165, 0, 0.3)'
        });
        const rangesToDecorate = decoratedRanges
            .filter(decorated => decorated.uri.fsPath === editor.document.uri.fsPath)
            .map(decorated => decorated.range);
        editor.setDecorations(currentDecoration, rangesToDecorate);
    }
}


vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
        highlightLines(editor);
    }
});


vscode.workspace.onDidDeleteFiles(event => {
    formulateCodeString();
    event.files.forEach(uri => {
        decoratedRanges = decoratedRanges.filter(decorated => decorated.uri.fsPath !== uri.fsPath);
    });
});