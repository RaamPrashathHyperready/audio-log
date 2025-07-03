"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Loader2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AudioPlayer({ jobId, showDuration = false, variant = "compact" }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState(false)
  const audioRef = useRef(null)

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
    const audio = audioRef.current
    if (!audio || !audioUrl) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
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

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [audioUrl, jobId])

  const handlePlayPause = async () => {
    if (!audioUrl) {
      await fetchAudioUrl()
      return
    }

    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressClick = (e) => {
    if (!audioRef.current || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickRatio = clickX / rect.width
    const newTime = clickRatio * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatDurationSeconds = (time) => {
    if (isNaN(time)) return "0s"
    return `${Math.floor(time)}s`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  // Auto-play after audio URL is fetched
  useEffect(() => {
    if (audioUrl && audioRef.current && !isPlaying) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [audioUrl])

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        </div>
        <div className="text-xs text-gray-400">No audio</div>
      </div>
    )
  }

  if (variant === "modal") {
    // Simple audio player for modal - no waveform
    return (
      <div className="space-y-3">
        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePlayPause}
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

          <div className="flex-1">
            <div
              className="w-full h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-blue-500 transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="text-sm text-gray-600 font-mono min-w-[80px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    )
  }

  // Compact version for table rows
  return (
    <div className="flex items-center gap-2 w-full">
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      <Button
        variant="ghost"
        size="sm"
        onClick={handlePlayPause}
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

      <div className="flex-1 min-w-0">
        <div
          className="w-full h-1 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
        >
          <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <div className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
        {duration > 0 ? formatTime(currentTime) : audioUrl ? "..." : "--:--"}
      </div>

      {showDuration && duration > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
          <Clock className="w-3 h-3" />
          {formatDurationSeconds(duration)}
        </div>
      )}
    </div>
  )
}
