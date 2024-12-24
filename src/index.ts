import { createTelegramClient } from './services/telegram.js';

const fetchPosts = async () => {
    const telegram = createTelegramClient({
        sessionString: process.env.SESSSION,
        apiId: Number(process.env.APP_ID),
        apiHash: process.env.API_HASH!
    });

    try {
        await telegram.connect();
        console.log('Fetching posts from channels:');

        const allPosts = await Promise.all(
            [
                'globaltravelhub',
                'serge_ai',
            ].map(channel =>
                telegram.getChannelPosts(channel)
            )
        );

        const posts = allPosts.flat().filter(post => post.message);
        console.log(`Found ${posts.length} total posts from ${2} channels`);

        posts.forEach(post => {
            console.log('\n-------------------');
            console.log(post);
        });

        return posts;
    } finally {
        await telegram.disconnect();
    }
};

fetchPosts().catch(error => {
    console.error('Error fetching posts:', error);
    process.exit(1);
});