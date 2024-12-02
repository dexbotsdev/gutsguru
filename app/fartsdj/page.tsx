"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Square, Music2, Wind } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Track {
  name: string;
  colorClass: string;
  activeColorClass: string;
  file: string;
}

type PatternNumber = 1 | 2 | 3 | 4;
type SetNumber = 1 ;
type Patterns = {
  [key in SetNumber]: {
    [key in PatternNumber]: boolean[][];
  };
};

const TRACKS: { [key in SetNumber]: Track[] } = {
  1: [
    { 
      name: "Kick", 
      colorClass: "bg-emerald-500",
      activeColorClass: "bg-emerald-500 hover:bg-emerald-600",
      file: "assets/set1/kick.wav" 
    },
    { 
      name: "Snare", 
      colorClass: "bg-rose-500",
      activeColorClass: "bg-rose-500 hover:bg-rose-600",
      file: "assets/set1/snare1.wav" 
    },
    { 
      name: "Closed Hat", 
      colorClass: "bg-orange-500",
      activeColorClass: "bg-orange-500 hover:bg-orange-600",
      file: "assets/set1/hihat.wav" 
    },
    { 
      name: "Open Hat", 
      colorClass: "bg-amber-400",
      activeColorClass: "bg-amber-400 hover:bg-amber-500",
      file: "assets/set1/hihat.wav" 
    },
    { 
      name: "Toms", 
      colorClass: "bg-cyan-400",
      activeColorClass: "bg-cyan-400 hover:bg-cyan-500",
      file: "assets/set1/tom1.wav" 
    },
    { 
      name: "Percussion", 
      colorClass: "bg-purple-500",
      activeColorClass: "bg-purple-500 hover:bg-purple-600",
      file: "assets/set1/tom2.wav" 
    },
    { 
      name: "Fx", 
      colorClass: "bg-blue-500",
      activeColorClass: "bg-blue-500 hover:bg-blue-600",
      file: "assets/set1/tom3.wav" 
    },
    { 
      name: "Sample", 
      colorClass: "bg-red-500",
      activeColorClass: "bg-red-500 hover:bg-red-600",
      file: "assets/set1/tom4.wav" 
    }, 
    { 
      name: "Fart Bass", 
      colorClass: "bg-indigo-500",
      activeColorClass: "bg-indigo-500 hover:bg-indigo-600",
      file: "assets/set2/fart1.wav" 
    },
    { 
      name: "Fart Clap", 
      colorClass: "bg-pink-500",
      activeColorClass: "bg-pink-500 hover:bg-pink-600",
      file: "assets/set2/fart2.wav" 
    },
    { 
      name: "Fart Rim", 
      colorClass: "bg-yellow-500",
      activeColorClass: "bg-yellow-500 hover:bg-yellow-600",
      file: "assets/set2/fart3.wav" 
    },
    { 
      name: "Fart Shaker", 
      colorClass: "bg-teal-400",
      activeColorClass: "bg-teal-400 hover:bg-teal-500",
      file: "assets/set2/fart4.wav" 
    },
    { 
      name: "Fart Synth", 
      colorClass: "bg-lime-400",
      activeColorClass: "bg-lime-400 hover:bg-lime-500",
      file: "assets/set2/fart5.wav" 
    },
    { 
      name: "Fart Vocal", 
      colorClass: "bg-fuchsia-500",
      activeColorClass: "bg-fuchsia-500 hover:bg-fuchsia-600",
      file: "assets/set2/fart6.wav" 
    },
    { 
      name: "Fart Pad", 
      colorClass: "bg-sky-500",
      activeColorClass: "bg-sky-500 hover:bg-sky-600",
      file: "assets/set2/fart7.wav" 
    },
    { 
      name: "Fart Lead", 
      colorClass: "bg-orange-500",
      activeColorClass: "bg-orange-500 hover:bg-orange-600",
      file: "assets/set2/fart8.wav" 
    },
  ]
}

const STEPS = 16
const INITIAL_BPM = 146
const INITIAL_VOLUME = 83

