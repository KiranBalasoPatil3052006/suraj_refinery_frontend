import React from 'react';

interface AppMenuIconProps {
  className?: string;
  size?: number;
}

/**
 * AppMenuIcon — Renders the exact 3-block sidebar/layout icon provided by the user:
 * Two stacked rounded squares on the left, and one vertical rounded rectangle on the right.
 */
export const AppMenuIcon: React.FC<AppMenuIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Top Left Square */}
      <rect x="3" y="3" width="7" height="7" rx="2" />
      {/* Bottom Left Square */}
      <rect x="3" y="14" width="7" height="7" rx="2" />
      {/* Right Tall Vertical Rectangle */}
      <rect x="14" y="3" width="7" height="18" rx="2" />
    </svg>
  );
};
