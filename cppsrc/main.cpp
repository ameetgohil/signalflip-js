// DESCRIPTION: Verilator: Verilog example module
//
// This file ONLY is placed into the Public Domain, for any use,
// without warranty, 2017 by Wilson Snyder.
//======================================================================

// Include common routines
#include <napi.h>

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return signals::Init(env, exports);
}
  

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
