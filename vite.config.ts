/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'
// 包大小分析
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig((config) => {
    const base = config.command === 'build' ? 'https://power-cli.oss-cn-shenzhen.aliyuncs.com/poster-web/' : '/'
    if (config.command === 'build') {
        process.env.NODE_ENV = 'production'
    }

    return {
        base,
        // publicDir: '/assets',
        server: {
            proxy: {
                '/api': {
                    target: 'http://127.0.0.1:7002',
                    // target: 'http://182.92.168.192:8081',
                    changeOrigin: true,
                    // rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
        plugins: [
            vue({}),
            vueJsx(),
            visualizer(),
            Components({
                resolvers: [
                    AntDesignVueResolver({
                        importStyle: false, // css in js
                    }),
                ],
            }),
        ],
        test: {
            globals: true,
            environment: 'jsdom',
        },
        // 清除debugger
        esbuild: {
            drop: ['console', 'debugger'],
        },
        build: {
            // target: 'es2015',
            chunkSizeWarningLimit: 600,
            rollupOptions: {
                output: {
                    manualChunks: {
                        'ant-design-vue': ['ant-design-vue'],
                    },
                },
            },
        },
    }
})
