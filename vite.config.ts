import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const MESSAGE_API_URL = 'http://127.0.0.1:3000';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            ['/api']: {
                target: MESSAGE_API_URL,
            },
        },
    },
});
