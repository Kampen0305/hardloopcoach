declare module 'react' {
  namespace React {
    export type FC<P = any> = (props: any) => any;
    export type ReactNode = any;
    export interface FormEvent<T = Element> extends Event {
      target: T;
    }
    export function useState<T>(initial: T): [T, (v: T) => void];
    export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T;
    export const StrictMode: any;
  }
  export = React;
}


