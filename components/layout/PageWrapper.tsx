import {FC, ReactNode} from 'react';

interface PageWrapperProps {
  children: ReactNode;
  center?: boolean;
  className?: string;
}

export const PageWrapper: FC<PageWrapperProps> = ({ children, center = false, className = '' }) => {
  const baseClasses = 'min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-white py-12';
  const centerClasses = center ? 'flex items-center justify-center' : '';
  return <div className={`${baseClasses} ${centerClasses} ${className}`}>{children}</div>;
};
