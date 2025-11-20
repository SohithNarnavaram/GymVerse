import type { ReactNode } from 'react';
import clsx from 'clsx';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  ...props
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      className={clsx('card', paddingStyles[padding], className)}
      whileHover={hover ? { y: -2 } : undefined}
      transition={hover ? { duration: 0.2 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

