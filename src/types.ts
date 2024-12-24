export interface Post {
    id: number;
    date: Date;
    message: string;
    channelName: string;
}

export interface TelegramConfig {
    apiId: number;
    apiHash: string;
    sessionString?: string;
}

export interface RateLimitedTask {
    task: () => Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
}