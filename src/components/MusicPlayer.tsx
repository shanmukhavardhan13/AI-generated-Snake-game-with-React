import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Digital Dreamer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Retro Future',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 312,
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
      <audio ref={audioRef} src={currentTrack.url} />
      
      {/* Visualizer Placeholder */}
      <div className="h-24 flex items-end justify-center gap-1 px-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-cyan-500/40 rounded-full"
            animate={{
              height: isPlaying ? [20, Math.random() * 60 + 20, 20] : 10,
            }}
            transition={{
              repeat: Infinity,
              duration: 0.5 + Math.random() * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Music className="w-8 h-8 text-white" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-white font-bold truncate text-lg">{currentTrack.title}</h3>
          <p className="text-white/40 text-sm font-mono uppercase tracking-wider">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-magenta-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4">
        <button onClick={handlePrev} className="p-2 text-white/60 hover:text-white transition-colors">
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-black fill-black" />
          ) : (
            <Play className="w-8 h-8 text-black fill-black ml-1" />
          )}
        </button>

        <button onClick={handleNext} className="p-2 text-white/60 hover:text-white transition-colors">
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
        <Volume2 className="w-4 h-4 text-white/40" />
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}
