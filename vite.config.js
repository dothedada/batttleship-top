import Inspect from 'vite-plugin-inspect';
import { createHtmlPlugin } from 'vite-plugin-html';

export default {
    publicDir: './src/public/',
    base: '/batttleship-top/',
    plugins: [
        Inspect(),
        createHtmlPlugin({
            minify: true,
            template: './src/index.html',
        }),
    ],
};
