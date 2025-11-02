import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  title?: string;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const { title, ...rest } = props;

  const icons: { [key: string]: React.ReactNode } = {
    templates: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
    text: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    image: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    shapes: <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />,
    sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 2 2-4 5.293-5.293a1 1 0 011.414 0z" />,
    palette: <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    'git-branch': <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v12m0 0l4 4m-4-4L2 15m4 0V3m12 12v-3a3 3 0 00-3-3H9" />,
    puzzle: <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />,
    save: <path strokeLinecap="round" strokeLinejoin="round" d="M17 16v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2M17 16V6l-3-3H9a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2zM5 16h14M9 3v4h6V3" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 8m4-4v12" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    logo: <path d="M12 14.25c-3.14 0-6-1.66-6-4.5 0-2.49 2.01-4.5 4.5-4.5 1.51 0 2.87.67 3.75 1.75-.42.49-.75 1.06-.75 1.75 0 1.24 1.01 2.25 2.25 2.25.79 0 1.48-.41 1.88-1.03A5.996 5.996 0 0118 9.75c0 2.84-2.86 4.5-6 4.5z" />,
    minus: <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
    eye: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
    wand: <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104l-1.392 4.176 4.176-1.392L18 11.25l-5.364 5.364-5.364-5.364L9.75 3.104zm0 0L6.358 7.28l-4.176 1.392L7.5 14l5.364 5.364L18.228 8.642 16.836 4.5 9.75 3.104z" />,
    loader: <><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9a8 8 0 0111.41-6.912M20 15a8 8 0 01-11.41 6.912" /></>,
    x: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    drive: <><path d="M2.05 6.05a1 1 0 0 1 .89-.55h18.12a1 1 0 0 1 .89.55l-2.88 11.9a1 1 0 0 1-.9.6H5.82a1 1 0 0 1-.9-.6L2.05 6.05Z" /><path d="m8 6-2.5 12" /><path d="m16 6 2.5 12" /><path d="M12 11.5 6.5 6" /><path d="m12 11.5 5.5-5.5" /></>,
    slack: <><path d="M12.5 9.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z" /><path d="M17.5 14.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z" /><path d="M6.5 9.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z" /><path d="M11.5 14.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z" /><path d="M14 9.5h-2.5m5 5H14m-5-5H9m-2.5 5H9" /></>,
    figma: <path d="M6 12a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6h0a6 6 0 0 0-6-6h-2a6 6 0 0 0-6 6h0a6 6 0 0 0 6 6" />,
    dropbox: <><path d="m10 3-8 5 8 5 8-5-8-5Z" /><path d="m2 13 8 5 8-5" /><path d="m2 8 8 5 8-5" /></>,
    connect: <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
    instagram: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></>,
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></>,
    tiktok: <path d="M12 12a4 4 0 1 0 4 4V8a8 8 0 1 1-8-8" />,
    twitter: <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21A12.92 12.92 0 0 0 21.1 7.89c0-.2 0-.4-.02-.6.94-.69 1.75-1.54 2.38-2.5z" />,
    meta: <path fill="currentColor" d="M14.5 10.4a4.5 4.5 0 1 0-8.9 1.2 4.5 4.5 0 1 0 8.9-1.2z" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
    'check-circle': <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    rocket: <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V17.625c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875V6.375c0-1.036-.84-1.875-1.875-1.875H3.375zM9 12l-4.25 4.25M9 12l4.25 4.25M9 12v4.25m0-9l-4.25-4.25M9 7.75l4.25-4.25M9 7.75V3.5" />,
    server: <><ellipse cx="12" cy="6" rx="8" ry="3"></ellipse><path d="M4 6v6a8 3 0 0 0 16 0V6"></path><path d="M4 12v6a8 3 0 0 0 16 0v-6"></path></>,
    'clipboard-list': <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 8h.01M12 12h.01M15 12h.01M9 17h.01M12 17h.01M15 17h.01" />,
    circle: <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />,
    info: <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    checklist: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    pinterest: <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.633 7.855 6.356 9.312-.084-.6-.164-1.543.023-2.31.196-.811 1.23-5.213 1.23-5.213s-.308-.616-.308-1.527c0-1.432.83-2.502 1.86-2.502.875 0 1.29.656 1.29 1.446 0 .88-.56 2.196-.856 3.424-.247 1.026.516 1.86 1.522 1.86 1.822 0 3.23-1.92 3.23-4.704 0-2.48-1.742-4.28-4.413-4.28-2.95 0-4.66 2.196-4.66 4.413 0 .86.326 1.78.736 2.32.08.105.09.186.06.29-.07.25-.237.954-.27.112-.038.156-.15.2-1.04-.3-2.023-1.956-2.023-4.426 0-3.66 2.76-6.73 6.955-6.73 3.75 0 5.86 2.76 5.86 5.625 0 3.87-2.39 6.88-5.69 6.88-1.15 0-2.25-.586-2.62-1.284 0 0-.56 2.24-.686 2.707-.19.74-.736 1.63-1.11 2.207A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>,
    // FIX: Add chevron icons
    'chevron-left': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />,
    'chevron-right': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />,
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...rest}>
      {title && <title>{String(title)}</title>}
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};