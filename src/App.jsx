import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cpu, Fingerprint, Maximize, Minimize, Palette, Terminal, Zap } from 'lucide-react';

function DecryptedText({
  text,
  delay = 0,
  className = '',
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'
}) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let iteration = 0;
    let interval = null;
    const timer = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((letter, index) => {
              if (letter === ' ') return ' ';
              if (index < iteration) return letter;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          window.clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [text, delay, chars]);

  return <span className={className}>{displayText || text.replace(/\S/g, '_')}</span>;
}

function ParticleGrid({ color }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
      <div
        className="absolute inset-0 animate-[pulse_4s_ease-in-out_infinite]"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${color} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 bg-black/80" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(90deg, ${color}18 1px, transparent 1px), linear-gradient(${color}12 1px, transparent 1px)`,
          backgroundSize: '120px 120px'
        }}
      />
    </div>
  );
}

const THEMES = {
  acid: {
    id: 'acid',
    name: 'Acid Web3',
    primary: '#39FF14',
    secondary: '#00F3FF',
    bg: '#050505',
    font: 'font-mono',
    titleAlign: 'items-center text-center',
    watermarkClass: 'text-[#39FF14] opacity-5 rotate-[-30deg]'
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Node',
    primary: '#00F3FF',
    secondary: '#FF00FF',
    bg: '#0a0a12',
    font: 'font-sans tracking-widest',
    titleAlign: 'items-start text-left border-l-8 pl-8',
    watermarkClass: 'text-[#00F3FF] opacity-[0.035] rotate-0 scale-150'
  }
};

const reportData = {
  title: 'AI CURATION & QUANTUM NODES',
  subtitle: 'Next-Gen Infrastructure Presentation',
  presenter: 'NJU Physics & AI Lab',
  date: 'May 2026',
  watermarkText: 'NJU_AI_CONFIDENTIAL'
};

const slideVariants = {
  enter: direction => ({ x: direction > 0 ? 1000 : -1000, opacity: 0, filter: 'blur(20px)' }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 250, damping: 25 }
  },
  exit: direction => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    filter: 'blur(20px)',
    transition: { type: 'spring', stiffness: 250, damping: 25 }
  })
};

