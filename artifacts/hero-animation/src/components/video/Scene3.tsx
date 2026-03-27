import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene3Title() {
  return (
    <motion.h1 
      className="text-[6vw] leading-tight font-display font-bold tracking-tight text-slate-900 absolute w-full"
      {...sceneTransitions.slideUp}
    >
      Move faster <span className="text-pink-500">together</span>
    </motion.h1>
  );
}

export function Scene3Content() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-slate-50/50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      <motion.div 
        className="bg-white p-12 rounded-2xl shadow-xl border border-emerald-100 flex flex-col items-center justify-center gap-8 relative w-[35vw] max-w-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", damping: 20 }}
      >
        {/* Success Circle */}
        <motion.div 
          className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center shadow-inner"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", damping: 15 }}
        >
          <motion.div
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", damping: 12 }}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <motion.path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3.5} 
                d="M5 13l4 4L19 7" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>

        <div className="text-center z-10">
          <motion.h2 
            className="text-4xl font-bold text-slate-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Task Completed
          </motion.h2>
          <motion.p 
            className="text-slate-500 mt-4 text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Design System V2 is now ready.
          </motion.p>
        </div>

        {/* Confetti Particles */}
        <Confetti />
      </motion.div>
    </motion.div>
  );
}

function Confetti() {
  const particles = Array.from({ length: 24 });
  const colors = ['bg-pink-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500'];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2 + (Math.random() * 0.5);
        const velocity = 200 + Math.random() * 150;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        return (
          <motion.div
            key={i}
            className={`absolute w-4 h-4 rounded-full shadow-sm ${colors[i % colors.length]}`}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ 
              x: tx, 
              y: ty + 100, 
              scale: [0, 1.2, 0],
              opacity: [1, 1, 0] 
            }}
            transition={{ 
              delay: 0.7, 
              duration: 1.5 + Math.random() * 0.5, 
              ease: "easeOut" 
            }}
          />
        );
      })}
    </div>
  );
}
