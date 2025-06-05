import React from 'react';

export default function LinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href}>
      <button className="LinkButton" role="link">
        {children}
      </button>
    </a>
  );
}
