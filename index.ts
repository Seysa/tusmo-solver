import fs from "fs";

const file: string[] = fs.readFileSync("dictionnaire.txt", 'utf-8').split("\n");

function wordHas(word: string, ...str: string[]) {
    function removeIndexFromWord(index: number) {
        return word.slice(0, index) + word.slice(index + 1);
    }
    for (const letter of str) {
        const index = word.indexOf(letter);
        if (index === -1) {
            return false;
        }
        word = removeIndexFromWord(index);
    }
    return true;
}

function find(length: number, { start, end, has, hasNot }: { start: string, end: string, has: string[], hasNot: string[] }): (word: string) => boolean {
    return (word: string) => {
        if (word.length !== length) {
            return false;
        }
        if (start && !word.startsWith(start)) {
            return false;
        }
        // remove startWith from word
        if (start) {
            word = word.slice(start.length, word.length);
        }
        if (end && !word.endsWith(end)) {
            return false;
        }
        if (end) {
            word = word.slice(0, word.length - end.length);
        }
        if (has && !wordHas(word, ...has)) {
            return false;
        }
        if (hasNot && !wordHasNot(word, ...hasNot)) {
            return false;
        }
        return true;
    }
}

function wordHasNot(word: string, ...str: string[]) {
    for (const letter of str) {
        if (word.includes(letter)) {
            return false;
        }
    }
    return true;
}

import prompter from "prompt-sync";
const prompt = prompter({ sigint: true });

function promptUntil(promptMessage: string, validator: (word: string) => boolean): string {
    let input = "";
    while (!validator(input)) {
        input = prompt(promptMessage).trim().toLowerCase();
    }
    return input;
}

const inputSize = +promptUntil("Taille du mot: ", (input) => {
    if (!input) {
        return false;
    }
    if (isNaN(+input)) {
        console.log("La taille entrée n'est pas un nombre");
        return false;
    }
    return true;
});

const startWith = prompt("Le mot commence par: ");

let endWith = prompt("Le mot finis par: ");
let has = (() => {
    const input = prompt("Le mot contient les lettres suivantes (séparer par des espaces): ");
    if (!input) {
        return [];
    }
    return input.split(/ +/);
})();
let hasNot = (() => {
    const input = prompt("Le mot ne contient pas les lettres suivantes (séparer par des espaces): ");
    if (!input) {
        return [];
    }
    return input.split(/ +/);
})();

const guess = file.filter(find(inputSize, { start: startWith, end: endWith, has: has, hasNot: hasNot }));
console.log("Le mot pourrait être:");
console.log(guess);
console.log("Il y a " + guess.length + " mots possibles");