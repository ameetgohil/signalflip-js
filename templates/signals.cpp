#include "signals.h"
#include <verilated.h>
#include <sys/stat.h>

// Include model header, generated from Verilating "top.v"
#include "V<%= dutName %>.h"

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


V<%= dutName %>* top;
VerilatedVcdC* tfp;
void signals::init_top() {

  //Verilated::debug(0);
  // Set debug level, 0 is off, 9 is highest presently used
  Verilated::debug(0);
  // Randomization reset policy
  Verilated::randReset(2);

  // Construct the Verilated model, from Vtop.h generated from Verilating "top.v"
  top = new V<%= dutName %>; // Or use a const unique_ptr, or the VL_UNIQUE_PTR wrapper

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
    // Verilated::mkdir("logs");

    mkdir("logs",0x775);

    tfp->open("logs/vlt_dump.vcd");  // Open the dump file
    //  }
  //#endif

  // Set some inputs
}

  <% sigs.map(e => { %>
      <% if(e.dir == 'input') { %>
	<% if(e.width < 33) { %>
uint32_t signals::<%= e.name %>(uint32_t val) {
  top-><%= e.name %> = val;
  return top-><%= e.name %>;
}
	<% } else if (e.width < 64) {%>
uint64_t signals::<%= e.name %>(uint64_t val) {
  top-><%= e.name %> = val;
  return top-><%= e.name %>;
}
	<% } else { %>
uint32_t* signals::<%= e.name %>(uint32_t* val, int len) {
//  top-><%= e.name %> = val;
  return top-><%= e.name %>;
}
	<% } %>
      <% } else { %>
	<% if(e.width < 33) { %>
uint32_t signals::<%= e.name %>() {
  return top-><%= e.name %>;
}
	<% } else if (e.width < 64) {%>
uint64_t signals::<%= e.name %>() {
  return top-><%= e.name %>;
}
	<% } else { %>
uint32_t* signals::<%= e.name %>() {
  return top-><%= e.name %>;
}
	<% } %>
      <% } %>
  <% }) %>


int signals::eval() {
  static vluint64_t main_time = 0;
  main_time++;
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

<% sigs.map(e => { %>
    <% if(e.dir == 'input') { %>
      <% if(e.width < 33) { %>
Napi::Number signals::<%= e.name %>Wrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::<%= e.name %>(val.Int32Value()));
  } else {
    returnValue = Napi::Number::New(env, top-><%= e.name %>);
  }
  return returnValue;
}
      <% } else if (e.width < 64) {%>
Napi::Number signals::<%= e.name %>Wrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::<%= e.name %>(val.Int64Value()));
  } else {
    returnValue = Napi::Number::New(env, top-><%= e.name %>);
  }
  return returnValue;
}
      <% } else { %>
/*Napi::BigInt signals::<%= e.name %>Wrapped(const Napi::CallbackInfo& info) { 
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsNumber())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  if(info.Length() == 1) {
    Napi::Number val = info[0].As<Napi::Number>();
    returnValue = Napi::Number::New(env, signals::<%= e.name %>(val.Int64Value()));
  } else {
    returnValue = Napi::Number::New(env, top-><%= e.name %>);
  }
  return returnValue;
}*/
      <% } %>
    <% } else { %>
      <% if(e.width < 33) { %>
Napi::Number signals::<%= e.name %>Wrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  returnValue = Napi::Number::New(env, top-><%= e.name %>);
  return returnValue;
}
      <% } else if (e.width < 64) {%>
Napi::Number signals::<%= e.name %>Wrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::Number returnValue;
  returnValue = Napi::Number::New(env, top-><%= e.name %>);
  return returnValue;
}
      <% } else { %>
/*Napi::BigInt signals::<%= e.name %>Wrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::BigInt returnValue;
  returnValue = Napi::Number::New(env, top-><%= e.name %>);
  return returnValue;
  }*/
      <% } %>
    <% } %>
<% }) %>



void signals::evalWrapped(const Napi::CallbackInfo& info) {
    signals::eval();
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
    // Napi::Env env = info.Env();
    signals::init_top();
}

Napi::Object signals::Init(Napi::Env env, Napi::Object exports) {

<% sigs.map(e => { %>
    <% if (e.width < 64) { %>
  exports.Set("<%= e.name %>", Napi::Function::New(env, signals::<%= e.name %>Wrapped));
  <% } %>
<% }) %>
  exports.Set("eval", Napi::Function::New(env, signals::evalWrapped));
  exports.Set("finish", Napi::Function::New(env, signals::finishWrapped));
  exports.Set("init", Napi::Function::New(env, signals::initWrapped));
  
  return exports;
}

