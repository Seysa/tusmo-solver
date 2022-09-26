<script lang="ts">
  import { createEventDispatcher } from "svelte";

  let currentLetter = "";
  let letters: string[] = [];

  // event name : type of dispatch value
  const dispatch = createEventDispatcher<{ letters: string[] }>();

  const isLetter = (letter: string) => !!letter.match(/[a-z]/i);

  const addLetter = () => {
    const letterToLowerCase = currentLetter.toLowerCase();

    if (isLetter(letterToLowerCase) && !letters.includes(letterToLowerCase)) {
      letters = [...letters, letterToLowerCase];
    }
  };

  const sendLetters = () => dispatch("letters", letters);

  const submitLetter = () => {
    addLetter();
    currentLetter = "";
    sendLetters();
  };

  const resetLetters = () => {
    letters = [];
    sendLetters();
  };
</script>

<form on:submit|preventDefault={submitLetter}>
  <label for="letter">Entrez une lettre</label>
  <input id="letter" bind:value={currentLetter} type="text" maxlength="1" />
  <button type="submit">Ajouter la lettre</button>
  <ul>
    {#each letters as letter}
      <li>{letter}</li>
    {/each}
  </ul>
  <button on:click|preventDefault={resetLetters}>Effacer les lettres</button>
</form>

<style>
  ul {
    all: unset;
    display: flex;
    gap: 8px;
  }

  li {
    all: unset;
  }
</style>