export default function Web3GeekDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [activeTheme, setActiveTheme] = useState(THEMES.acid);
  const [showWatermark, setShowWatermark] = useState(true);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        setDirection(1);
        setCurrentSlide(previous => Math.min(previous + 1, 2));
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        setDirection(-1);
        setCurrentSlide(previous => Math.max(previous - 1, 0));
      } else if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function toggleTheme() {
    setActiveTheme(previous => (previous.id === 'acid' ? THEMES.cyber : THEMES.acid));
  }

  function renderSlide() {
    switch (currentSlide) {
      case 0:
        return (
          <motion.div
            className={`z-10 flex h-full w-full flex-col justify-center ${activeTheme.titleAlign}`}
            style={{ borderColor: activeTheme.secondary }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6" style={{ color: activeTheme.primary }}>
              <Zap size={activeTheme.id === 'acid' ? 80 : 60} className={activeTheme.id === 'acid' ? 'mx-auto' : ''} />
            </div>
            <h1
              className={`mb-6 text-6xl font-black uppercase drop-shadow-2xl md:text-8xl ${activeTheme.font}`}
              style={{ color: activeTheme.primary }}
            >
              <DecryptedText text={reportData.title} delay={200} />
            </h1>
            <p className="mb-12 text-2xl font-light text-gray-400">
              <DecryptedText text={reportData.subtitle} delay={800} />
            </p>
            <div
              className={`inline-block border bg-white/5 px-8 py-4 backdrop-blur-md ${
                activeTheme.id === 'acid' ? 'mx-auto rounded-full' : 'rounded-none'
              }`}
              style={{ borderColor: `${activeTheme.secondary}80` }}
            >
              <p className="mb-1 text-lg text-white">
                PRESENTER: <span style={{ color: activeTheme.secondary }}>{reportData.presenter}</span>
              </p>
              <p className="text-sm text-gray-500">DATE: {reportData.date}</p>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <div className="z-10 grid h-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <motion.div className="space-y-6" initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }}>
              <h2
                className={`mb-8 border-l-4 pl-4 text-4xl font-bold uppercase ${activeTheme.font}`}
                style={{ color: activeTheme.primary, borderColor: activeTheme.secondary }}
              >
                Architecture
              </h2>
              <p className="border border-white/5 bg-black/40 p-6 text-lg leading-relaxed text-gray-300 shadow-lg">
                基于物理实验模型的态演化公式 iℏ∂Ψ/∂t = HΨ 已集成至张量处理流。
              </p>
              <ul className="space-y-4">
                {['智能合约确权', '零知识证明层', '分布式 AI 生成'].map((item, index) => (
                  <motion.li
                    key={item}
                    whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className="flex items-center space-x-4 border border-white/10 p-4 text-gray-300 transition-all"
                  >
                    <Terminal size={20} style={{ color: activeTheme.secondary }} />
                    <DecryptedText text={item} delay={index * 150} />
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="flex h-[400px] items-center justify-center border border-white/10 bg-black/50"
              initial={{ opacity: 0, scale: 0.78 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Cpu size={120} style={{ color: activeTheme.primary }} className="animate-pulse" />
            </motion.div>
          </div>
        );
      case 2:
        return (
          <div className="z-10 flex h-full flex-col items-center justify-center text-center">
            <h2 className={`text-5xl font-bold ${activeTheme.font}`} style={{ color: activeTheme.primary }}>
              EOF // SYSTEM OFFLINE
            </h2>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div
      className="relative h-screen w-screen overflow-hidden text-white transition-colors duration-700"
      style={{ backgroundColor: activeTheme.bg }}
    >
      <ParticleGrid color={activeTheme.primary} />

      {showWatermark && (
        <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
          <span className={`whitespace-nowrap text-[15vw] font-black uppercase transition-all duration-1000 ${activeTheme.watermarkClass}`}>
            {reportData.watermarkText}
          </span>
        </div>
      )}

      <header className="absolute left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="flex items-center gap-3 font-mono text-sm tracking-widest" style={{ color: activeTheme.primary }}>
          <span className="h-2.5 w-2.5 animate-pulse rounded-full" style={{ backgroundColor: activeTheme.primary }} />
          WebPPT Engine v3.0
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map(index => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                setDirection(index >= currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className="h-1.5 w-12 overflow-hidden bg-white/10"
            >
              {index === currentSlide && (
                <motion.div layoutId="progress" className="h-full w-full" style={{ backgroundColor: activeTheme.secondary }} />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="relative flex h-full w-full items-center justify-center px-24 pt-20">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 mx-auto flex w-full max-w-7xl flex-col justify-center p-24"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-8 right-8 z-50 flex gap-4 rounded-2xl border border-white/10 bg-black/60 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={toggleTheme}
          title={`切换主题：${activeTheme.name}`}
          className="group rounded-xl p-3 transition-colors hover:bg-white/10"
        >
          <Palette size={20} className="text-gray-400 group-hover:text-white" />
        </button>
        <button
          type="button"
          onClick={() => setShowWatermark(previous => !previous)}
          title="切换水印"
          className={`group rounded-xl p-3 transition-colors ${showWatermark ? 'bg-white/10' : 'hover:bg-white/10'}`}
        >
          <Fingerprint size={20} className={showWatermark ? 'text-white' : 'text-gray-400'} />
        </button>
        <div className="mx-2 h-8 w-px self-center bg-white/20" />
        <button
          type="button"
          onClick={toggleFullscreen}
          title="全屏演示"
          className="group rounded-xl p-3 transition-colors hover:bg-white/10"
        >
          {isFullscreen ? (
            <Minimize size={20} className="text-gray-400 group-hover:text-white" />
          ) : (
            <Maximize size={20} className="text-gray-400 group-hover:text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
