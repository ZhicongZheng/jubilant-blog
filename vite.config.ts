import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import { prismjsPlugin } from "vite-plugin-prismjs";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      dts: "src/types/auto-imports.d.ts",
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: "src/types/components.d.ts",
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",
    }),
    prismjsPlugin({
      languages: [
        "java",
        "python",
        "html",
        "css",
        "sass",
        "less",
        "go",
        "cpp",
        "c",
        "js",
        "ts",
        "sql",
        "bash",
        "git",
        "nginx",
        "php",
      ],
      theme: "tomorrow",
      css: true,
    }),
  ],
  resolve: {
    // https://cn.vitejs.dev/config/#resolve-alias
    alias: {
      // 设置路径
      "~": path.resolve(__dirname, "./"),
      // 设置别名
      "@": path.resolve(__dirname, "./src"),
    },
    // https://cn.vitejs.dev/config/#resolve-extensions
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  server: {
    /** 是否开启 HTTPS */
    https: false,
    /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
    host: true, // host: "0.0.0.0"
    /** 端口号 */
    port: 3334,
    /** 是否自动打开浏览器 */
    open: false,
    /** 跨域设置允许 */
    cors: true,
    /** 端口被占用时，是否直接退出 */
    strictPort: false,
    /** 接口代理 */
    proxy: {
      "/api/v1": {
        target: "http://localhost:9080",
        ws: true,
        /** 是否允许跨域 */
        changeOrigin: true,
        rewrite: (path) => path.replace("/api/v1", "")
      }
    }
  },
  build: {
    /** 消除打包大小超过 500kb 警告 */
    chunkSizeWarningLimit: 2000,
    /** Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效 */
    minify: "terser",
    /** 在打包代码时移除 console.log、debugger 和 注释 */
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ["console.log"]
      },
      format: {
        /** 删除注释 */
        comments: false
      }
    },
    /** 打包后静态资源目录 */
    assetsDir: "static"
  },
});
