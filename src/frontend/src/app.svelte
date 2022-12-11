<script lang="ts">
	import { title, pageWidth } from "./stores/document"
	import { theme, setTheme } from "./stores/theme"; 
  	import { letter, setLetter } from "./stores/letters";
	import Header from "./components/header.svelte"
	import Sidebar from "./components/sidebar.svelte"
	import Letters from "./components/letters.svelte"
	import Letter from "./components/letter.svelte"

	$: document.body.className = `theme-${$theme}`
	$: $title.then(t => document.title = t)
</script>

<svelte:window on:resize={() => pageWidth.set(window.innerWidth)} />

<div class="wrapper">
	<Header />
	<main>
		<Sidebar />
		<div class="content-wrapper">
			<div class="content">
				{#await $letter}
				{:then letter}
					{#if letter}
						<Letter />
					{:else}
						<Letters />
					{/if}
				{/await}
			</div>
		</div>
	</main>
</div>

<style>
	.wrapper {
		height: 100vh;
		overflow: hidden;
		display: grid;
		grid-template-rows: fit-content(3.5rem) 1fr;
	}
	main {
		display: grid;
		grid-template-columns: fit-content(300px) 1fr;
		height: 100%;
		overflow: hidden;
	}

	.content {
        border-radius: var(--radius-lg);
        background-color: var(--ui-bg);
        display: flex;
        flex-direction: column;
        margin: 0.75rem;
        margin-left: 0;
    }

	.content-wrapper {
		overflow-y: auto;
	}
</style>