<script lang="ts">
    import { fly } from "svelte/transition"
    import { letter, setLetter } from "../stores/letters"
    import { breakpoint } from "../stores/document"
    import { Logo, ShortLogo, ChevronLeft } from "../assets/icons"
    import Icon from "./Icon.svelte"
</script>

<header>
    {#await $letter}
    {:then letter}
        {#if letter}
            <button class="header-back-button" in:fly={{ duration: 300 }} on:click={() => setLetter(null)}>
                <Icon src={ChevronLeft} />
                Вернуться
            </button>
        {:else}
            <Icon size="raw" src={$breakpoint === "sm"? ShortLogo : Logo} />
        {/if}
    {/await}
</header>

<style>
    header {
        height: 3.5rem;
        padding: 0 0.75rem 0 1rem;
        background-color: var(--ui-bg);
        box-shadow: var(--navbar-shadow);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    button {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-family: var(--font-button);
        font-weight: 500;
        font-size: var(--text-md);
        transition: color ease-out .1s;
        color: var(--text-main);
    }

    button:hover {
        color: var(--text-secondary)
    }
</style>