NODE_ENV ?= development
NODE_CONFIG_DIR ?= ./server/config
FRONTEND_DIST_PATH ?= ./frontend/dist
SERVER_VIEWS_PATH ?= ./server/dist/views

start: clean build start-server

start-server-hot: build-frontend
	@echo Starting Server
	@NODE_CONFIG_DIR=$(NODE_CONFIG_DIR) ENABLE_HMR=true \
		node server/dist

start-server:
	@echo Starting Server
	@NODE_CONFIG_DIR=$(NODE_CONFIG_DIR) node server/dist

build:
	@node project/index.js
	@make build-frontend
	@make build-universal
	# TODO Server side HMR is experimental, normal babel works too
	# make build-server
	@make build-server-webpack

clean: clean-server clean-frontend clean-universal

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
	@babel -D -d server/dist server/src

# Using Webpack to build on the server is still experimental
# and mostly helpful in development for now, since it provides HMR
build-server-webpack: clean-server
	@echo Building backend server
	@webpack --config server/webpack.config.babel.js \
		--target node --colors --hide-modules \
		--records-path ./node_modules/.cache/opencollective-website/server-records
	@echo Copying Views into Dist
	@cp -r server/src/views server/dist

# Provides experimental server side HMR
build-server-webpack-watch: clean-server
	@webpack --config server/webpack.config.babel.js --target node --watch --hot

build-frontend-watch: clean-frontend
	@rimraf frontend/dist/*.* frontend/dist/fonts frontend/dist/images
	@webpack-dev-server --config ./frontend/webpack.config.babel.js --hot \
		--inline --output-public-path="http://localhost:8080/static/" \
		--content-base ./frontend/dist --hot-only

build-universal-watch: clean-universal
	@webpack --config frontend/webpack.config.babel.js --target node --watch --hot

clean-frontend:
	@rm -rf frontend/dist/fonts frontent/dist/svg frontend/dist/images frontend/dist/*.*

clean-universal:
	@rm -rf frontend/dist/universal

clean-server:
	@rm -rf server/dist

# install-subpackages:
# 	@cd frontend && npm install
# 	@cd server && npm install

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
