import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import replace from 'rollup-plugin-replace';
import sveltePreprocess from 'svelte-preprocess';

// Rollup Watch 기능(-w)이 동작하는 경우만 '개발모드'라고 판단
const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	// rollup의 진입점
	input: 'src/main.js',
	// 번들 출력
	output: {
		// 번들의 소스맵 파일을 생성, 소스맵은 난독화 파일을 해석해서 성능 향상
		sourcemap: true,
		// 번들의 포맷을 지정. 'iife'는 HTML SCRIPT 태그에 사용하기에 적합
		format: 'iife',
		// 번들의 전역 변수 이름. 'iife' 포멧을 사용하는 경우 필요. 중복방지
		name: 'app',
		// 번들이 생성되는 경로
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				// 개발 코드에서 런타임 검사 활성화
				dev: !production,				
			},
			preprocess: sveltePreprocess({
				scss: {
					prependData: '@import "./src/scss/main.scss";'
				},
				postcss: {
					plugins: [
						require('autoprefixer')()
					]
				}
			})
			
		}),
		replace({
			values: {
				'crypto.randomBytes':'require("randombytes")'
			}
		}),

		// we'll extract any component CSS out into
		// a separate file - better for performance
		// svelte 컴포넌트의 css를 별도의 번들로 생성
		css({ output: 'bundle.css' }),
		
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			// 브라우저 환경을 위한 번들로 포함하도록 지시
			browser: true,
			// 중복 번들을 방지하기위한 외부 모듈 이름을 지정
			dedupe: ['svelte']
		}),		
		commonjs(),
		globals(),
		builtins(),

		alias({
			entries: [
				{
					find: '~',
					replacement: path.resolve(__dirname, 'src/')
				}
			]
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		// 번들 최적화
		production && terser()
	],	
	watch: {
		// 다시 빌드할 때, 터미널 화면을 초기화하지 않습니다.
		// 기본값은 'true' 
		clearScreen: false
	}
};
