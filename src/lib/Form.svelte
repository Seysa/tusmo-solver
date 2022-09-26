<script lang="ts">
  import { guessWord } from "../utils/dictionnary";
  import LetterForm from "./LetterForm.svelte";

  let size = 0;
  let start = "";
  let end = "";
  let has = [] as string[];
  let hasNot = [] as string[];
  let results = [] as string[];

  let error = "";

  type LetterFormEvent = CustomEvent<string[]>;

  const getLettersInWord = (event: LetterFormEvent) => {
    has = event.detail;
    console.log("got has", event.detail, ", now is", has);
  };

  const getLettersNotInWord = (event: LetterFormEvent) => {
    hasNot = event.detail;
  };

  let timeout;
  const submit = () => {
    error = "";
    results = guessWord(size, start, end, has, hasNot);
    if (results.length === 0) {
      clearTimeout(timeout);
      error = "Aucun mot n'a été trouvé";
      timeout = setTimeout(() => {
        error = "";
      }, 2000);
    }
  };

  $: impossible = (() => {
    for (const el of has) {
      if (hasNot.includes(el)) {
        return true;
      }
    }
    return false;
  })();
</script>

<form on:submit|preventDefault={submit}>
  <section>
    <h2 for="size">Entrez la longueur du mot à deviner</h2>
    <input id="size" bind:value={size} type="number" minlength="0" step="1" />
  </section>
  <section>
    <h2 for="start">Entrez le début du mot</h2>
    <input id="start" bind:value={start} type="text" />
  </section>
  <section>
    <h2 for="end">Entrez la fin du mot</h2>
    <input id="end" bind:value={end} type="text" />
  </section>
  <section />
  <section>
    <h2>Entrez les lettres qui <b>sont</b> dans le mot</h2>
    <LetterForm on:letters={getLettersInWord} />
  </section>
  <section>
    <h2>Entrez les lettres qui <b>ne sont pas</b> dans le mot</h2>
    <LetterForm on:letters={getLettersNotInWord} />
  </section>
  <button type="submit">Trouver le mot</button>
  {#if error}
    <h2 style="color: red; text-align: center;">
      {error}
    </h2>
  {/if}
  {#if results.length}
    <section id="results">
      <h3>Il y a {results.length} mots possibles</h3>
      <ul>
        {#each results as result}
          <li>{result}</li>
        {/each}
      </ul>
    </section>
  {/if}
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  b {
    text-decoration: underline;
  }

  button[type="submit"] {
    background-color: orangered;
  }
</style>
