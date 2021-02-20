https://www.inflearn.com/course/%EC%8A%A4%EB%B2%A8%ED%8A%B8-%EC%99%84%EB%B2%BD-%EA%B0%80%EC%9D%B4%EB%93%9C#

# svelte-trello-app
trello 라는 Todo 서비스를 svelte를 이용하여 클론 구현

npx degit sveltejs/template 프로젝트명 으로 생성

# Rollup 
webpack 같은 번들러,
굳이 Rollup이 아니라도 상관없지만 svelte창시자인 Rich Harris가 이용,

# reset.css
스타일 초기화, index.html에 cdn으로 적용
https://www.jsdelivr.com/package/npm/reset-css

# scss
scss사용을 위해선 svelte-preprocess와 node-sass가 필요함

설치
npm i -D svelte-preprocess
npm i -D node-sass

rollup.config.js에서 
svelte-preprocess를 import (ex: import sveltePreprocess from 'svelte-preprocess'; )
plugin찾고 svelte 안에 preprocess: sveltePreprocess() 입력하여 적용

그래도 scss 사용부분에 빨간 밑줄 그어저있는데 
svelte 확장프로그램 설정에서 runtime 부분에 node.exe 위치 입력해주면 해결됨

표준 rgba()를 사용할때 4개의 요소(red,green,blue, opacity)가 들어가지만
scss rgba()는 2개의 요소(color, opacity)만 사용해도됨


# autoprefixer(PostCSS)
공급업체 접두사 후처리, 
-ms-, -webkit-, -moz- 등 구형 브라우저에서 사용을 위해 쓰이는데
이를 자동으로 붙여주는 모듈

설치
npm i -D autoprefixer@^9

최신 버전은 10+ 인데 postcss를 추가로 설치해줘야 해서 9버전으로 사용

위에 적용한 sveltePreprocess안에 적용
preprocess: sveltePreprocess({
	postcss: {
		plugins: [
    		require('autoprefixer')()
		]
	}
})

그리고 package.json의 scripts 밑에 browserslist 입력 (여러옵션이 있음)
"browserslist": [
   "> 1%", // 브라우저 점유율이 1% 이상인 모든 브라우저를 지원
   "last 2 versions" // 모든 브라우저의 가장 마지막 2버전
],


# 경로 별칭(@rollup/plugin-alias)
절대 경로를 별칭으로 표현

설치
npm i -D @rollup/plugin-alias

rollup.config에 node모듈 사용
import path from 'path';

plugin 아래에 
alias({
	entries: [
		{
			find: '~',
			replacement: path.resolve(__dirname, 'src/')
		}
	]
}),

# 랜덤 고유 문자생성 (crypto-random-string)
uuid, crypto-random-string 둘 다 가능, 여기선 crypto로 rollup 구성

npm i -D crypto-random-string@3.2

Rollup에서 node 내장 Api를 지원안해서 에러가 발생함으로 밑의 모듈을 설치&구성해야함
'ReferenceError: XXX is not defined' 가 대표적인 에러

rollup-plugin-node-builtins: Node 내장 API를 사용할 수 있습니다.
rollup-plugin-node-globals: 일부 Node 모듈이 필요로 하는 전역 API를 사용할 수 있습니다.
rollup-plugin-replace: 번들 파일의 문자를 대체합니다. 문제가 발생하는 코드를 다른 코드(코드)로 대체 실행하기 위해 사용합니다.

rollup.config에 위의 모듈들을 import 한 후 
plugin의 svelte 밑에 replace로 대체
replace({
	values: {
		'crypto.randomBytes':'require("randombytes")'
	}
}),

plugin의 commonjs() 아래에 globals, builtins적용
globals(),
bulitins(),


# 전역스타일(main.scss) 구성
src아래에 scss 디렉토리를 구성한후 main.scss 제작

각각의 컴포넌트에서 
<!-- <style lang="scss> --> 을 사용할 때
전역 스타일이 먼저 적용되게 하려면 

rollup.config에 전처리부분에 scss에 대한 내용을 추가하면 됨
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