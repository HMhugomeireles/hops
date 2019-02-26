declare module 'hops' {
  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

  export class Miss extends React.Component<any, any> {}

  export interface StatusProps {
    code?: number;
  }
  export class Status extends React.Component<StatusProps, any> {}

  export interface HeaderProps {
    name: string;
    value: string;
  }

  export class Header extends React.Component<HeaderProps, any> {}

  export interface ImportComponentRenderOptions<Props> {
    Component: React.ComponentType<Props>;
    error: boolean;
    loading: boolean;
  }

  export interface ImportComponentOptions<Props> {
    loader?: (load: Promise<any>) => Promise<any>;
    render?: (
      options: ImportComponentRenderOptions<Props> & Props
    ) => React.ReactNode;
  }

  export function importComponent<Props, Exports>(
    load: () => Promise<{ default: React.ComponentType<Props> }>
  ): React.ComponentType<ImportComponentOptions<Props> & Props>;

  export function importComponent<Props, Exports>(
    load: () => Promise<Exports>,
    resolver: (exports: Exports) => React.ComponentType<Props>
  ): React.ComponentType<ImportComponentOptions<Props> & Props>;

  export function importComponent<Props>(
    module: string,
    exportName?: string
  ): React.ComponentType<ImportComponentOptions<Props>>;

  export interface ServerData {
    [key: string]: any;
  }

  export interface Config {
    [key: string]: any;
  }

  export const ServerDataContext: React.Context<ServerData>;

  export const ConfigContext: React.Context<Config>;

  export function withServerData<
    P extends { serverData: C },
    C = ServerData,
    R = Omit<P, 'serverData'>
  >(Component: React.ComponentType<P>): React.ComponentType<R>;

  export function withConfig<
    P extends { config: C },
    C = Config,
    R = Omit<P, 'config'>
  >(Component: React.ComponentType<P>): React.ComponentType<R>;

  export class Mixin {}

  export const strategies: any;

  export function render<P>(
    reactElement: React.ReactElement<P>,
    options?: { [key: string]: any }
  ): void;
}
