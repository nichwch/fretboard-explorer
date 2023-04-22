import type { NoteWithOctave } from 'tonal'

export type StringIndex = number | null
export type Chord = [
  StringIndex,
  StringIndex,
  StringIndex,
  StringIndex,
  StringIndex,
  StringIndex
]
export type Phrase = Chord[]

export type Tuning = NoteWithOctave[]

export type FretMap = [
  number[],
  number[],
  number[],
  number[],
  number[],
  number[]
]
