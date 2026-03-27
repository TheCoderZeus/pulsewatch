import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';
import { useEffect, useState } from 'react';
import { Cursor } from './Cursor';

export function Scene2Title() {
  return (
    <motion.h1 
      className="text-[6vw] leading-tight font-display font-bold tracking-tight text-slate-900 absolute w-full"
      {...sceneTransitions.slideUp}
    >
      Real-time <span className="text-emerald-500">sync</span>
    </motion.h1>
  );
}

export function Scene2Content() {
  const [showCursors, setShowCursors] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCursors(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-slate-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* The Kanban Board Column */}
      <div className="w-[40vw] max-w-xl bg-slate-100/80 p-6 rounded-2xl flex flex-col gap-4 border border-slate-200 shadow-inner relative">
        <div className="flex justify-between items-center px-2 mb-2">
          <span className="font-semibold text-slate-700 text-lg">In Progress</span>
          <span className="bg-slate-200 text-slate-600 text-sm px-3 py-1 rounded-full">3</span>
        </div>
        
        {/* Main Active Card */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 relative z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 20 }}
        >
          <div className="flex gap-2 mb-1">
             <div className="w-16 h-2.5 bg-indigo-200 rounded-full" />
             <div className="w-10 h-2.5 bg-pink-200 rounded-full" />
          </div>
          <h3 className="font-semibold text-xl text-slate-800">Design System V2</h3>
          <p className="text-slate-500">Update the core component library to support the new brand guidelines.</p>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex -space-x-2">
               <Avatar initials="JD" color="bg-indigo-500" delay={0.4} />
               <Avatar initials="SK" color="bg-pink-500" delay={0.5} />
               <Avatar initials="AL" color="bg-emerald-500" delay={0.6} />
            </div>
            <div className="text-sm font-medium text-slate-400">Due Tomorrow</div>
          </div>

          {/* Cursors */}
          {showCursors && (
            <>
              <motion.div
                className="absolute z-50"
                style={{ top: '20%', left: '10%' }}
                initial={{ x: -300, y: 200, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: "backOut" }}
              >
                <Cursor color="#EC4899" name="Sarah" />
              </motion.div>
              <motion.div
                className="absolute z-50"
                style={{ top: '65%', left: '85%' }}
                initial={{ x: 200, y: 150, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: "backOut", delay: 0.2 }}
              >
                <Cursor color="#10B981" name="Alex" />
              </motion.div>
              <motion.div
                className="absolute z-50"
                style={{ top: '45%', left: '55%' }}
                initial={{ x: 100, y: 300, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 1.3, ease: "backOut", delay: 0.4 }}
              >
                <Cursor color="#6366F1" name="John" />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Other inactive card */}
        <motion.div 
          className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 opacity-60"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.6 }}
          transition={{ delay: 0.3, type: 'spring', damping: 20 }}
        >
          <div className="w-20 h-2.5 bg-amber-200 rounded-full mb-4" />
          <div className="w-3/4 h-5 bg-slate-200 rounded-md mb-3" />
          <div className="w-1/2 h-5 bg-slate-200 rounded-md" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function Avatar({ initials, color, delay }: { initials: string, color: string, delay: number }) {
  return (
    <motion.div 
      className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm ${color}`}
      initial={{ scale: 0, x: -10 }}
      animate={{ scale: 1, x: 0 }}
      transition={{ delay, type: 'spring', stiffness: 400, damping: 15 }}
    >
      {initials}
    </motion.div>
  );
}
