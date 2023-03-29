import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(mode => ({
    plugins: [react()],
    base: './',
    server: {
        proxy: {
            ['/api']: {
                target: 'http://127.0.0.1:3000',
            },
        },
    },
    preview: {
        proxy: {
            ['/api']: {
                target: 'http://127.0.0.1:3000',
            },
        },
        strictPort: true,
        host: '0.0.0.0',
        port: 80,
    },
}));
