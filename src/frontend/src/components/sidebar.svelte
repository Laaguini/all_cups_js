<script lang="ts">
    import { theme, changeTheme } from "../stores/theme";
	import { foldersList, setFolder, folder as currentFolder } from "../stores/folders";
    import { setLetter } from "../stores/letters";
    import Icon from "./Icon.svelte"
    import { Add, Theme } from "../assets/icons";
    import { errNotImplemented } from "../stores/utils.ts"
    import { breakpoint } from "../stores/document";
    import { Write } from "../assets/icons";
</script>

<div class="sidebar">
    <div>
        <button class="new-letter-btn" class:square={$breakpoint === "sm"} on:click={errNotImplemented}> 
            {#if $breakpoint == "sm"}
                <Icon src={Write} />
            {:else} 
                Написать письмо
            {/if}
        </button>
        <div>
            {#each $foldersList as folder, i}
                <button class="folder-btn" class:active={folder === $currentFolder} class:square={$breakpoint === "sm"} on:click={() => {setFolder(i); setLetter(null)}}> 
                    <Icon src={folder.icon} />
                    {#if $breakpoint !== "sm"}
                        {folder.name}
                    {/if}
                </button>
            {/each}
        </div>
        {#if $breakpoint !== "sm"}
            <div class="divider" />
            <button class="new-folder-btn" on:click={errNotImplemented}>
                <Icon src={Add} />
                Новая папка
            </button>
        {/if}
    </div>
    <button class="change-theme-btn" on:click={changeTheme} class:square={$breakpoint === "sm"}>
        <Icon src={Theme} />
        {#if $breakpoint !== "sm"}
            Тема: { $theme == "light"? "светлая" : "темная" }
        {/if}
    </button>
</div>

<style>
    .sidebar {
        width: fit-content;
        padding: 0.75rem 1rem;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
        display: flex;
    }
    .sidebar button {
        width: 200px;
        border-radius: var(--radius-md);
        padding: 0.5rem 0.75rem;
        display: flex;
        align-items: center;
        height: 2.25rem;
    }

    .folder-btn, .change-theme-btn {
        gap: 0.5rem;
        transition: none;
        color: var(--text-main);
    }

    .folder-btn:hover, .change-theme-btn:hover {
        background-color: var(--ui-hover-bg);
    }

    .folder-btn.active {
        background-color: var(--ui-active-bg);
        font-weight: 700;
    }

    .new-letter-btn {
        background-color: var(--ui-accent-bg);
        border: 1px solid var(--border-color);
        justify-content: center;
        font-weight: 700;
        margin-bottom: 0.75rem;
        color: #333333;
    }

    .sidebar button.square {
        aspect-ratio: 1;
        width: 2.25rem;
        height: 2.25rem;
        justify-content: center;
        padding: 0;
    }

    .divider {
        background-color: var(--border-color);
        height: 1px;
        width: 100%;
        margin: 0.5rem 0;
    }

    .new-folder-btn {
        color: var(--text-secondary);
        gap: 0.75rem;
        font-family: var(--font-button);
        font-weight: 500;
    }
</style>