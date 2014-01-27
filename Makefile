
export PATH := node_modules/.bin:$(PATH)

all:
	npm install
	# Some node modules ship with .php files and it confuses Pico
	find node_modules/ -name "*.php"  -delete
	gulp css js

watch:
	# gulp watch
	watchify -t hbsfy js/index.js -o build/js/index.js
