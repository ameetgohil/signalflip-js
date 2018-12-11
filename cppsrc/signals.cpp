#include "signals.h"
#include <verilated.h>

// Include model header, generated from Verilating "top.v"
#include "Vtop.h"

// If "verilator --trace" is used, include the tracing class
#if VM_TRACE
# include <verilated_vcd_c.h>
#endif


// // Current simulation time (64-bit unsigned)
// vluint64_t main_time = 0;
// // Called by $time in Verilog
// double sc_time_stamp() {
//     return main_time;  // Note does conversion to real, to match SystemC
// }

std::string signals::hello() {
  return "Hello World";
}

void init_top() {
  Verilated::debug(0);
}

Napi::String signals::HelloWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::String returnValue = Napi::String::New(env, signals::hello());
  return returnValue;
}

Napi::Object signals::Init(Napi::Env env, Napi::Object exports) {
  init_top();
  exports.Set("hello", Napi::Function::New(env, signals::HelloWrapped));
  
  return exports;
}

