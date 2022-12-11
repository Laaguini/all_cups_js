<script lang="ts">
    import "dayjs/locale/ru"; 
    import dayjs from "dayjs";
    import { fly } from "svelte/transition"
    import { lettersList, setLetter } from "../stores/letters"
    import Icon from "./icon.svelte";
    import { Attach, BookmarkFilled, BookmarkOutlined, User, Exclamation } from "../assets/icons"
</script>

{#await $lettersList}
{:then letters}
    <div in:fly={{ duration: 300, y: 30 }} class="letters">
        {#each letters as letter, i (i)} 
        {@const letterDate = dayjs(letter.date)}
        {@const active = !letter.read}
            <button class="letter" on:click={() => setLetter(i)}>
                <div class="letter-read-indicator" class:active={active}></div>
                {#if letter.author.avatar}
                    <img width="32" height="32" class="letter-author-avatar" src={letter.author.avatar} alt="#">
                {:else} 
                    <div class="letter-author-avatar mock">
                        <Icon src={User} size="raw" />
                    </div>
                {/if}
                <div class="letter-author-name" class:active={active}>{letter.author.name} {letter.author.surname}</div>
                <div class="letter-bookmark" class:filled={letter.bookmark || letter.important}>
                    <Icon src={letter.important? Exclamation : letter.bookmark? BookmarkFilled : BookmarkOutlined} />
                </div>
                <div class="letter-content-preview">
                    <span class="letter-title" class:active={active}>{ letter.title }</span> 
                    { letter.text.slice(0, 160) }
                </div>
                <div>
                    {#if letter.doc}
                        <div style="color: var(--text-main)">
                            <Icon src={Attach} />
                        </div>
                    {/if}
                </div>
                <div class="letter-date">
                    {#if dayjs().diff(letterDate, 'days') == 0}
                        { dayjs().format('HH:MM') }
                    {:else}
                        { letterDate.locale('ru').format('D MMM') }
                    {/if}
                </div>
            </button>
        {/each}
    </div>
{/await}

<style>
    .letter {
        border-radius: var(--radius-lg);
        overflow: hidden;
        display: grid;
        grid-template-columns: 6px 32px 160px 32px 1fr fit-content(50px) 64px;
        gap: 0.75rem;
        padding: 0 0.75rem;
        height: 3rem;
        width: 100%;
        transition: background-color .2s ease;
        align-items: center;
        text-decoration: none;
        position: relative;
    }

    .letter::after {
        position: absolute;
        bottom: 0;
        height: 1px;
        background-color: var(--border-color);
        width: calc(100% - 86px);
        left: 74px;
        content: "";
        display: block;
    }

    .letter:hover {
        background-color: var(--ui-hover-bg);
    }

    .letter-author-avatar {
        width: 32px;
        height: 32px; 
        border-radius: 16px;
        background-color: var(--text-tertiary);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    :global(.letter-author-avatar.mock svg) {
        height: 1rem;
        width: 1rem;
        color: var(--text-main)
    }

    .letter-read-indicator {
        height: 6px;
        width: 6px;
        border-radius: 3px;
        background-color: transparent;
        transition: none;
    }

    .letter:hover .letter-read-indicator:not(.active) {
        background-color: var(--indicator-off);
    }

    .letter-read-indicator.active {
        background-color: var(--indicator-on);
    }

    .letter-author-name {
        color: var(--text-main);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
    }

    .letter-content-preview {
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        color: var(--text-secondary);
        text-align: left;
    }

    .letter-title {
        color: var(--text-main)
    }

    .letter-title.active, .letter-author-name.active {
        font-weight: 700;
    }

    .letter-text {
        color: var(--text-secondary);
    }

    .letter-date {
        color: var(--text-secondary);
        font-size: var(--text-sm);
        text-align: right;
    }

    .letter-bookmark {
        color: transparent;
    }

    .letter:hover .letter-bookmark:not(.filled) {
        color: var(--indicator-off);
    }

    .letter-bookmark.filled {
        color: var(--bookmark-filled)
    }
</style>