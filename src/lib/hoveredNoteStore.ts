import { writable } from 'svelte/store'
import type { NoteName } from 'tonal'

export const hoveredNote = writable<NoteName | null>(null)
