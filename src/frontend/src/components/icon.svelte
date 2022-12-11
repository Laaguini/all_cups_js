<script lang="ts">
    let additionalClass: string = ''
    export { additionalClass as class }
    export let src: string 
    export let size: "sm" | "md" | "lg" | "raw" = "md";
</script>

<div class={`icon icon-${size} ${additionalClass}`}>
    {@html src}
</div>

<style global>
    .icon {
        color: inherit;
        height: fit-content;
        transform: translateY(2px);
    }
    .icon-sm svg {
        width: 1rem;
        height: 1rem;
        aspect-ratio: 1;
    }

    .icon-md svg {
        width: 1.25rem;
        height: 1.25rem;
        aspect-ratio: 1;
    }

    .icon-lg svg {
        width: 1rem;
        height: 1rem;
        aspect-ratio: 1;
    }
</style>