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
  type IntervalName,
  Chord,
} from 'tonal'
import type { FretMap, Tuning } from './lib/types'

export function rangeOfTuning(tuning: Tuning, frets: number) {
  const lowestNote = tuning[tuning.length - 1]

  const interval = Interval.fromSemitones(frets)
  const highestNote = Note.transpose(tuning[0], interval)
  const range = Range.chromatic([lowestNote, highestNote])
  return range
}

export function notesInPcAndRange(
  tuning: Tuning,
  frets: number,
  pitchClasses: NoteName[]
): NoteName[] {
  const scaleInRange = []
  const range = rangeOfTuning(tuning, frets)
  const isInScale = PcSet.isNoteIncludedIn(pitchClasses)
  const scalePitchClass = PcSet.get(pitchClasses)
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

export function FretMapForChord(tuning: Tuning, frets: number, chord: string) {
  const chordNotes = Chord.get(chord).notes
  const chordNotesInRange = notesInPcAndRange(tuning, frets, chordNotes)

  return GetFretMapGivenNotes(tuning, frets, chordNotesInRange)
}

export function FretMapForScale(
  tuning: Tuning,
  frets: number,
  scaleName: string
) {
  const scale = Scale.get(scaleName)
  const scaleRoot = scale.tonic
  const scaleType = scale.type

  const scaleNotesInRange = notesInPcAndRange(tuning, frets, scale.notes)
  return GetFretMapGivenNotes(tuning, frets, scaleNotesInRange)
}

export function GetFretMapGivenNotes(
  tuning: Tuning,
  frets: number,
  notes: NoteWithOctave[]
) {
  // an array of empty arrays, as long as the tuning
  const fretMap: FretMap = tuning.map((string) => [])
  for (let i = 0; i < fretMap.length; i++) {
    // for note in scale, do the following
    for (let note of notes) {
      const fretOfNoteOnString = fretForNoteOnString(tuning, i, note)
      if (fretOfNoteOnString >= 0) {
        fretMap[i].push(fretOfNoteOnString)
      }
    }
  }
  return fretMap
}
