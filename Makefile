PACKAGE_NAME=rebuilderd-website

# Tools

SASS ?= sass
YARN ?= yarn

# Variables

PORT ?= 9966
HOST ?= localhost
VERSION ?= $(shell git describe --tags --always --dirty --match=v* 2>/dev/null | sed 's/^v//' || \
			cat $(CURDIR)/.version 2> /dev/null || echo 0.0.0-unreleased)
ARCHLOGO = archlogo.8a05bc7f6cd1.svg

all: vendor

# Watchers

.PHONY: sass-watcher
sass-watcher: vendor
	$(SASS) --watch src/style.scss:public/bundle.css

.PHONY: js-watcher
js-watcher: vendor
	# TODO: yarn run doesn't work..
	./node_modules/.bin/budo src/index.js:bundle.js --dir public --host $(HOST) --port $(PORT) --live -- -t babelify


# Dist

.PHONY: dist
dist: vendor
	@mkdir -p "dist/${PACKAGE_NAME}-${VERSION}"
	cp -avf public/index.html "dist/${PACKAGE_NAME}-${VERSION}/index.html"
	# TODO: cache-invalidation with version string replaced in html file
	svgcleaner public/${ARCHLOGO} "dist/${PACKAGE_NAME}-${VERSION}/${ARCHLOGO}"
	cp -vf public/favicon.ico -t "dist/${PACKAGE_NAME}-${VERSION}/"
	$(SASS) -t compressed src/style.scss "dist/${PACKAGE_NAME}-${VERSION}/bundle-${VERSION}.css"
	$(YARN) run -s browserify -t babelify src/index.js | $(YARN) run -s terser --compress --mangle > "dist/${PACKAGE_NAME}-${VERSION}/bundle-${VERSION}.js"

	# sed the version file in html
	@sed -i 's/bundle.js/bundle-${VERSION}.js/' "dist/${PACKAGE_NAME}-${VERSION}/index.html"
	@sed -i 's/bundle.css/bundle-${VERSION}.css/' "dist/${PACKAGE_NAME}-${VERSION}/index.html"

	cd dist && tar --owner=0 --group=0 -czvf ${PACKAGE_NAME}-${VERSION}.tar.gz "${PACKAGE_NAME}-${VERSION}"


# Yarn

.PHONY: vendor
vendor: submodule .yarninstall

.yarninstall: package.json
	@$(YARN) install --silent
	@touch $@

.PHONY:
submodule:
	git submodule update --init --recursive
	make -C .external/archlinux-common-style

.PHONY:
distsize:
	@du -s "dist/${PACKAGE_NAME}-${VERSION}"

.PHONY:
clean:
	$(YARN) cache clean
	@rm -rf dist
	@rm -rf node_modules
	@rm -f .yarninstall
