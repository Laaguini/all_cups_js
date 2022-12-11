<script lang="ts">
    import { fly } from "svelte/transition"
    import { folder } from "../stores/folders";
    import { letter, letterIndex } from "../stores/letters"
    import Icon from "./icon.svelte";
    import { BookmarkFilled, Exclamation, User } from "../assets/icons";
    import dayjs from "dayjs"
    import "dayjs/locale/ru"
</script>

{#await $letter}
{:then letter} 
    {@const letterDate = dayjs(letter.date)}
    {@const diff = dayjs().diff(letterDate, 'days')}
    {@const imageSize = Math.round(letter?.doc?.img?.length / 1366)}

    <div in:fly={{ duration: 300, y: 20 }}>
        <h2 class="letter-title">{ letter.title }</h2>
        <div class="letter-info-wrapper">
            <div class="letter-read-indicator" class:active={!letter.read}></div>
            {#if letter.author.avatar}
                <img loading="lazy" width="32" height="32" class="letter-author-avatar" src={letter.author.avatar} alt="#">
            {:else} 
                <div class="letter-author-avatar mock">
                    <Icon src={User} size="raw" />
                </div>
            {/if}
            <div class="letter-info">
                <div class="letter-info-top">
                    <span class="letter-author-name">{letter.author.name} {letter.author.surname}</span>
                    <span class="letter-date">
                        { diff == 0? 'Сегодня' : diff == 1? 'Вчера' : letterDate.locale('ru').format('D MMMM') },
                        { letterDate.format('HH:MM') }
                    </span>
                    {#if letter.important}
                        <div style="color: var(--bookmark-filled); transform: translateY(2px)"><Icon src={Exclamation} size="sm"/></div>
                    {/if}
                    {#if letter.bookmark}
                        <div style="color: var(--bookmark-filled); transform: translateY(2px)"><Icon src={BookmarkFilled} size="sm"/></div>
                    {/if}
                </div>
                <div class="letter-info-bottom">
                    { ++letter.to.length } {`получател${['ь', 'я', 'я', 'я'][letter.to.length - 1] ?? 'ей'}`}: Вы, { letter.to.slice(0, 3).map(e => e.name+' '+e.surname).join(', ') }
                    { letter.to.length > 4 && `и ещё ${letter.to.length - 4} получател${['ь', 'я', 'я', 'я'][letter.to.length - 5] ?? 'ей'}` || ''}
                </div>
            </div>
        </div>

        {#if letter?.doc?.img}
            <div class="letter-doc-container">
                <div class="letter-doc-list">
                    <img class="letter-image" src={letter.doc.img} />
                </div>
                <div class="letter-doc-controls">
                    <span class="letter-doc-count">1 файл</span>
                    <a class="letter-doc-link" href={letter.doc.img} download={`${$folder.slug}_${$letterIndex}_${1}.png`}>
                        <span>Скачать все файлы</span>
                        <span class="letter-doc-total">({imageSize > 1000? `${(imageSize / 1000).toFixed(2)}mb` : `${imageSize}kb`})</span>
                    </a>
                </div>
            </div>
        {/if}

        {#if letter?.text}
            <div class="letter-text">
                {@html letter.text.replace(/\\n/g, '<br />')}
            </div>
        {/if}
    </div>
{/await}

<style>
    .letter-title {
        font-size: var(--text-lg);
        font-weight: 700;
        color: var(--text-main);
        margin: 1rem 2rem;
    }
    .letter-info-wrapper {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
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

    .letter-read-indicator {
        height: 6px;
        width: 6px;
        border-radius: 3px;
        background-color: transparent;
        transition: none;
    }

    .letter-read-indicator.active {
        background-color: var(--indicator-on)
    }
    
    .letter-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 0.25rem;
    }

    .letter-info-top {
        display: flex;
        gap: 0.5rem;
        align-items: end;
    }

    .letter-author-name {
        color: var(--text-main)
    }

    .letter-date {
        color: var(--text-secondary);
        font-size: var(--text-sm);
    }

    .letter-info-bottom {
        color: var(--text-secondary);
        font-size: var(--text-sm);
    }

    .letter-image {
        height: 190px;
        width: 256px;
        border-radius: var(--radius-lg);
    }

    .letter-doc-container {
        padding: 0.75rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .letter-doc-controls {
        font-size: var(--text-sm);
        display: flex;
        gap: 1rem;
    }

    .letter-doc-count {
        color: var(--text-main)
    }

    .letter-doc-link {
        color: var(--text-link);
        text-decoration: none;
    }

    .letter-doc-total {
        color: var(--text-secondary)
    }

    .letter-text {
        font-family: var(--font-plaintext);
        color: var(--text-main);
        line-height: 1.25rem;
        padding: 1rem 2rem;
    }
</style>