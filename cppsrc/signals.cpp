#include "signals.h"
#include <verilated.h>
#include <sys/stat.h>
#include <string>

// Include model header, generated from Verilating "top.v"
#include "Vtop_elastic.h"

// If "verilator --trace" is used, include the tracing class
//#if VM_TRACE

# include <verilated_vcd_c.h>
VerilatedVcdC* tfp;

//#endif

// // Current simulation time (64-bit unsigned)
 vluint64_t main_time = 0;
// // Called by $time in Verilog
 double sc_time_stamp() {
     return main_time;  // Note does conversion to real, to match SystemC
 }
//

union WideSignal {
  uint32_t* sig32;
  uint64_t* sig64;
  };


Vtop_elastic* top;
void signals::init_top(std::string name) {

  //Verilated::debug(0);
  // Set debug level, 0 is off, 9 is highest presently used
  Verilated::debug(0);
  // Randomization reset policy
  Verilated::randReset(2);

  // Construct the Verilated model, from Vtop.h generated from Verilating "top.v"
  top = new Vtop_elastic; // Or use a const unique_ptr, or the VL_UNIQUE_PTR wrapper

  //#if VM_TRACE
  // If verilator was invoked with --trace argument,
  // and if at run time passed the +trace argument, turn on tracing
  tfp = NULL;
  //  const char* flag = Verilated::commandArgsPlusMatch("trace");
  //  if (flag && 0==strcmp(flag, "+trace")) {
    Verilated::traceEverOn(true);  // Verilator must compute traced signals
    //VL_PRINTF("Enabling waves into logs/vlt_dump.vcd...\n");

    tfp = new VerilatedVcdC;

    top->trace(tfp, 99);  // Trace 99 levels of hierarchy
    Verilated::mkdir("logs");

    //mkdir("logs",0x775);

	std::string f = "logs/" + name + ".vcd";

       tfp->open(f.c_str());

    //  }
  //#endif

  // Set some inputs
}

  
      
	
uint32_t signals::clk(uint32_t val) {
  top->clk = val;
  return top->clk;
}
	
      
  
      
	
uint32_t signals::clk2(uint32_t val) {
  top->clk2 = val;
  return top->clk2;
}
	
      
  
      
	
uint32_t signals::rstf(uint32_t val) {
  top->rstf = val;
  return top->rstf;
}
	
      
  
      
	
uint32_t signals::t0_valid(uint32_t val) {
  top->t0_valid = val;
  return top->t0_valid;
}
	
      
  
      
	
uint32_t signals::t0_ready() {
  return top->t0_ready;
}
	
      
  
      
	
uint32_t signals::i0_valid() {
  return top->i0_valid;
}
	
      
  
      
	
uint32_t signals::i0_ready(uint32_t val) {
  top->i0_ready = val;
  return top->i0_ready;
}
	
      
  
      
	
uint32_t signals::t1_valid(uint32_t val) {
  top->t1_valid = val;
  return top->t1_valid;
}
	
      
  
      
	
uint32_t signals::t1_ready() {
  return top->t1_ready;
}
	
      
  
      
	
uint32_t signals::i1_valid() {
  return top->i1_valid;
}
	
      
  
      
	
uint32_t signals::i1_ready(uint32_t val) {
  top->i1_ready = val;
  return top->i1_ready;
}
	
      
  
      
	
uint32_t signals::clk3(uint32_t val) {
  top->clk3 = val;
  return top->clk3;
}
	
      
  
      
	
uint32_t signals::clk4(uint32_t val) {
  top->clk4 = val;
  return top->clk4;
}
	
      
  
      
	
uint32_t signals::clk5(uint32_t val) {
  top->clk5 = val;
  return top->clk5;
}
	
      
  
      
	
uint32_t signals::t0_data(uint32_t val) {
  top->t0_data = val;
  return top->t0_data;
}
	
      
  
      
	
uint32_t signals::i0_data() {
  return top->i0_data;
}
	
      
  
      
	
uint32_t signals::t1_data(uint32_t val) {
  top->t1_data = val;
  return top->t1_data;
}
	
      
  
      
	
uint32_t signals::i1_data() {
  return top->i1_data;
}
	
      
  


int signals::eval(uint64_t time) {
  main_time = time;
  top->eval();
  tfp->dump(main_time);
  // Read outputs
  /*  VL_PRINTF ("[%" VL_PRI64 "d] clk=%x rstl=%x iquad=%" VL_PRI64 "x"
	     " -> oquad=%" VL_PRI64"x owide=%x_%08x_%08x\n",
	     main_time, top->clk, top->reset_l, top->in_quad,
	     top->out_quad, top->out_wide[2], top->out_wide[1], top->out_wide[0]);*/
  return 0;
}

