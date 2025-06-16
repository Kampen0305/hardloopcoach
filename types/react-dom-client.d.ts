declare module 'react-dom/client' {
  export function createRoot(element: Element | DocumentFragment): { render: (e: any) => void };
}

