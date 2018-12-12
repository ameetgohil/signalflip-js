#include "signals.h"
#include <verilated.h>

// Include model header, generated from Verilating "top.v"
#include "Vtop.h"

// If "verilator --trace" is used, include the tracing class
//#if VM_TRACE
# include <verilated_vcd_c.h>
//#endif

// // Current simulation time (64-bit unsigned)
// vluint64_t main_time = 0;
// // Called by $time in Verilog
// double sc_time_stamp() {
//     return main_time;  // Note does conversion to real, to match SystemC
// }
//

std::string signals::hello() {
  return "Hello World";
}

Vtop* top;
VerilatedVcdC* tfp;
void signals::init_top() {

  //Verilated::debug(0);
  // Set debug level, 0 is off, 9 is highest presently used
  Verilated::debug(0);
  // Randomization reset policy
  Verilated::randReset(2);

  // Construct the Verilated model, from Vtop.h generated from Verilating "top.v"
  top = new Vtop; // Or use a const unique_ptr, or the VL_UNIQUE_PTR wrapper

  //#if VM_TRACE
  // If verilator was invoked with --trace argument,
  // and if at run time passed the +trace argument, turn on tracing
  tfp = NULL;
  //  const char* flag = Verilated::commandArgsPlusMatch("trace");
  //  if (flag && 0==strcmp(flag, "+trace")) {
    Verilated::traceEverOn(true);  // Verilator must compute traced signals
    VL_PRINTF("Enabling waves into logs/vlt_dump.vcd...\n");
    tfp = new VerilatedVcdC;
    top->trace(tfp, 99);  // Trace 99 levels of hierarchy
    Verilated::mkdir("logs");
    tfp->open("logs/vlt_dump.vcd");  // Open the dump file
    //  }
  //#endif

  // Set some inputs
  top->reset_l = !0;
  top->fastclk = 0;
  top->clk = 0;
  top->in_small = 1;
  top->in_quad = 0x1234;
  top->in_wide[0] = 0x11111111;
  top->in_wide[1] = 0x22222222;
  top->in_wide[2] = 0x3;
}
/*
  // Simulate until $finish
  while (!Verilated::gotFinish()) {
    main_time++;  // Time passes...

    // Toggle clocks and such
    top->fastclk = !top->fastclk;
    if ((main_time % 10) == 3) {
      top->clk = 1;
    }
    if ((main_time % 10) == 8) {
      top->clk = 0;
    }
    if (main_time > 1 && main_time < 10) {
      top->reset_l = !1;  // Assert reset
    } else {
      top->reset_l = !0;  // Deassert reset
    }

    // Assign some other inputs
    top->in_quad += 0x12;

    // Evaluate model
    top->eval();

#if VM_TRACE
    // Dump trace data for this cycle
    if (tfp) tfp->dump (main_time);
#endif

    // Read outputs
    VL_PRINTF ("[%" VL_PRI64 "d] clk=%x rstl=%x iquad=%" VL_PRI64 "x"
	       " -> oquad=%" VL_PRI64"x owide=%x_%08x_%08x\n",
	       main_time, top->clk, top->reset_l, top->in_quad,
	       top->out_quad, top->out_wide[2], top->out_wide[1], top->out_wide[0]);
  }

  // Final model cleanup
  top->final();

  // Close trace if opened
#if VM_TRACE
  if (tfp) { tfp->close(); tfp = NULL; }
#endif

  //  Coverage analysis (since test passed)
#if VM_COVERAGE
  Verilated::mkdir("logs");
  VerilatedCov::write("logs/coverage.dat");
#endif

  // Destroy model
  delete top; top = NULL;

  }*/

int signals::tick() {
  static vluint64_t main_time = 0;
  main_time++;
  top->fastclk = !top->fastclk;
  if ((main_time % 10) == 3) {
    top->clk = 1;
  }
  if ((main_time % 10) == 8) {
    top->clk = 0;
  }
  if (main_time > 1 && main_time < 10) {
    top->reset_l = !1;  // Assert reset
  } else {
    top->reset_l = !0;  // Deassert reset
  }

  // Assign some other inputs
  top->in_quad += 0x12;
  
  // Evaluate model
  top->eval();
  tfp->dump (main_time);
  // Read outputs
  VL_PRINTF ("[%" VL_PRI64 "d] clk=%x rstl=%x iquad=%" VL_PRI64 "x"
	     " -> oquad=%" VL_PRI64"x owide=%x_%08x_%08x\n",
	     main_time, top->clk, top->reset_l, top->in_quad,
	     top->out_quad, top->out_wide[2], top->out_wide[1], top->out_wide[0]);
  
  return 0;
}



Napi::String signals::HelloWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::String returnValue = Napi::String::New(env, signals::hello());
  return returnValue;
}

Napi::Number signals::TickWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Number returnValue = Napi::Number::New(env, signals::tick());
  return returnValue;
}

Napi::Object signals::Init(Napi::Env env, Napi::Object exports) {
  signals::init_top();
  exports.Set("hello", Napi::Function::New(env, signals::HelloWrapped));
  exports.Set("tick", Napi::Function::New(env, signals::TickWrapped));
  return exports;
}

