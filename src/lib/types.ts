import type { NoteWithOctave, NoteName } from 'tonal'
import { GUITAR_STANDARD_FRETS, GUITAR_STANDARD_TUNING } from './constants'

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

export type FretMap = number[][]

export type FretMapBlockProps = {
  stringSpacing: number
  fretSpacing: number
  frets: number
  tuning: Tuning
  root: NoteName | null
  mode: 'scale' | 'chord'
  chordType: string | null
  scaleType: string | null
  id: string
}

export const defaultFretMapBlockProps: Partial<FretMapBlockProps> = {
  stringSpacing: 20,
  fretSpacing: 50,
  frets: GUITAR_STANDARD_FRETS,
  tuning: GUITAR_STANDARD_TUNING,
  root: 'A',
  mode: 'scale',
  chordType: 'major',
  scaleType: 'pentatonic',
}
