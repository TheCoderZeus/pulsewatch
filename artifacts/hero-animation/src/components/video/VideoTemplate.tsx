import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1Content, Scene1Title } from './Scene1';
import { Scene2Content, Scene2Title } from './Scene2';
import { Scene3Content, Scene3Title } from './Scene3';

const SCENE_DURATIONS = {
  scene1: 3500,
  scene2: 4500,
  scene3: 3500,
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
  });

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-bg-light)' }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Persistent Background Orbs */}
      <motion.div
        className="absolute rounded-full opacity-20 blur-[100px]"
        style={{ backgroundColor: 'var(--color-accent)', width: '50vw', height: '50vw', left: 0, top: 0 }}
        animate={{
          x: currentScene === 0 ? '-10vw' : currentScene === 1 ? '60vw' : '20vw',
          y: currentScene === 0 ? '10vh' : currentScene === 1 ? '50vh' : '-10vh',
          scale: currentScene === 0 ? 1 : currentScene === 1 ? 1.5 : 1.2,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full opacity-20 blur-[100px]"
        style={{ backgroundColor: '#10B981', width: '40vw', height: '40vw', left: 0, top: 0 }}
        animate={{
          x: currentScene === 0 ? '50vw' : currentScene === 1 ? '-10vw' : '60vw',
          y: currentScene === 0 ? '50vh' : currentScene === 1 ? '10vh' : '60vh',
          scale: currentScene === 0 ? 1.2 : currentScene === 1 ? 1 : 1.8,
        }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />

      {/* Floating Shapes for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-2xl bg-slate-400/5 border border-slate-400/10 backdrop-blur-sm"
            style={{
              width: 40 + (i * 15),
              height: 40 + (i * 15),
              left: `${(i * 13) % 100}vw`,
              top: `${(i * 17) % 100}vh`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 45, 0]
            }}
            transition={{
              duration: 15 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Foreground Titles */}
      <div className="absolute top-[12vh] left-0 right-0 z-10 flex justify-center text-center">
        <AnimatePresence>
          {currentScene === 0 && <Scene1Title key="t1" />}
          {currentScene === 1 && <Scene2Title key="t2" />}
          {currentScene === 2 && <Scene3Title key="t3" />}
        </AnimatePresence>
      </div>

      {/* Persistent UI Window */}
      <motion.div
        className="absolute bg-white/90 backdrop-blur-md shadow-2xl overflow-hidden border border-slate-200/60 z-20 flex flex-col"
        style={{ left: '50%', top: '60%' }}
        initial={{ 
          width: '50vw', 
          height: '40vh', 
          x: '-50%', 
          y: '50vh', 
          rotateX: 20, 
          opacity: 0,
          borderRadius: '24px'
        }}
        animate={{
          x: '-50%',
          y: '-50%',
          width: currentScene === 0 ? '65vw' : currentScene === 1 ? '80vw' : '50vw',
          height: currentScene === 0 ? '50vh' : currentScene === 1 ? '65vh' : '50vh',
          rotateX: currentScene === 0 ? 12 : 0,
          opacity: 1,
          transformPerspective: 1200,
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Window Header */}
        <div className="h-12 bg-slate-100/50 border-b border-slate-200/50 flex items-center px-6 gap-2.5 shrink-0">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-300 shadow-inner" />
          <div className="w-3.5 h-3.5 rounded-full bg-slate-300 shadow-inner" />
          <div className="w-3.5 h-3.5 rounded-full bg-slate-300 shadow-inner" />
        </div>
        
        {/* Window Content */}
        <div className="relative flex-1 bg-slate-50/30 overflow-hidden">
          <AnimatePresence>
            {currentScene === 0 && <Scene1Content key="c1" />}
            {currentScene === 1 && <Scene2Content key="c2" />}
            {currentScene === 2 && <Scene3Content key="c3" />}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
