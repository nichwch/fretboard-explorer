import {
  distance,
  interval,
  note,
  Scale,
  type NoteWithOctave,
  Note,
  Interval,
  Range,
  type NoteName,
  PcSet,
} from 'tonal'
import type { FretMap, Tuning } from './lib/types'

export const STANDARD_TUNING: Tuning = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2']

export function rangeOfTuning(tuning: Tuning, frets: number) {
  const lowestNote = tuning[tuning.length - 1]

  const interval = Interval.fromSemitones(frets)
  const highestNote = Note.transpose(tuning[0], interval)
  const range = Range.chromatic([lowestNote, highestNote])
  return range
}

export function scaleNotesInRange(
  tuning: Tuning,
  frets: number,
  scale: NoteName[]
) {
  const scaleInRange = []
  const range = rangeOfTuning(tuning, frets)
  const isInScale = PcSet.isNoteIncludedIn(scale)
  const scalePitchClass = PcSet.get(scale)
  for (let note of range) {
    if (isInScale(note)) {
      scaleInRange.push(note)
    }
  }
  return scaleInRange
}

export function noteByStringAndFret(
  tuning: Tuning,
  stringIndex: number,
  fretIndex: number
) {
  const openNote = tuning[stringIndex]
  const interval = Interval.fromSemitones(fretIndex)
  const note = Note.transpose(openNote, interval)
  return Note.get(note).pc
}

export function fretForNoteOnString(
  tuning: Tuning,
  stringIndex: number,
  noteWithOctave: NoteWithOctave
) {
  const targetStringOpenNote = tuning[stringIndex]
  const distanceFromOpenToTarget = distance(
    targetStringOpenNote,
    noteWithOctave
  )
  const semitonesToTarget = interval(distanceFromOpenToTarget).semitones
  return semitonesToTarget
}

export function FretMapForScale(
  tuning: Tuning,
  frets: number,
  scaleName: string
) {
  const scale = Scale.get(scaleName)
  const scaleRoot = scale.tonic
  const scaleType = scale.type

  const combinedScaleNotes = scaleNotesInRange(tuning, frets, scale.notes)

  const fretMap: FretMap = [[], [], [], [], [], []]
  for (let i = 0; i < fretMap.length; i++) {
    // for note in scale, do the following
    for (let note of combinedScaleNotes) {
      const fretOfNoteOnString = fretForNoteOnString(tuning, i, note)
      if (fretOfNoteOnString >= 0) {
        fretMap[i].push(fretOfNoteOnString)
      }
    }
  }
  return fretMap
}
