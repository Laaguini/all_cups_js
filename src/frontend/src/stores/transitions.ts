import { readable } from "svelte/store";
import { scale } from "svelte/transition";

type TransitionDirective = {
    func: (() => {}),
    options: Record<string, any>
}

type Transition = {
    in?: TransitionDirective,
    out?: TransitionDirective
} | null | undefined

const control = readable({
    in: {
        func: scale, 
        options: {
            duration: 300
        }
    }, 
    out: null
})

export { control, type Transition }