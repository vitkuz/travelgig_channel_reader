import { RateLimitedTask } from '../types';

const createQueue = () => {
    const queue: RateLimitedTask[] = [];
    let processing = false;

    const processQueue = async (requestsPerSecond: number, maxConcurrent: number) => {
        if (processing || queue.length === 0) return;
        processing = true;

        while (queue.length > 0) {
            const batch = queue.splice(0, maxConcurrent);
            await Promise.all(
                batch.map(async ({ task, resolve, reject }) => {
                    try {
                        const result = await task();
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                })
            );
            await new Promise(resolve => setTimeout(resolve, 1000 / requestsPerSecond));
        }

        processing = false;
    };

    return {
        add: <T>(
            task: () => Promise<T>,
            requestsPerSecond: number,
            maxConcurrent: number
        ): Promise<T> =>
            new Promise((resolve, reject) => {
                queue.push({ task, resolve, reject } as RateLimitedTask);
                processQueue(requestsPerSecond, maxConcurrent);
            }),
    };
};

export const rateLimiter = createQueue();