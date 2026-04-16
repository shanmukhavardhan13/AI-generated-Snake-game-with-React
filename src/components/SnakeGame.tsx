import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';
import { GameState } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

export default function SnakeGame() {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((snake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState(prev => {
      const head = { ...prev.snake[0] };
      switch (prev.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        prev.snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      // Check food
      if (head.x === prev.food.x && head.y === prev.food.y) {
        newScore += 10;
        newFood = generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
      };
    });
  }, [gameState.isGameOver, gameState.isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (gameState.direction !== 'DOWN') setGameState(prev => ({ ...prev, direction: 'UP' }));
          break;
        case 'ArrowDown':
          if (gameState.direction !== 'UP') setGameState(prev => ({ ...prev, direction: 'DOWN' }));
          break;
        case 'ArrowLeft':
          if (gameState.direction !== 'RIGHT') setGameState(prev => ({ ...prev, direction: 'LEFT' }));
          break;
        case 'ArrowRight':
          if (gameState.direction !== 'LEFT') setGameState(prev => ({ ...prev, direction: 'RIGHT' }));
          break;
        case ' ':
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 150);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Neon Glow Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-magenta-500/20 blur-[100px] rounded-full" />
      </div>

      <div className="flex justify-between w-full items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Trophy className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1">Score</span>
            <span 
              className="text-5xl font-digital text-white leading-none glitch tracking-widest"
              data-text={gameState.score.toString().padStart(4, '0')}
            >
              {gameState.score.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
        >
          {gameState.isPaused ? <Play className="w-5 h-5 text-white" /> : <Pause className="w-5 h-5 text-white" />}
        </button>
      </div>

      <div 
        className="relative bg-black/60 rounded-xl border border-white/5 overflow-hidden shadow-inner"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-5">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>

        {/* Snake */}
        {gameState.snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            layoutId={`snake-${i}`}
            className={`absolute rounded-sm ${i === 0 ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-10' : 'bg-cyan-600/60'}`}
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
            }}
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="absolute bg-magenta-500 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.8)]"
          style={{
            width: 14,
            height: 14,
            left: gameState.food.x * 20 + 3,
            top: gameState.food.y * 20 + 3,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">GAME OVER</h2>
              <p className="text-white/60 font-mono mb-6">Final Score: {gameState.score}</p>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
              >
                <RotateCcw className="w-4 h-4" />
                PLAY AGAIN
              </button>
            </motion.div>
          )}

          {gameState.isPaused && !gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
                <p className="text-white font-mono text-sm tracking-widest uppercase">Paused</p>
                <p className="text-white/40 text-[10px] uppercase tracking-tighter">Press Space to Resume</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-white/40 font-mono text-[10px] uppercase tracking-widest z-10">
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-white/60">ARROWS</kbd>
          <span>to move</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-white/60">SPACE</kbd>
          <span>to pause</span>
        </div>
      </div>
    </div>
  );
}
