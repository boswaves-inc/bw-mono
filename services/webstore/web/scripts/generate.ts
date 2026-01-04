import { generateDirectusTypes } from 'directus-sdk-typegen';

const main = async () => {
    try {
        const res = await generateDirectusTypes({
            outputPath: './server/directus/schema.ts',
            directusUrl: process.env.CDN_HOST,
            directusToken: process.env.CDN_TOKEN,
        });

        console.log(res)

        console.log('Types successfully generated!');
    } catch (error) {
        console.error('Failed to generate types:', error);

        throw error;
    }
}

main()