import type { FC, ReactNode } from 'react';
import styles from './style.module.css';

export const Features: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={styles.features}>{children}</div>;
};
