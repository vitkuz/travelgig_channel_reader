// @ts-nocheck
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { Post, TelegramConfig } from '../types.js';
import { rateLimiter } from '../utils/rate-limiter.js';

const REQUESTS_PER_SECOND = 20;
const MAX_CONCURRENT = 1;

export const createTelegramClient = (config: TelegramConfig) => {
    const client = new TelegramClient(
        new StringSession(config.sessionString || ''),
        config.apiId,
        config.apiHash,
        { connectionRetries: 5 }
    );

    return {
        connect: () => client.connect(),
        disconnect: () => client.disconnect(),
        getChannelPosts: async (channelName: string, limit = 100): Promise<Post[]> =>
            rateLimiter.add(
                async () => {
                    const channel = await client.getEntity(channelName);
                    const messages = await client.getMessages(channel, { limit });

                    return messages.map(msg => ({
                        id: msg.id,
                        date: msg.date,
                        message: msg.message,
                        channelName
                    }));
                },
                REQUESTS_PER_SECOND,
                MAX_CONCURRENT
            ),
    };
};