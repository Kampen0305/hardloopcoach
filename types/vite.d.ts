declare module 'vite' {
  export function defineConfig(config: any): any;
  export function loadEnv(mode: string, root: string, prefix: string): any;
}

