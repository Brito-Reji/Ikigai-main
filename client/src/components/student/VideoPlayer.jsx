import React, { useRef, useState, useEffect } from "react";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Settings,
    Loader2,
} from "lucide-react";
import axios from "axios";
import Hls from "hls.js";

const API = (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api";

const VideoPlayer = ({ videoUrl, onTimeUpdate, onEnded }) => {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const signingParamsRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Fetch signed HLS URL + signing params
    const fetchSignedUrl = async () => {
        const { data } = await axios.get(
            `${API}/public/stream-video?videoPath=${encodeURIComponent(videoUrl)}`
        );
        if (!data.success || !data.data?.url) throw new Error("Invalid response");
        signingParamsRef.current = data.data.signingParams || null;
        return data.data.url;
    };

    // Init HLS player
    const initHls = (signedUrl) => {
        const video = videoRef.current;
        if (!video) return;

        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        if (!Hls.isSupported()) {
            // Safari native HLS
            video.src = signedUrl;
            return;
        }

        const hls = new Hls({
            xhrSetup: (xhr, url) => {
                const params = signingParamsRef.current;
                if (params && !url.includes("Policy=")) {
                    const qs = new URLSearchParams(params).toString();
                    const sep = url.includes("?") ? "&" : "?";
                    xhr.open("GET", `${url}${sep}${qs}`, true);
                }
            },
        });

        hlsRef.current = hls;
        hls.loadSource(signedUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => setIsBuffering(false));

        hls.on(Hls.Events.ERROR, (_, err) => {
            if (!err.fatal) return;
            if (err.type === Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
            } else if (err.type === Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
            } else {
                hls.destroy();
                hlsRef.current = null;
                setHasError(true);
                setIsBuffering(false);
            }
        });
    };

    // Load on mount / videoUrl change
    useEffect(() => {
        if (!videoUrl) return;

        setIsBuffering(true);
        setHasError(false);

        fetchSignedUrl()
            .then(initHls)
            .catch(() => {
                setHasError(true);
                setIsBuffering(false);
            });

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [videoUrl]);

    // Video event listeners
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onMetadata = () => setDuration(video.duration);
        const onTimeUpd = () => {
            setCurrentTime(video.currentTime);
            if (onTimeUpdate) onTimeUpdate(video.currentTime);
        };
        const onEnded_ = () => {
            setIsPlaying(false);
            if (onEnded) onEnded();
        };

        video.addEventListener("loadedmetadata", onMetadata);
        video.addEventListener("timeupdate", onTimeUpd);
        video.addEventListener("ended", onEnded_);

        return () => {
            video.removeEventListener("loadedmetadata", onMetadata);
            video.removeEventListener("timeupdate", onTimeUpd);
            video.removeEventListener("ended", onEnded_);
        };
    }, [onTimeUpdate, onEnded]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (e) => {
        const video = videoRef.current;
        const rect = e.currentTarget.getBoundingClientRect();
        video.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
    };

    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        videoRef.current.volume = val;
        setIsMuted(val === 0);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (isMuted) {
            video.volume = volume || 0.5;
            setIsMuted(false);
        } else {
            video.volume = 0;
            setIsMuted(true);
        }
    };

    const toggleFullscreen = () => {
        const container = videoRef.current.parentElement;
        if (!document.fullscreenElement) {
            container.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const changePlaybackRate = (rate) => {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
        setShowSpeedMenu(false);
    };

    const formatTime = (t) => {
        if (isNaN(t)) return "0:00";
        return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    // No video
    if (!videoUrl) {
        return (
            <div className="bg-gray-900 rounded-lg min-h-[400px] flex items-center justify-center">
                <p className="text-gray-400 text-sm">No video for this lesson</p>
            </div>
        );
    }

    // Error
    if (hasError) {
        return (
            <div className="bg-gray-900 rounded-lg min-h-[400px] flex flex-col items-center justify-center gap-3">
                <p className="text-red-400 text-sm">Failed to load video</p>
                <button
                    onClick={() => {
                        setHasError(false);
                        setIsBuffering(true);
                        fetchSignedUrl()
                            .then(initHls)
                            .catch(() => {
                                setHasError(true);
                                setIsBuffering(false);
                            });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div
            className="relative bg-black rounded-lg overflow-hidden min-h-[400px] flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {isBuffering && (
                <div className="absolute z-10">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            )}

            <video
                ref={videoRef}
                className="w-full max-h-[70vh] object-contain"
                onClick={togglePlay}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
            />

            {/* Controls overlay */}
            <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${
                    showControls ? "opacity-100" : "opacity-0"
                }`}
            >
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 pointer-events-auto">
                    {/* Progress bar */}
                    <div
                        className="w-full h-1 bg-gray-600 rounded-full cursor-pointer group/progress"
                        onClick={handleSeek}
                    >
                        <div
                            className="h-full bg-blue-600 rounded-full relative group-hover/progress:h-1.5 transition-all"
                            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full opacity-0 group-hover/progress:opacity-100" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Left controls */}
                        <div className="flex items-center gap-3">
                            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                            </button>

                            <div className="flex items-center gap-2 group/volume">
                                <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                                <input
                                    type="range" min="0" max="1" step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-blue-600"
                                />
                            </div>

                            <span className="text-white text-sm font-medium">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Right controls */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                    className="text-white hover:text-blue-400 transition-colors flex items-center gap-1 text-sm"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>{playbackRate}x</span>
                                </button>

                                {showSpeedMenu && (
                                    <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-lg py-2 min-w-[100px]">
                                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                            <button
                                                key={rate}
                                                onClick={() => changePlaybackRate(rate)}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors ${
                                                    playbackRate === rate ? "text-blue-400" : "text-white"
                                                }`}
                                            >
                                                {rate}x
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
                                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                        <button
                            onClick={togglePlay}
                            className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-xl"
                        >
                            <Play className="w-10 h-10 text-white ml-1" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;