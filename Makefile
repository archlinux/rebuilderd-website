PACKAGE_NAME=rebuilder-website

# Tools

SASS ?= sass
YARN ?= yarn

# Variables

PORT ?= 9966
VERSION ?= $(shell git describe --tags --always --dirty --match=v* 2>/dev/null | sed 's/^v//' || \
			cat $(CURDIR)/.version 2> /dev/null || echo 0.0.0-unreleased)

all: vendor

# Watchers

.PHONY: sass-watcher
sass-watcher:
	$(SASS) --watch src/style.scss:public/bundle.css

.PHONY: js-watcher
js-watcher:
	# TODO: yarn run doesn't work..
	./node_modules/.bin/budo src/index.js:bundle.js --dir public --port $(PORT) --live -- -t babelify


# Dist

.PHONY: dist
dist:
	@mkdir -p "dist/${PACKAGE_NAME}-${VERSION}"
	cp -avf public/index.html "dist/${PACKAGE_NAME}-${VERSION}/index.html"
	# TODO: cache-invalidation with version string replaced in html file
	cp -avf public/favicon.ico "dist/${PACKAGE_NAME}-${VERSION}/favicon.ico"
	$(SASS) -t compressed src/style.scss "dist/${PACKAGE_NAME}-${VERSION}/bundle.css"
	$(YARN) run -s browserify -t babelify src/index.js | $(YARN) run -s uglifyjs > "dist/${PACKAGE_NAME}-${VERSION}/bundle.js"
	cd dist && tar --owner=0 --group=0 -czvf ${PACKAGE_NAME}-${VERSION}.tar.gz "${PACKAGE_NAME}-${VERSION}"


# Yarn

.PHONY: vendor
vendor: .yarninstall

.yarninstall: package.json
	@$(YARN) install --silent
	@touch $@


.PHONY:
clean:
	$(YARN) cache clean
	@rm -rf dist
	@rm -rf node_modules
	@rm -f .yarninstall
