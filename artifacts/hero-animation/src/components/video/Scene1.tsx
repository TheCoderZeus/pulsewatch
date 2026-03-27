import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene1Title() {
  return (
    <motion.h1 
      className="text-[6vw] leading-tight font-display font-bold tracking-tight text-slate-900 absolute w-full"
      {...sceneTransitions.slideUp}
    >
      Shared <span className="text-indigo-500">workspaces</span>
    </motion.h1>
  );
}

export function Scene1Content() {
  return (
    <motion.div 
      className="absolute inset-0 p-8 flex flex-col gap-6 bg-slate-50/50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex gap-6 h-[12vh]">
        <motion.div 
          className="w-1/3 bg-indigo-100/50 rounded-xl border border-indigo-100 shadow-sm" 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        />
        <motion.div 
          className="w-1/3 bg-white rounded-xl border border-slate-100 shadow-sm" 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        />
        <motion.div 
          className="w-1/3 bg-white rounded-xl border border-slate-100 shadow-sm" 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        />
      </div>
      <motion.div 
        className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex p-6 gap-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      >
         <div className="w-[12vw] h-full bg-slate-50 rounded-lg flex flex-col gap-3 p-4 border border-slate-100">
            <div className="w-full h-3 bg-slate-200 rounded-md" />
            <div className="w-2/3 h-3 bg-slate-200 rounded-md" />
            <div className="w-full h-3 bg-slate-200 rounded-md mt-4" />
         </div>
         <div className="flex-1 flex flex-col gap-4">
            <div className="w-[10vw] h-6 bg-slate-100 rounded-lg" />
            <div className="w-full h-[15vh] bg-slate-50 rounded-lg border border-slate-100" />
         </div>
      </motion.div>
    </motion.div>
  );
}
