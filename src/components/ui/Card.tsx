import React from 'react';
import { cn } from '../../utils/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-3xl border-0 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };