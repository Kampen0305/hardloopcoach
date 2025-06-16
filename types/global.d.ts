declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react';
declare module 'react/jsx-runtime';
declare module 'react-dom/client';
declare module '@google/genai';
declare module 'path';
declare module 'vite';

interface ProcessEnv {
  [key: string]: string | undefined;
}
declare var process: { env: ProcessEnv };
declare var __dirname: string;

