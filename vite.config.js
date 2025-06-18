import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            outputDir: './types'
        })
    ],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/lib/index.js'),
			name: 'vue-advanced-chat'
		},
		rollupOptions: {
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	},
	resolve: {
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		alias: {
			'@': resolve(__dirname, './src')
		}
	}
})
