import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface PageLayoutProps {
  children: React.ReactNode;
  innerClassName?: string;
  gradientFrom?: string;
  backgroundElement?: React.ReactNode;
  disableScroll?: boolean;
}

const PageLayout = ({ children, innerClassName = '', gradientFrom = 'from-primary/5', backgroundElement, disableScroll = false }: PageLayoutProps) => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(container.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: container });

  return (
    <div className={`w-full flex flex-col items-center justify-center p-4 md:p-8 bg-background text-on-background font-body-md overflow-x-hidden ${disableScroll ? 'fixed inset-0 overflow-y-hidden overscroll-none' : 'relative min-h-[100dvh] overflow-y-auto'}`}>
      <div className="absolute inset-0 z-0 bg-background pointer-events-none fixed">
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${gradientFrom} via-background to-background`}></div>
        {backgroundElement}
      </div>

      <div ref={container} className={`relative z-10 w-full max-w-lg mx-auto flex flex-col items-center justify-center py-2 md:py-8 opacity-100 ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
