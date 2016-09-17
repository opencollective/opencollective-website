NODE_ENV ?= development
NODE_CONFIG_DIR ?= ./server/config

build: clean
	@node project/index.js
	@echo Building all the things
	@make build-frontend
	@make build-universal
	@make build-server

install-subpackages:
	@cd frontend && npm install
	@cd server && npm install

clean: clean-server clean-frontend clean-universal
	@echo Cleaning distributions

build-sanity-test:
	@echo Build Completed. Sanity testing...
	@node --eval "require('./frontend/dist/universal/middleware.js'); console.log('MIDDLEWARE IS GOOD')"
	@node --eval "require('./frontend/dist/universal/widget.js'); console.log('WIDGET IS GOOD')"
	@node --eval "require('./server/dist/index.js'); console.log('SERVER IS GOOD'); process.exit(0)"

build-svg:
	@echo Building SVG
	@gulp build:svg

build-frontend: clean-frontend build-svg
	@echo Building frontend assets
	@webpack --config frontend/webpack.config.babel.js \
		--target web --colors --hide-modules \
		--records-path ./node_modules/.cache/opencollective-website/frontend-records

build-universal: clean-universal
	@echo Building universal rendering modules
	@webpack --config frontend/webpack.config.babel.js \
		--target node --colors --hide-modules \
		--records-path ./node_modules/.cache/opencollective-website/frontend-records

build-server: clean-server
	@echo Building backend server
	@webpack --config server/webpack.config.babel.js \
		--target node --colors --hide-modules \
		--records-path ./node_modules/.cache/opencollective-website/server-records
	@echo Copying Views into Dist
	@cp -r server/src/views server/dist

build-frontend-watch: clean-frontend
	@rimraf frontend/dist/*.* frontend/dist/fonts frontend/dist/images
	@webpack-dev-server --config ./frontend/webpack.config.babel.js --hot --inline --output-public-path="http://localhost:8080/static/" --content-base ./frontend/dist

build-universal-watch: clean-universal
	@webpack --config frontend/webpack.config.babel.js --target node --watch --hot

build-server-watch:
	@webpack --config server/webpack.config.babel.js --target node --watch --hot

clean-frontend:
	@rm -rf frontend/dist/fonts frontent/dist/svg frontend/dist/images frontend/dist/*.*

clean-universal:
	@rm -rf frontend/dist/universal

clean-server:
	@rm -rf server/dist

# Generate stats produces large JSON bundles of your webpack builds which
# You can analyze using their webtool to learn about the dependency graph
generate-stats: generate-server-stats generate-frontend-stats generate-universal-stats

generate-frontend-stats:
	@echo Generating Webpack Stats profile of Frontend $(NODE_ENV) build
	@webpack --config frontend/webpack.config.babel.js \
		--target web --profile --json > stats/frontend.$(NODE_ENV).stats.json

generate-server-stats:
	@echo Generating Webpack Stats profile of Server $(NODE_ENV) build
	@webpack --config server/webpack.config.babel.js \
		--target node --profile --json > stats/server.$(NODE_ENV).stats.json

generate-universal-stats:
	@echo Generating Webpack Stats profile of Universal $(NODE_ENV) build
	@webpack --config frontend/webpack.config.babel.js \
		--target node --profile --json > stats/universal.$(NODE_ENV).stats.json
