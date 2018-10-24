VERILATOR = verilator
VERILATOR_FLAGS =
# Generate C++ in executable form
VERILATOR_FLAGS += -cc --exe
# Generate makefile dependencies (not shown as complicates the Makefile)
#VERILATOR_FLAGS += -MMD
# Optimize
VERILATOR_FLAGS += -O2 -x-assign 0
# Warn abount lint issues; may not want this on less solid designs
VERILATOR_FLAGS += -Wall
# Make waveforms
VERILATOR_FLAGS += --trace
# Check SystemVerilog assertions
VERILATOR_FLAGS += --assert
# Generate coverage analysis
VERILATOR_FLAGS += --coverage
# Run Verilator in debug mode
#VERILATOR_FLAGS += --debug
# Add this trace to get a backtrace in gdb
#VERILATOR_FLAGS += --gdbbt

######################################################################
compile:
	@echo "Compile"
	$(VERILATOR) $(VERILATOR_FLAGS)  src/top.sv

default: run

run:
	@echo
	@echo "-- Verilator tracing example"

	@echo
	@echo "-- VERILATE ----------------"
	$(VERILATOR) $(VERILATOR_FLAGS) -f top.sv

	@echo
	@echo "-- COMPILE -----------------"
# To compile, we can either just do what Verilator asks,
# or call a submakefile where we can override the rules ourselves
#	$(MAKE) -j 4 -C obj_dir -f Vtop.mk
	$(MAKE) -j 4 -C obj_dir -f ../Makefile_obj

	@echo
	@echo "-- RUN ---------------------"
	@mkdir -p logs
	obj_dir/Vtop +trace

	@echo
	@echo "-- COVERAGE ----------------"
	$(VERILATOR_COVERAGE) --annotate logs/annotated logs/coverage.dat

	@echo
	@echo "-- DONE --------------------"
	@echo "To see waveforms, open vlt_dump.vcd in a waveform viewer"
	@echo


######################################################################
# Other targets

show-config:
	$(VERILATOR) -V

maintainer-copy::
clean mostlyclean distclean maintainer-clean::
	-rm -rf obj_dir logs *.log *.dmp *.vpd coverage.dat core
