import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let terminal: vscode.Terminal | undefined;

export async function doCompile() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        if (document.languageId === 'cpp') {
            const filePath = document.fileName;
            const result = await runCompilationTask(filePath);
            createTerminalAndCompile(filePath);
            if (result !== 0) {
                const errorMessage = readErrorMessage();
                return errorMessage;
            } else {
                return "";
            }
        } else {
            console.log("Not C++ file");
            return "";
        }
    } else {
        console.log("No active editor");
        return "";
    }
}


function createTerminalAndCompile(filePath: string) {
    if (!terminal || terminal.exitStatus) {
        terminal = vscode.window.createTerminal('Compilation Terminal');
    }
    terminal.show();
    terminal.sendText(`g++ -o output ${filePath}`);
}

async function runCompilationTask(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const task = new vscode.Task(
            { type: 'shell',
                "presentation": {
                    "reveal": "silent",
                    "close": true
                }
            },
            vscode.TaskScope.Workspace,
            'Compile',
            'shell',
            new vscode.ShellExecution(`g++ -o output ${filePath} > compilationResult.txt 2>&1 `),
            //  + "&& ${command:workbench.action.togglePanel}"
            ['$cpp-compile-errors']
        );


        // Hide the terminal
        task.presentationOptions = {
            reveal: vscode.TaskRevealKind.Silent,
            echo: true,
            focus: false,
            panel: vscode.TaskPanelKind.Dedicated,
            showReuseMessage: false,
            clear: true,
        };

        const disposable = vscode.tasks.onDidEndTaskProcess((e) => {
            if (e.execution.task.name === 'Compile') {
                disposable.dispose();  // Clean up the event listener
                if (e.exitCode === 0) {
                    resolve(0);
                } else {
                    resolve(1);
                }
            }
        });

        vscode.tasks.executeTask(task).then(undefined, reject);
    });
}

export function readErrorMessage() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            const dirPath = workspaceFolders[0].uri.fsPath;
            const filePath = path.join(dirPath, 'compilationResult.txt');

            try {
                const data = fs.readFileSync(filePath, 'utf8');
                console.log(`File content: ${data}`);
                return data;
            } catch (error) {
                console.error(`Error reading file: ${error}`);
                return "";
            }
        } else {
            console.log('No folder or workspace opened');
            return "";
        }
}