import type { ReactNode } from 'react';

interface ButtonProps {
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'inverted';
  size?: 'default' | 'micro';
  icon?: 'arrow-up-right' | 'arrow-down';
  className?: string;
  children: ReactNode;
  target?: string;
  rel?: string;
}

const ArrowUpRight = () => (
  <span className="btn-icon-inner">
    <span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.77557 0.454545H11.8523V9.46023H10.2926L10.3551 3.16051L2.07102 11.3494Z" fill="currentColor"/>
      </svg>
    </span>
    <span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.77557 0.454545H11.8523V9.46023H10.2926L10.3551 3.16051L2.07102 11.3494Z" fill="currentColor"/>
      </svg>
    </span>
  </span>
);

const ArrowDown = () => (
  <svg className="btn-icon-down" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 11L6 1M6 11L10 7.5M6 11L2 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
  </svg>
);

export default function Button({
  href,
  type = 'button',
  variant = 'primary',
  size = 'default',
  icon = 'arrow-up-right',
  className = '',
  children,
  target,
  rel,
}: ButtonProps) {
  const classes = [
    'btn',
    variant === 'secondary' ? 'btn-secondary' : '',
    variant === 'inverted' ? 'btn-inverted' : '',
    size === 'micro' ? 'btn-micro' : '',
    className,
  ].filter(Boolean).join(' ');

  const iconEl = (
    <span className="btn-icon">
      {icon === 'arrow-up-right' ? <ArrowUpRight /> : <ArrowDown />}
    </span>
  );

  if (href) {
    return (
      <a href={href} className={classes} target={target} rel={rel}>
        <span>{children}</span>
        {iconEl}
      </a>
    );
  }

  return (
    <button type={type} className={classes}>
      <span>{children}</span>
      {iconEl}
    </button>
  );
}