export default function FartsDj3000Page() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [bpm, setBpm] = useState(INITIAL_BPM)
  const [volume, setVolume] = useState(INITIAL_VOLUME)
  const [currentSet, setCurrentSet] = useState<SetNumber>(1)
  const [currentPattern, setCurrentPattern] = useState<PatternNumber>(1)
  const [patterns, setPatterns] = useState<Patterns>({
    1: {
      1: TRACKS[1].map(() => Array(STEPS).fill(false)),
      2: TRACKS[1].map(() => Array(STEPS).fill(false)),
      3: TRACKS[1].map(() => Array(STEPS).fill(false)),
      4: TRACKS[1].map(() => Array(STEPS).fill(false)),
    } 
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const intervalRef = useRef<number | null>(null)
  const audioBuffersRef = useRef<{ [key in SetNumber]: AudioBuffer[] }>({ 1: [] })

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    gainNodeRef.current = audioContextRef.current.createGain()
    gainNodeRef.current.connect(audioContextRef.current.destination)

    const loadAudioFiles = async () => {
      for (const setNumber of [1] as const) {
        for (const track of TRACKS[setNumber]) {
          try {
            const response = await fetch(track.file)
            const arrayBuffer = await response.arrayBuffer()
            const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer)
            audioBuffersRef.current[setNumber].push(audioBuffer)
          } catch (error) {
            console.error(`Failed to load audio file: ${track.file}`, error)
          }
        }
      }
    }

    loadAudioFiles()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume / 100, audioContextRef.current?.currentTime || 0)
    }
  }, [volume])

  const playSound = useCallback((setNumber: SetNumber, trackIndex: number) => {
    if (audioContextRef.current && gainNodeRef.current && audioBuffersRef.current[setNumber][trackIndex]) {
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffersRef.current[setNumber][trackIndex]
      source.connect(gainNodeRef.current)
      source.start()
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      const stepTime = (60 / bpm) / 4 * 1000
      intervalRef.current = window.setInterval(() => {
        setCurrentStep((prevStep) => {
          const newStep = (prevStep + 1) % STEPS
          patterns[currentSet][currentPattern].forEach((track, trackIndex) => {
            if (track[newStep]) {
              playSound(currentSet, trackIndex)
            }
          })
          return newStep
        })
      }, stepTime)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, patterns, currentSet, currentPattern, bpm, playSound])

  const toggleStep = useCallback((trackIndex: number, stepIndex: number) => {
    setPatterns(prevPatterns => {
      const newPatterns = { ...prevPatterns }
      newPatterns[currentSet] = { ...prevPatterns[currentSet] }
      newPatterns[currentSet][currentPattern] = [...prevPatterns[currentSet][currentPattern]]
      newPatterns[currentSet][currentPattern][trackIndex] = [...prevPatterns[currentSet][currentPattern][trackIndex]]
      newPatterns[currentSet][currentPattern][trackIndex][stepIndex] = !newPatterns[currentSet][currentPattern][trackIndex][stepIndex]
      return newPatterns
    })
  }, [currentSet, currentPattern])


  const changeSet = (setNumber: SetNumber) => {
    setCurrentSet(setNumber)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">FartDJ 3000</h1>
          <div className="text-sm opacity-50">
           </div>
        </div>

        <h2 className="text-7xl font-bold mb-12">Fart a beat.</h2>

        <div className="bg-zinc-900 rounded-lg p-8">
          <div className="flex items-center gap-8 mb-8">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              size="icon"
              className={cn(
                "w-12 h-12",
                isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
              )}
            >
              {isPlaying ? <Square className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm">Tempo:</span>
              <Slider
                value={[bpm]}
                onValueChange={([v]) => setBpm(v)}
                min={60}
                max={200}
                step={1}
                className="w-48 text-red-400 bg-green-600"
              />
              <span className="font-mono w-24">{bpm} bpm</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Master Volume:</span>
              <Slider
                value={[volume]}
                onValueChange={([v]) => setVolume(v)}
                max={100}
                step={1}
                className="w-48 text-red-400 bg-green-600"
              />
              <span className="font-mono w-8">{volume}%</span>
            </div> 
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm">Sound Set:</span>
            <Button
              variant={currentSet === 1 ? "default" : "secondary"}
              onClick={() => changeSet(1)}
              className={cn(
                "w-100 h-10 p-2 rounded-full border-2 transition-all duration-300",
                currentSet === 1
                  ? "border-emerald-500 shadow-[0_0_10px_#10b981,0_0_20px_#10b981] bg-emerald-500"
                  : "border-zinc-600 hover:border-emerald-500 hover:shadow-[0_0_10px_#10b981,0_0_20px_#10b981]"
              )}
            >
              <Music2 className="w-6 h-6" />
              <span >Fartruments</span>
            </Button>
            {/* <Button
              variant={currentSet === 2 ? "default" : "secondary"}
              onClick={() => changeSet(2)}
              className={cn(
                "w-100 h-10 p-2 rounded-full border-2 transition-all duration-300",
                currentSet === 2
                  ? "border-purple-500 shadow-[0_0_10px_#8b5cf6,0_0_20px_#8b5cf6] bg-purple-500"
                  : "border-zinc-600 hover:border-purple-500 hover:shadow-[0_0_10px_#8b5cf6,0_0_20px_#8b5cf6]"
              )}
            >
              <Wind className="w-6 h-6" />
              <span >Fart Sounds</span>
            </Button> */}
          </div>

          <div className="grid gap-1">
            {patterns[currentSet][currentPattern].map((track, trackIndex) => (
              <div key={TRACKS[currentSet][trackIndex].name} className="flex items-center gap-4">
                <Card className={cn(
                  "w-28 p-2 shadow-md border-t border-zinc-800 rounded-none",
                  TRACKS[currentSet][trackIndex].colorClass
                )}>
                  <CardContent className="p-0">
                    <p className="text-sm text-right text-white">{TRACKS[currentSet][trackIndex].name}</p>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-[repeat(16,1fr)] gap-1 flex-1">
                  {track.map((isActive, stepIndex) => (
                    <button
                      key={stepIndex}
                      onClick={() => toggleStep(trackIndex, stepIndex)}
                      className={cn(
                        "w-full h-8 rounded-md transition-all relative overflow-hidden",
                        isActive
                          ? `${TRACKS[currentSet][trackIndex].colorClass} shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.2),_inset_2px_2px_5px_rgba(0,0,0,0.3)]`
                          : 'bg-zinc-800 shadow-[-2px_-2px_5px_rgba(255,255,255,0.1),_2px_2px_5px_rgba(0,0,0,0.5)]',
                        currentStep === stepIndex && "ring-1 ring-white ring-opacity-50",
                        "hover:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.1),_inset_2px_2px_5px_rgba(0,0,0,0.5)]"
                      )}
                    >
                      {isActive && (
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-10",
                          "transform rotate-45 scale-150"
                        )} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}