######################################################################
#
# DESCRIPTION: Verilator Example: Small Makefile
#
# This calls the object directory makefile.  That allows the objects to
# be placed in the "current directory" which simplifies the Makefile.
#
# Copyright 2003-2018 by Wilson Snyder. This program is free software; you can
# redistribute it and/or modify it under the terms of either the GNU
# Lesser General Public License Version 3 or the Perl Artistic License
# Version 2.0.
#
######################################################################
# Check for sanity to avoid later confusion

ifneq ($(words $(CURDIR)),1)
 $(error Unsupported: GNU Make cannot build in directories containing spaces, build elsewhere: '$(CURDIR)')
endif

######################################################################
# Set up variables

# If $VERILATOR_ROOT isn't in the environment, we assume it is part of a
# package inatall, and verilator is in your path. Otherwise find the
# binary relative to $VERILATOR_ROOT (such as when inside the git sources).
ifeq ($(VERILATOR_ROOT),)
VERILATOR = verilator
VERILATOR_COVERAGE = verilator_coverage
else
export VERILATOR_ROOT
VERILATOR = $(VERILATOR_ROOT)/bin/verilator
VERILATOR_COVERAGE = $(VERILATOR_ROOT)/bin/verilator_coverage
endif

VERILATOR_USER_ARGS =

VERILATOR_FLAGS = $(VERILATOR_USER_ARGS)
# Generate C++ in executable form
VERILATOR_FLAGS += -cc --exe
# Generate makefile dependencies (not shown as complicates the Makefile)
#VERILATOR_FLAGS += -MMD
# Optimize
VERILATOR_FLAGS += -O3 -x-assign 0
# Warn abount lint issues; may not want this on less solid designs
VERILATOR_FLAGS += -Wall
# Make waveforms
TRACE = $(shell node -p "require('./config.json').waveform_format")
ifeq ($(TRACE),fst)
VERILATOR_FLAGS += --trace-fst
else
VERILATOR_FLAGS += --trace
endif
# Check SystemVerilog assertions
VERILATOR_FLAGS += --assert
# Generate coverage analysis
VERILATOR_FLAGS += --coverage
# MULTITHREADED
#VERILATOR_FLAGS += --threads 2
# Run Verilator in debug mode
#VERILATOR_FLAGS += --debug
# Add this trace to get a backtrace in gdb
#VERILATOR_FLAGS += --gdbbt

TOP = $(shell node -p "require('./config.json').dut_file")
DUT_NAME = $(shell node -p "require('./config.json').dut_name")
VERILATE_TOP_FILE = V$(DUT_NAME).h
.PHONY: rebuild build test
######################################################################
default: all

gen:
	@node -e "require('./').GenerateWrapper('./obj_dir/$(VERILATE_TOP_FILE)','$(DUT_NAME)','$(TRACE)', true)"

compile:
	@echo "-- COMPILE -----------------"
# To compile, we can either just do what Verilator asks,
# or call a submakefile where we can override the rules ourselves
#	$(MAKE) -j 4 -C obj_dir -f Vtop.mk
	cd obj_dir && $(MAKE) -j 4 ../Makefile_obj

lib:
	cd obj_dir && $(MAKE) -f ../Makefile_obj createlib

rebuild:
	npm run rebuild

build:
	npm run build

test:
	npm run mocha


all: verilate lib gen build test

verilate:
	@echo
	@echo "-- Verilator tracing example"

	@echo
	@echo "-- VERILATE ----------------"
#ifeq ($(TRACE),fst)
#	@echo $(TRACE)
#endif
	$(VERILATOR) $(VERILATOR_FLAGS) -f input.vc $(TOP)


######################################################################
# Other targets

show-config:
	$(VERILATOR) -V

maintainer-copy::
clean mostlyclean distclean maintainer-clean::
	-rm -rf obj_dir logs *.log *.dmp *.vpd coverage.dat core
