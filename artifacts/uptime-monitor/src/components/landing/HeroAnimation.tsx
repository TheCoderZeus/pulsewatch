import { motion } from "framer-motion";
import { StatusIndicator } from "../ui/StatusIndicator";

export function HeroAnimation() {
  return (
    <div className="relative w-full max-w-3xl mx-auto h-[400px] flex items-center justify-center perspective-[1000px]">
      {/* Background glow using the generated image */}
      <img 
        src={`${import.meta.env.BASE_URL}images/hero-glow.png`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-50 blur-3xl mix-blend-screen"
      />
      
      <motion.div 
        initial={{ rotateX: 20, rotateY: -10, scale: 0.9, opacity: 0 }}
        animate={{ rotateX: 0, rotateY: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl glass-panel rounded-2xl p-6"
      >
        {/* Fake Mac Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-warning/80" />
          <div className="w-3 h-3 rounded-full bg-success/80" />
        </div>

        {/* Fake Monitors */}
        <div className="space-y-4">
          {[
            { name: "Production API", url: "api.company.com", time: "42ms", up: "99.99%" },
            { name: "Payment Gateway", url: "stripe-proxy.internal", time: "115ms", up: "100%" },
            { name: "Website Frontend", url: "www.company.com", time: "28ms", up: "99.95%" },
          ].map((monitor, i) => (
            <motion.div 
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + (i * 0.1), duration: 0.6 }}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-white/5"
            >
              <div className="flex items-center gap-4">
                <StatusIndicator status="up" size="md" pulse={true} />
                <div>
                  <h4 className="font-medium text-foreground">{monitor.name}</h4>
                  <p className="text-xs text-muted-foreground">{monitor.url}</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-foreground">{monitor.time}</div>
                <div className="text-xs text-success">{monitor.up} Uptime</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Stat Badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 20 }}
          className="absolute -right-8 -bottom-8 bg-success text-success-foreground px-6 py-4 rounded-2xl shadow-xl shadow-success/20 border border-white/20"
        >
          <div className="text-sm font-medium opacity-90">Global Network Status</div>
          <div className="text-2xl font-display font-bold">All Systems Operational</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
