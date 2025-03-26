import { memo, useRef, useState, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader, SkipForward, SkipBack } from "lucide-react";

interface SimplePlayerProps {
  url: string;
  skipTime?: number; // Time to skip in seconds when using buttons (default: 10)
}

const NewInterViewPlayer = ({ url, skipTime = 10 }: SimplePlayerProps) => {
  if (!url) {
    return <div>No URL Provided</div>;
  }

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
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player) {
        try {
          // For HTML5 video
          if (player.pause) player.pause();

          // For other players (YouTube, etc.)
          if (typeof player.pauseVideo === "function") player.pauseVideo();

          // Never use player.stop() here
        } catch (e) {
          console.error("Pause error:", e);
        }
      }
      setIsPlaying(false);
    }
  }, []);

  // Create a more reliable play function
  const forcePlayerPlay = useCallback(() => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player) {
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
      }
    }
  }, []);



  const seekForward = () => {
    if(playerRef.current)
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
};

const seekBackward = () => {
    if(playerRef.current)
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
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
    const newVolume = parseFloat(e.target.value);
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
      if (!containerRef.current?.contains(document.activeElement) && document.activeElement !== document.body) {
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [skipTime, currentSeconds, totalSeconds, isPlaying]);

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

  console.log("progress", progress);
  

  return (
    <div ref={containerRef} className="relative w-full h-full bg-inherit focus:outline-none" tabIndex={0}>
      <div className="absolute top-0 left-0 w-full h-full">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={volume}
          muted={isMuted}
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
      </div>

      {/* Loading overlay */}
      {(isLoading ) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-8 h-8 text-green-500 animate-spin" />
            <span className="text-white text-sm">{isLoading ? "Loading..." : "Loading..."}</span>
          </div>
        </div>
      )}

      {/* Clickable area for play/pause */}
      <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} onDoubleClick={toggleFullscreen}>
        {/* This div is just for click handling */}
      </div>

      {/* Control bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1.5 md:p-3 z-20">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="text-white hover:text-green-500 transition-colors"
            disabled={isLoading}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          {/* Skip Backward */}
          <button
            // onClick={() => handleSkip(-skipTime)}
            className="text-white hover:text-green-500 transition-colors hidden md:block"
            disabled={isLoading}
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Skip Forward */}
          <button
            // onClick={() => handleSkip(skipTime)}
            className="text-white hover:text-green-500 transition-colors hidden md:block"
            disabled={isLoading}
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Seek Bar */}
          <div className="flex-1">
            <input
              type="range"
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: "rgb(34 197 94)",
                background: `linear-gradient(to right, rgb(34 197 94) ${progress * 100}%, rgb(209 213 219) ${progress}%)`,
              }}
              value={progress }
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setProgress(value);
                if (playerRef.current) {
                  playerRef.current.seekTo(value);
                }
              }}
              min="0"
              max="1"
              step="0.01"
            //   disabled={(isLoading && !isDragging) || !playerReady}
            />
          </div>

          {/* Time Display */}
          <div className="text-white text-sm">
            {currentTime} / {duration}
          </div>

          {/* Volume Controls */}
          <div className=" items-center gap-2 hidden md:flex">
            <button
              onClick={toggleMute}
              className="text-white hover:text-green-500 transition-colors"
              disabled={isLoading}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <div className="w-16 hidden sm:block">
              <input
                type="range"
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  accentColor: "rgb(34 197 94)",
                  background: `linear-gradient(to right, rgb(34 197 94) ${volume * 100}%, rgb(209 213 219) ${
                    volume * 100
                  }%)`,
                }}
                value={volume}
                onChange={handleVolumeChange}
                min={0}
                max={1}
                step={0.1}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-green-500 transition-colors"
            disabled={isLoading}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(NewInterViewPlayer);
