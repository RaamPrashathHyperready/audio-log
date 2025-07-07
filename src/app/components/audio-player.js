"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const AudioPlayer = ({ jobId, variant = "inline", onDurationUpdate }) => {
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef(null)

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration)
  }

  const handleSeek = (time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const fetchAudioUrl = async () => {
    if (audioUrl || isLoading) return

    setIsLoading(true)
    setError(false)

    try {
      const response = await fetch(`/api/audio/${encodeURIComponent(jobId)}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      if (result.success && result.audioUrl) {
        setAudioUrl(result.audioUrl)
      } else {
        throw new Error("No audio URL returned")
      }
    } catch (error) {
      console.error(`Error fetching audio for ${jobId}:`, error)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Auto-fetch audio URL and load metadata immediately for modal variant
    if (variant === "modal" && jobId) {
      fetchAudioUrl()
    }
  }, [variant, jobId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      // Immediately call the callback to update parent component with duration
      if (onDurationUpdate) {
        onDurationUpdate(audio.duration)
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = () => {
      console.error("Error loading audio:", jobId)
      setError(true)
    }

    // Load metadata immediately when audio URL is available
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    // Force load metadata
    if (audio.readyState >= 1) {
      handleLoadedMetadata()
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [audioUrl, jobId, onDurationUpdate])

  useEffect(() => {
    if (jobId && variant === "inline") {
      fetchAudioUrl()
    }
  }, [jobId, variant])

  return (
    <div className="flex flex-col items-center">
      {isLoading && <p>Loading audio...</p>}
      {error && <p>Error loading audio.</p>}
      {audioUrl && (
        <div className="flex flex-col items-center w-full">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
          <div className="flex items-center justify-between w-full mt-2">
            {variant === "modal" ? (
              <Button
                variant="ghost"
                size="lg"
                onClick={togglePlay}
                disabled={isLoading}
                className="w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 disabled:bg-gray-100"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                disabled={isLoading}
                className="w-6 h-6 p-0 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
              </Button>
            )}

            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => handleSeek(e.target.value)}
              className="w-1/2"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AudioPlayer
