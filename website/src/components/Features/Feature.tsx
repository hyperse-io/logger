import type { ComponentProps, FC, ReactNode } from 'react';
import Link from 'next/link';
import cn from 'clsx';
import { ArrowRightIcon } from '@/components/Icons';
import { MotionDiv } from '../Motion/FramerMotion';
import styles from './style.module.css';

export const Feature: FC<
  {
    large?: boolean;
    centered?: boolean;
    children: ReactNode;
    lightOnly?: boolean;
    href?: string;
    index: number;
  } & ComponentProps<typeof MotionDiv>
> = ({
  large,
  centered,
  children,
  lightOnly,
  className,
  href,
  index,
  ...props
}) => {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: Math.min(0.25 + index * 0.2, 0.8) }}
      className={cn(
        styles.feature,
        large && styles.large,
        centered && styles.centered,
        lightOnly && styles['light-only'],
        className
      )}
      {...props}
    >
      {children}
      {href && (
        <Link
          className={cn('x:focus-visible:nextra-focus', styles.link)}
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          <ArrowRightIcon height="24" />
        </Link>
      )}
    </MotionDiv>
  );
};
