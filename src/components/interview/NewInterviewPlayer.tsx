"use client";

import type React from "react";

import { memo, useRef, useState, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Loader,
} from "lucide-react";
import Forward from "@/assets/video-player/forward_5.svg";
import Backward from "@/assets/video-player/backward_5.svg";

interface SimplePlayerProps {
  url: string;
  skipTime?: number; // Time to skip in seconds when using buttons (default: 10)
}

const NewInterViewPlayer = ({ url, skipTime = 10 }: SimplePlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [speedDropdownOpen, setSpeedDropdownOpen] = useState(false);

  if (!url) {
    return <div>No URL Provided</div>;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle progress updates from player
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!isDragging) {
      setProgress(state.played);
      setCurrentTime(formatTime(state.playedSeconds));
      setCurrentSeconds(state.playedSeconds);
    }
  };

  // Create a more reliable pause function
  const forcePlayerPause = useCallback(() => {
    if (!playerRef.current) return;

    const player = playerRef.current.getInternalPlayer();
    if (!player) return;

    try {
      // For HTML5 video
      if (player.pause) player.pause();

      // For other players (YouTube, etc.)
      if (typeof player.pauseVideo === "function") player.pauseVideo();

      // Never use player.stop() here
    } catch (e) {
      console.error("Pause error:", e);
    }
    setIsPlaying(false);
  }, [playerRef]);

  // Create a more reliable play function
  const forcePlayerPlay = useCallback(() => {
    if (!playerRef.current) return;

    const player = playerRef.current.getInternalPlayer();
    if (!player) return;

    // First set our React state
    setIsPlaying(true);

    // Then force the internal player to play
    try {
      const playPromise = player.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, revert our state
          setIsPlaying(false);
        });
      }
    } catch (e) {
      console.error("Failed to play:", e);
      setIsPlaying(false);
    }
  }, [playerRef]);

  const seekForward = () => {
    if (playerRef.current)
      playerRef.current.seekTo(playerRef.current.getCurrentTime() + 5);
  };

  const seekBackward = () => {
    if (playerRef.current)
      playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      forcePlayerPause();
    } else {
      forcePlayerPlay();
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  // Toggle playback speed
  const togglePlaybackSpeed = (speed?: number) => {
    if (speed) {
      setPlaybackSpeed(speed);
    } else {
      // Cycle through speeds if no specific speed is provided
      const speeds = [0.5, 0.75, 1, 1.5, 2];
      const currentIndex = speeds.indexOf(playbackSpeed);
      const nextIndex = (currentIndex + 1) % speeds.length;
      setPlaybackSpeed(speeds[nextIndex]);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle events if the player is focused
      if (
        !containerRef.current?.contains(document.activeElement) &&
        document.activeElement !== document.body
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "Enter":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          seekForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekBackward();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyS":
          e.preventDefault();
          togglePlaybackSpeed();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    skipTime,
    currentSeconds,
    totalSeconds,
    isPlaying,
    playbackSpeed,
    togglePlay,
    seekForward,
    seekBackward,
    toggleMute,
    toggleFullscreen,
    togglePlaybackSpeed,
  ]);

  // Update fullscreen state when changed externally
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Make container focusable for keyboard events
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.tabIndex = 0;
    }
  }, []);

  // Add this useEffect to handle closing the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        speedDropdownOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSpeedDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [speedDropdownOpen]);

  console.log("progress", progress);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-inherit focus:outline-none rounded-lg"
      tabIndex={0}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <style>{`
        /* Hide the thumb completely for all browsers */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 0;
          height: 0;
        }
      `}</style>

      <div className="absolute top-0 left-0 w-full h-full">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={volume}
          muted={isMuted}
          playbackRate={playbackSpeed}
          onProgress={handleProgress}
          onDuration={(duration) => {
            setDuration(formatTime(duration));
            setTotalSeconds(duration);
          }}
          controls={false}
          //   onEnded={forcePlayerPause}
          onBuffer={() => setIsLoading(true)}
          onBufferEnd={() => setIsLoading(false)}
          onError={(e) => {
            console.error("Player Error:", e);
            setIsLoading(false);
          }}
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous",
                preload: "metadata",
              },
              tracks: [],
              forceVideo: true,
            },
          }}
          playsInline
        />
        {/* Subtle overlay for the entire video player */}
        <div
          className="absolute inset-0 pointer-events-none z-[2] rounded-lg"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.025) 0%, rgba(0, 0, 0, 0.025) 100%)",
          }}
        ></div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 z-[2] ">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-8 h-8 text-green-500 animate-spin" />
            <span className="text-white text-sm">
              {isLoading ? "Loading..." : "Loading..."}
            </span>
          </div>
        </div>
      )}

      {/* Clickable area for play/pause */}
      <div
        className="absolute inset-0 z-[2] cursor-pointer"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      >
        {/* This div is just for click handling */}
      </div>

      {/* Control bar with gradient background */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-[2]  transition-opacity duration-300 ${
          isHovering || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Gradient overlay for better visibility */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[300px] sm:h-[150px] pointer-events-none rounded-b-lg"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.80) -40.94%, rgba(0, 0, 0, 0.00) 84.82%)",
          }}
        ></div>

        {/* Seek Bar */}
        <div className="w-full mb-2 relative z-[2] px-5 md:px-3 pt-1.5 md:pt-3">
          <input
            type="range"
            className="w-full h-1 appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(34 197 94) ${
                progress * 100
              }%, rgb(209 213 219) ${progress}%)`,
              accentColor: "rgb(34 197 94)",
            }}
            value={progress}
            onChange={(e) => {
              const value = Number.parseFloat(e.target.value);
              setProgress(value);
              if (playerRef.current) {
                playerRef.current.seekTo(value);
              }
            }}
            min="0"
            max="1"
            step="0.01"
          />
        </div>

        {/* Controls now below the progress bar */}
        <div className="flex items-center justify-between relative z-[2]  px-5 md:px-3 pb-5 md:pb-3">
          <div className="flex items-center gap-3 sm:gap-1">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-green-500 transition-colors"
              disabled={isLoading}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            {/* Skip Backward */}
            <button
              onClick={seekBackward}
              className="text-white hover:text-green-500 transition-colors"
              disabled={isLoading}
            >
              {/* <SkipBack className="w-5 h-5" /> */}
              <img
                src={Backward || "/placeholder.svg"}
                alt="Skip Backward"
                className="w-6 h-6"
              />
            </button>

            {/* Skip Forward */}
            <button
              onClick={seekForward}
              className="text-white hover:text-green-500 transition-colors"
              disabled={isLoading}
            >
              {/* <SkipForward className="w-5 h-5" /> */}
              <img
                src={Forward || "/placeholder.svg"}
                alt="Skip Forward"
                className="w-6 h-6"
              />
            </button>
          </div>

          {/* Time Display - Moved to center */}
          <div className="text-white text-[14px] font-dm-sans font-medium leading-6 tracking-[0.21px]">
            {currentTime} / {duration}
          </div>

          <div className="flex items-center gap-4">
            {/* Playback Speed Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSpeedDropdownOpen(!speedDropdownOpen)}
                className="text-white hover:text-green-500 transition-colors text-[18px] leading-6 font-normal flex items-center gap-1"
                disabled={isLoading}
              >
                {playbackSpeed}X
              </button>

              {speedDropdownOpen && (
                <div className="absolute bottom-full mb-1 bg-black/80 rounded-md overflow-hidden">
                  {[0.5, 0.75, 1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setPlaybackSpeed(speed);
                        setSpeedDropdownOpen(false);
                      }}
                      className={`block w-full px-3 py-1 text-left text-sm ${
                        playbackSpeed === speed
                          ? "text-green-500"
                          : "text-white hover:bg-black/50"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume Controls */}
            <div className="items-center gap-2 flex">
              <button
                onClick={toggleMute}
                className="text-white hover:text-green-500 transition-colors"
                disabled={isLoading}
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>

              {/* <div className="w-16 sm:block">
                <input
                  type="range"
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                  style={{
                    accentColor: "rgb(34 197 94)",
                    background: `linear-gradient(to right, rgb(34 197 94) ${
                      volume * 100
                    }%, rgb(209 213 219) ${volume * 100}%)`,
                  }}
                  value={volume}
                  onChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.1}
                  disabled={isLoading}
                />
              </div> */}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-green-500 transition-colors"
              disabled={isLoading}
            >
              {isFullscreen ? (
                <Minimize className="w-6 h-6" />
              ) : (
                <Maximize className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(NewInterViewPlayer);
