DEST ?=
PREFIX ?= usr/local

INSTALL_PATH = $(DEST)/$(PREFIX)

######################################################################
# Core count
CORES ?= 1

# Basic feature detection
OS = $(shell uname)
ARCH ?= $(shell uname -m)

######################################################################

# all: $(LIB) $(EXE)
# all: $(LIB)
# all: $(EXE)

showconfig:
	@echo "OS="$(OS)
	@echo "ARCH="$(ARCH)
	@echo "DEST="$(DEST)
	@echo "PREFIX="$(PREFIX)
	@echo "INSTALL_PATH="$(INSTALL_PATH)
	@echo "CFLAGS="$(CFLAGS)
	@echo "LDFLAGS="$(LDFLAGS)
	@echo "DDIR="$(DDIR)
	@echo "DSRC="$(DSRC)
	@echo "SRC="$(SRC)
	@echo "OBJ="$(OBJ)
	@echo "HDR="$(HDR)
	@echo "IDIR="$(IDIR)
	@echo "INC="$(INC)
	@echo "EDIR="$(EDIR)
	@echo "EXE="$(EXE)
	@echo "LDIR="$(LDIR)
	@echo "LSRC="$(LSRC)
	@echo "LOBJ="$(LOBJ)
	@echo "LNK="$(LNK)
	@echo "LIB="$(LIB)
	@echo "TSRC="$(TSRC)
	@echo "TOBJ="$(TOBJ)
	@echo "TEXE="$(TEXE)
	@echo "TMPCI="$(TMPCI)
	@echo "TMPCT="$(TMPCT)
	@echo "TMPCD="$(TMPCD)

gstat:
	git status

gpush:
	git commit
	git push

tarball:
	cd ../. && tar jcvf 7m.$(shell date +%Y%m%d%H%M%S).tar.bz2 7m/
