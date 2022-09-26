import dic from "../../data.json";

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

function find(
  length: number,
  {
    start,
    end,
    has,
    hasNot,
  }: { start: string; end: string; has: string[]; hasNot: string[] }
): (word: string) => boolean {
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
  };
}

function wordHasNot(word: string, ...str: string[]) {
  for (const letter of str) {
    if (word.includes(letter)) {
      return false;
    }
  }
  return true;
}

export function guessWord(
  size: number,
  startWith: string,
  endWith: string,
  has: string[],
  hasNot: string[]
) {
  return dic.filter(
    find(size, { start: startWith, end: endWith, has, hasNot })
  );
}
