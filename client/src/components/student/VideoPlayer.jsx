import React, { useRef, useState, useEffect } from 'react';
import {
	Play,
	Pause,
	Volume2,
	VolumeX,
	Maximize,
	Minimize,
	Settings
} from 'lucide-react';

const VideoPlayer = ({ videoUrl, onTimeUpdate, onEnded }) => {
	const videoRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [playbackRate, setPlaybackRate] = useState(1);
	const [showSpeedMenu, setShowSpeedMenu] = useState(false);

	const controlsTimeoutRef = useRef(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleLoadedMetadata = () => {
			setDuration(video.duration);
		};

		const handleTimeUpdate = () => {
			setCurrentTime(video.currentTime);
			if (onTimeUpdate) {
				onTimeUpdate(video.currentTime);
			}
		};

		const handleEnded = () => {
			setIsPlaying(false);
			if (onEnded) {
				onEnded();
			}
		};

		video.addEventListener('loadedmetadata', handleLoadedMetadata);
		video.addEventListener('timeupdate', handleTimeUpdate);
		video.addEventListener('ended', handleEnded);

		return () => {
			video.removeEventListener('loadedmetadata', handleLoadedMetadata);
			video.removeEventListener('timeupdate', handleTimeUpdate);
			video.removeEventListener('ended', handleEnded);
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
		const pos = (e.clientX - rect.left) / rect.width;
		video.currentTime = pos * duration;
	};

	const handleVolumeChange = (e) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		videoRef.current.volume = newVolume;
		setIsMuted(newVolume === 0);
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

	const formatTime = (time) => {
		if (isNaN(time)) return '0:00';
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	const handleMouseMove = () => {
		setShowControls(true);
		if (controlsTimeoutRef.current) {
			clearTimeout(controlsTimeoutRef.current);
		}
		controlsTimeoutRef.current = setTimeout(() => {
			if (isPlaying) {
				setShowControls(false);
			}
		}, 3000);
	};

	return (
		<div
			className="relative bg-black rounded-lg overflow-hidden group"
			onMouseMove={handleMouseMove}
			onMouseLeave={() => isPlaying && setShowControls(false)}
		>
			<video
				ref={videoRef}
				className="w-full aspect-video"
				src={videoUrl}
				onClick={togglePlay}
			/>

			<div
				className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
					showControls ? 'opacity-100' : 'opacity-0'
				}`}
			>
				<div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
					<div
						className="w-full h-1 bg-gray-600 rounded-full cursor-pointer group/progress"
						onClick={handleSeek}
					>
						<div
							className="h-full bg-blue-600 rounded-full relative group-hover/progress:h-1.5 transition-all"
							style={{ width: `${(currentTime / duration) * 100}%` }}
						>
							<div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full opacity-0 group-hover/progress:opacity-100" />
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<button
								onClick={togglePlay}
								className="text-white hover:text-blue-400 transition-colors"
							>
								{isPlaying ? (
									<Pause className="w-6 h-6" />
								) : (
									<Play className="w-6 h-6" />
								)}
							</button>

							<div className="flex items-center gap-2 group/volume">
								<button
									onClick={toggleMute}
									className="text-white hover:text-blue-400 transition-colors"
								>
									{isMuted ? (
										<VolumeX className="w-5 h-5" />
									) : (
										<Volume2 className="w-5 h-5" />
									)}
								</button>
								<input
									type="range"
									min="0"
									max="1"
									step="0.1"
									value={isMuted ? 0 : volume}
									onChange={handleVolumeChange}
									className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-blue-600"
								/>
							</div>

							<div className="text-white text-sm font-medium">
								{formatTime(currentTime)} / {formatTime(duration)}
							</div>
						</div>

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
													playbackRate === rate
														? 'text-blue-400'
														: 'text-white'
												}`}
											>
												{rate}x
											</button>
										))}
									</div>
								)}
							</div>

							<button
								onClick={toggleFullscreen}
								className="text-white hover:text-blue-400 transition-colors"
							>
								{isFullscreen ? (
									<Minimize className="w-5 h-5" />
								) : (
									<Maximize className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
				</div>

				{!isPlaying && (
					<div className="absolute inset-0 flex items-center justify-center">
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
