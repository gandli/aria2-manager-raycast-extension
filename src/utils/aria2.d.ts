declare module 'aria2' {
    export default class Aria2 {
        constructor(options?: Aria2Options);

        public open(): Promise<void>;
        public close(): Promise<void>;
        public call(method: string, params?: any[], options?: CallOptions): Promise<any>;
        public on(event: string, listener: Function): void;
    }

    interface Aria2Options {
        host?: string;
        port?: number;
        secure?: boolean;
        secret?: string;
        path?: string;
        [key: string]: any;
    }

    interface CallOptions {
        [key: string]: any;
    }
}
