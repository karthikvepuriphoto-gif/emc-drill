import type { ReactNode } from "react";

type Back = {
  href: string;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function Nav({
  title,
  back,
  trailing,
}: {
  title: string;
  back?: Back;
  trailing?: ReactNode;
}) {
  return (
    <header className="nav">
      <div className="nav-side">
        {back ? (
          <a className="nav-back" href={back.href} onClick={back.onClick}>
            <svg viewBox="0 0 12 20" aria-hidden="true" className="chev">
              <path
                d="M10 2 L2 10 L10 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{back.label}</span>
          </a>
        ) : null}
      </div>
      <h1 className="nav-title">{title}</h1>
      <div className="nav-side nav-trail">{trailing}</div>
    </header>
  );
}