int signals::finish() {
  top->final();
  tfp->close();
  tfp = NULL;
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
      
    

    
      
Napi::Number signals::clk2Wrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::clk2(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->clk2);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::rstfWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::rstf(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->rstf);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::t0_validWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::t0_valid(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->t0_valid);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::t0_readyWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  returnValue = Napi::Number::New(env, top->t0_ready);
  return returnValue;
}
      
    

    
      
Napi::Number signals::i0_validWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  returnValue = Napi::Number::New(env, top->i0_valid);
  return returnValue;
}
      
    

    
      
Napi::Number signals::i0_readyWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::i0_ready(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->i0_ready);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::t1_validWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::t1_valid(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->t1_valid);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::t1_readyWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  returnValue = Napi::Number::New(env, top->t1_ready);
  return returnValue;
}
      
    

    
      
Napi::Number signals::i1_validWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  returnValue = Napi::Number::New(env, top->i1_valid);
  return returnValue;
}
      
    

    
      
Napi::Number signals::i1_readyWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::i1_ready(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->i1_ready);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::clk3Wrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::clk3(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->clk3);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::clk4Wrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::clk4(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->clk4);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::clk5Wrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::clk5(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->clk5);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::t0_dataWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::t0_data(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->t0_data);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::i0_dataWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  returnValue = Napi::Number::New(env, top->i0_data);
  return returnValue;
}
      
    

    
      
Napi::Number signals::t1_dataWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::t1_data(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top->t1_data);
  }
  return returnValue;
}
      
    

    
      
Napi::Number signals::i1_dataWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  returnValue = Napi::Number::New(env, top->i1_data);
  return returnValue;
}
      
    




void signals::evalWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
	Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
    }
    Napi::Number val = info[0].As<Napi::Number>();
    signals::eval(val.Int64Value());
  // Napi::Env env = info.Env();

  // Napi::Number returnValue = Napi::Number::New(env, signals::eval());
  // return returnValue;
  
}

void signals::finishWrapped(const Napi::CallbackInfo& info) {
    signals::finish();
    // Napi::Env env = info.Env();

    // Napi::Number returnValue = Napi::Number::New(env, signals::finish());
    // return returnValue;
}

void signals::initWrapped(const Napi::CallbackInfo& info) {
    std::string name = "waveform";
    Napi::Env env = info.Env();
    if(info.Length() > 0 ) {
	if(!info[0].IsString()) {
	    Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
	}
	Napi::String val = info[0].As<Napi::String>();
	name = val.Utf8Value();
    }
    signals::init_top(name);
}

Napi::Object signals::Init(Napi::Env env, Napi::Object exports) {



  exports.Set("clk", Napi::Function::New(env, signals::clkWrapped));



  exports.Set("clk2", Napi::Function::New(env, signals::clk2Wrapped));



  exports.Set("rstf", Napi::Function::New(env, signals::rstfWrapped));



  exports.Set("t0_valid", Napi::Function::New(env, signals::t0_validWrapped));



  exports.Set("t0_ready", Napi::Function::New(env, signals::t0_readyWrapped));



  exports.Set("i0_valid", Napi::Function::New(env, signals::i0_validWrapped));



  exports.Set("i0_ready", Napi::Function::New(env, signals::i0_readyWrapped));



  exports.Set("t1_valid", Napi::Function::New(env, signals::t1_validWrapped));



  exports.Set("t1_ready", Napi::Function::New(env, signals::t1_readyWrapped));



  exports.Set("i1_valid", Napi::Function::New(env, signals::i1_validWrapped));



  exports.Set("i1_ready", Napi::Function::New(env, signals::i1_readyWrapped));



  exports.Set("clk3", Napi::Function::New(env, signals::clk3Wrapped));



  exports.Set("clk4", Napi::Function::New(env, signals::clk4Wrapped));



  exports.Set("clk5", Napi::Function::New(env, signals::clk5Wrapped));



  exports.Set("t0_data", Napi::Function::New(env, signals::t0_dataWrapped));



  exports.Set("i0_data", Napi::Function::New(env, signals::i0_dataWrapped));



  exports.Set("t1_data", Napi::Function::New(env, signals::t1_dataWrapped));



  exports.Set("i1_data", Napi::Function::New(env, signals::i1_dataWrapped));


  exports.Set("eval", Napi::Function::New(env, signals::evalWrapped));
  exports.Set("finish", Napi::Function::New(env, signals::finishWrapped));
  exports.Set("init", Napi::Function::New(env, signals::initWrapped));
  return exports;

}
