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

union WideSignal {
  uint32_t* sig32;
  uint64_t* sig64;
  };


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
}

  
      
	
uint32_t signals::clk(uint32_t val) {
  top->clk = val;
  return top->clk;
}
	
      
  
      
	
uint32_t signals::fastclk(uint32_t val) {
  top->fastclk = val;
  return top->fastclk;
}
	
      
  
      
	
uint32_t signals::reset_l(uint32_t val) {
  top->reset_l = val;
  return top->reset_l;
}
	
      
  
      
	
uint32_t signals::out_small() {
  return top->out_small;
}
	
      
  
      
	
uint64_t signals::out_quad() {
  return top->out_quad;
}
	
      
  
      
	
uint32_t* signals::out_wide() {
  return top->out_wide;
}
	
      
  
      
	
uint32_t signals::in_small(uint32_t val) {
  top->in_small = val;
  return top->in_small;
}
	
      
  
      
	
uint64_t signals::in_quad(uint64_t val) {
  top->in_quad = val;
  return top->in_quad;
}
	
      
  
      
	
uint32_t* signals::in_wide(uint32_t* val, int len) {
//  top->in_wide = val;
  return top->in_wide;
}
	
      
  


int signals::eval() {
  static vluint64_t main_time = 0;
  main_time++;
  top->eval();
  tfp->dump (main_time);
  // Read outputs
  VL_PRINTF ("[%" VL_PRI64 "d] clk=%x rstl=%x iquad=%" VL_PRI64 "x"
	     " -> oquad=%" VL_PRI64"x owide=%x_%08x_%08x\n",
	     main_time, top->clk, top->reset_l, top->in_quad,
	     top->out_quad, top->out_wide[2], top->out_wide[1], top->out_wide[0]);
  return 0;
}


    
      
Napi::Number signals::clkWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::clk(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->clk);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::fastclkWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::fastclk(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->fastclk);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::reset_lWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::reset_l(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->reset_l);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::out_smallWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  returnValue = Napi::Number::New(env, top->out_small);
  return returnValue;
}
      
    

    
      
Napi::Number signals::out_quadWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  returnValue = Napi::Number::New(env, top->out_quad);
  return returnValue;
}
      
    

    
      
/*Napi::BigInt signals::out_wideWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::BigInt returnValue;
  returnValue = Napi::Number::New(env, top->out_wide);
  return returnValue;
  }*/
      
    

    
      
Napi::Number signals::in_smallWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::in_small(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->in_small);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::in_quadWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::in_quad(val.Int64Value()));
  } else {
    returnValue = Napi::Number::New(env, top->in_quad);
  }
  return returnValue;
}
      
    

    
      
/*Napi::BigInt signals::in_wideWrapped(const Napi::CallbackInfo& info) { 
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::in_wide(val.Int64Value()));
  } else {
    returnValue = Napi::Number::New(env, top->in_wide);
  }
  return returnValue;
}*/
      
    




Napi::Number signals::evalWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::Number returnValue = Napi::Number::New(env, signals::eval());
  return returnValue;
  
}

Napi::Object signals::Init(Napi::Env env, Napi::Object exports) {
  signals::init_top();

    
  exports.Set("clk", Napi::Function::New(env, signals::clkWrapped));
  

    
  exports.Set("fastclk", Napi::Function::New(env, signals::fastclkWrapped));
  

    
  exports.Set("reset_l", Napi::Function::New(env, signals::reset_lWrapped));
  

    
  exports.Set("out_small", Napi::Function::New(env, signals::out_smallWrapped));
  

    
  exports.Set("out_quad", Napi::Function::New(env, signals::out_quadWrapped));
  

    

    
  exports.Set("in_small", Napi::Function::New(env, signals::in_smallWrapped));
  

    
  exports.Set("in_quad", Napi::Function::New(env, signals::in_quadWrapped));
  

    

  exports.Set("eval", Napi::Function::New(env, signals::evalWrapped));
  
  return exports;
}

