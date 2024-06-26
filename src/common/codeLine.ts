import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


const lineCounts: { [file: string]: number } = {};

function getCppFiles(dir: string): string[] {
    const cppFiles: string[] = [];
    
    function readDirRecursively(currentDir: string) {
        const files = fs.readdirSync(currentDir);

        files.forEach(file => {
            const filePath = path.join(currentDir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                readDirRecursively(filePath);
            } else if (filePath.endsWith('.cpp') || filePath.endsWith('.h')) {
                cppFiles.push(filePath);
            }
        });
    }

    readDirRecursively(dir);
    return cppFiles;
}

function countLinesInFiles(files: string[]) {

    files.forEach(file => {
        const fileContent = fs.readFileSync(file, 'utf-8');
        const lines = fileContent.split('\n').length;
        lineCounts[file] = lines;
    });
}

function countLinesInEditor() {
    const editor = vscode.window.activeTextEditor;
        
    if (editor) {
        const document = editor.document;
        const fileName = document.fileName;
        if (lineCounts[fileName]) {
            const lineCount = document.lineCount;
            //console.log(lineCount);
            //if (lineCount > lineCounts[fileName]) {
            lineCounts[fileName] = lineCount;
            //}
        }
    }
}


function sumLineCounts(lineCounts: { [key: string]: number }): number {
    return Object.values(lineCounts).reduce((sum, count) => sum + count, 0);
}

function countCodeLine() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            const dirPath = workspaceFolders[0].uri.fsPath;
            const cppFiles = getCppFiles(dirPath);
            countLinesInFiles(cppFiles);
            countLinesInEditor();
            const totalLines = sumLineCounts(lineCounts);
            return totalLines;
        } else {
            return -1;
        }
}


let currentLineCount = countCodeLine();

export function updateCount() {
    const lineCount = countCodeLine();
    const diff = lineCount - currentLineCount;
    currentLineCount = lineCount;
    if (diff > 0) {
        return diff;
    } else {
        return 0;
    }
}

export function getEditorText() {
    const editor = vscode.window.activeTextEditor;
    return editor?.document.getText();
}