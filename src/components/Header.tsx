"use client"
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ModeToggle } from './ModeToggle';

const StickyHeader: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      className={`sticky top-0 z-50 w-full px-8 py-4 backdrop-blur-lg bg-opacity-30 ${
        isScrolled ? 'bg-white/70 dark:bg-gray-900/70' : 'bg-transparent'
      } transition-colors duration-300 shadow-md`}
    >
      <motion.div
        className="container mx-auto flex items-center justify-between"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.03 }}
      >
        {/* Left side: Logo or site name */}
        <motion.h1
          className="text-2xl font-bold"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          whileHover={{ scale: 1.1 }}
        >
          Text Editor
        </motion.h1>
        <motion.div className="flex items-center space-x-4">
            <ModeToggle />
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default StickyHeader;
