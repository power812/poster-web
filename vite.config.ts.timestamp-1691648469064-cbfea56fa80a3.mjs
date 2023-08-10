// vite.config.ts
import { defineConfig } from "file:///Users/power/Documents/front-end-developer/poster-web/node_modules/.pnpm/vite@4.3.2_@types+node@20.2.4_sass@1.62.1/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/power/Documents/front-end-developer/poster-web/node_modules/.pnpm/@vitejs+plugin-vue@4.1.0_vite@4.3.2_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///Users/power/Documents/front-end-developer/poster-web/node_modules/.pnpm/unplugin-vue-components@0.24.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/vite.mjs";
import { AntDesignVueResolver } from "file:///Users/power/Documents/front-end-developer/poster-web/node_modules/.pnpm/unplugin-vue-components@0.24.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import vueJsx from "file:///Users/power/Documents/front-end-developer/poster-web/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.0.1_vite@4.3.2_vue@3.3.4/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { visualizer } from "file:///Users/power/Documents/front-end-developer/poster-web/node_modules/.pnpm/rollup-plugin-visualizer@5.9.2/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var vite_config_default = defineConfig((config) => {
  if (config.command === "build") {
    process.env.NODE_ENV = "production";
  }
  return {
    base: "./",
    // publicDir: '/dist/assets',
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:7002",
          // target: 'http://182.92.168.192:8081',
          changeOrigin: true
          // rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    plugins: [
      vue({}),
      vueJsx(),
      visualizer(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false
            // css in js
          })
        ]
      })
    ],
    test: {
      globals: true,
      environment: "jsdom"
    },
    // 清除debugger
    esbuild: {
      drop: ["console", "debugger"]
    },
    build: {
      target: "es5",
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            "ant-design-vue": ["ant-design-vue"]
          }
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcG93ZXIvRG9jdW1lbnRzL2Zyb250LWVuZC1kZXZlbG9wZXIvcG9zdGVyLXdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3Bvd2VyL0RvY3VtZW50cy9mcm9udC1lbmQtZGV2ZWxvcGVyL3Bvc3Rlci13ZWIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3Bvd2VyL0RvY3VtZW50cy9mcm9udC1lbmQtZGV2ZWxvcGVyL3Bvc3Rlci13ZWIvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHsgQW50RGVzaWduVnVlUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG4vLyBcdTUzMDVcdTU5MjdcdTVDMEZcdTUyMDZcdTY3OTBcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKGNvbmZpZykgPT4ge1xuICAgIC8vIGNvbnN0IGJhc2UgPSBjb25maWcuY29tbWFuZCA9PT0gJ2J1aWxkJyA/ICcvcG9zdGVyLXdlYicgOiAnLydcbiAgICBpZiAoY29uZmlnLmNvbW1hbmQgPT09ICdidWlsZCcpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPSAncHJvZHVjdGlvbidcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBiYXNlOiAnLi8nLFxuICAgICAgICAvLyBwdWJsaWNEaXI6ICcvZGlzdC9hc3NldHMnLFxuICAgICAgICBzZXJ2ZXI6IHtcbiAgICAgICAgICAgIHByb3h5OiB7XG4gICAgICAgICAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6NzAwMicsXG4gICAgICAgICAgICAgICAgICAgIC8vIHRhcmdldDogJ2h0dHA6Ly8xODIuOTIuMTY4LjE5Mjo4MDgxJyxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAvLyByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICB2dWUoe30pLFxuICAgICAgICAgICAgdnVlSnN4KCksXG4gICAgICAgICAgICB2aXN1YWxpemVyKCksXG4gICAgICAgICAgICBDb21wb25lbnRzKHtcbiAgICAgICAgICAgICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgQW50RGVzaWduVnVlUmVzb2x2ZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0U3R5bGU6IGZhbHNlLCAvLyBjc3MgaW4ganNcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgICB0ZXN0OiB7XG4gICAgICAgICAgICBnbG9iYWxzOiB0cnVlLFxuICAgICAgICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIFx1NkUwNVx1OTY2NGRlYnVnZ2VyXG4gICAgICAgIGVzYnVpbGQ6IHtcbiAgICAgICAgICAgIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxuICAgICAgICB9LFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgdGFyZ2V0OiAnZXM1JyxcbiAgICAgICAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNjAwLFxuICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhbnQtZGVzaWduLXZ1ZSc6IFsnYW50LWRlc2lnbi12dWUnXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLFlBQVk7QUFFbkIsU0FBUyxrQkFBa0I7QUFHM0IsSUFBTyxzQkFBUSxhQUFhLENBQUMsV0FBVztBQUVwQyxNQUFJLE9BQU8sWUFBWSxTQUFTO0FBQzVCLFlBQVEsSUFBSSxXQUFXO0FBQUEsRUFDM0I7QUFFQSxTQUFPO0FBQUEsSUFDSCxNQUFNO0FBQUE7QUFBQSxJQUVOLFFBQVE7QUFBQSxNQUNKLE9BQU87QUFBQSxRQUNILFFBQVE7QUFBQSxVQUNKLFFBQVE7QUFBQTtBQUFBLFVBRVIsY0FBYztBQUFBO0FBQUEsUUFFbEI7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ0wsSUFBSSxDQUFDLENBQUM7QUFBQSxNQUNOLE9BQU87QUFBQSxNQUNQLFdBQVc7QUFBQSxNQUNYLFdBQVc7QUFBQSxRQUNQLFdBQVc7QUFBQSxVQUNQLHFCQUFxQjtBQUFBLFlBQ2pCLGFBQWE7QUFBQTtBQUFBLFVBQ2pCLENBQUM7QUFBQSxRQUNMO0FBQUEsTUFDSixDQUFDO0FBQUEsSUFDTDtBQUFBLElBQ0EsTUFBTTtBQUFBLE1BQ0YsU0FBUztBQUFBLE1BQ1QsYUFBYTtBQUFBLElBQ2pCO0FBQUE7QUFBQSxJQUVBLFNBQVM7QUFBQSxNQUNMLE1BQU0sQ0FBQyxXQUFXLFVBQVU7QUFBQSxJQUNoQztBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0gsUUFBUTtBQUFBLE1BQ1IsdUJBQXVCO0FBQUEsTUFDdkIsZUFBZTtBQUFBLFFBQ1gsUUFBUTtBQUFBLFVBQ0osY0FBYztBQUFBLFlBQ1Ysa0JBQWtCLENBQUMsZ0JBQWdCO0FBQUEsVUFDdkM7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
