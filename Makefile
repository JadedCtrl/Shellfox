ifneq ($(USER),1)
	PREFIX ?= /usr/local
	MOZILLA_PREFIX ?= /usr
	LIBDIR ?= /usr/lib64
	MOZILLA_NATIVE ?= $(LIBDIR)/mozilla/native-messaging-hosts
else
	PREFIX ?= $(HOME)/.local
	MOZILLA_NATIVE ?= $(HOME)/.mozilla/native-messaging-hosts
endif

LIBEXEC ?= $(PREFIX)/libexec

.PHONY: all
all:
	@echo "No build step. Available targets:"
	@echo "native-install          install native app"
	@echo "native-uninstall        uninstall native app"
	@echo "xpi                     create XPI webex archive"
	@echo
	@echo "Set USER=1 to target user directories instead."

# make phony and don't depend on .in file in case $USER changes
.PHONY: shellfox.sh.json
shellfox.sh.json:
	sed -e 's|@@NATIVE_PATH@@|$(LIBEXEC)/shellfox/shellfox.sh|' $@.in > $@

.PHONY: native-install
native-install: shellfox.sh.json
	mkdir -p $(DESTDIR)$(MOZILLA_NATIVE)
	cp -f shellfox.sh.json $(DESTDIR)$(MOZILLA_NATIVE)/shellfox.json
	mkdir -p $(DESTDIR)$(LIBEXEC)/shellfox
	cp -rf shellfox.sh  $(DESTDIR)$(LIBEXEC)/shellfox

.PHONY: native-uninstall
native-uninstall:
	rm -f $(DESTDIR)$(MOZILLA_NATIVE)/shellfox.json
	rm -rf $(DESTDIR)$(LIBEXEC)/shellfox

.PHONY: xpi
xpi:
	@rm -f shellfox.xpi && zip -r shellfox.xpi background.js _locales/ manifest.json options.* res/*.png
