#include "signals.h"
#include <verilated.h>
#include <sys/stat.h>
#include <string>

// Include model header, generated from Verilating "top.v"
#include "V<%= dutName %>.h"

// If "verilator --trace" is used, include the tracing class
//#if VM_TRACE
<% if(waveform_format == "fst") { %>
#include <verilated_fst_c.h>
VerilatedFstC* tfp;
<% } else { %>
# include <verilated_vcd_c.h>
VerilatedVcdC* tfp;
<% } %>
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

<% if(legacy) { %>
V<%= dutName %>* top;
<% } else { %>
std::unique_ptr<VerilatedContext> contextp{newVerilatedContext};
std::unique_ptr<V<%= dutName %>> top{new V<%= dutName %>{contextp.get(), "<%= dutName %>"}};
<% } %>
void signals::init_top(std::string name) {

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
    //VL_PRINTF("Enabling waves into logs/vlt_dump.vcd...\n");
<% if(waveform_format == "fst") { %>
    tfp = new VerilatedFstC;
<% } else { %>
    tfp = new VerilatedVcdC;
<% } %>
    top->trace(tfp, 99);  // Trace 99 levels of hierarchy
    Verilated::mkdir("logs");

    //mkdir("logs",0x775);
<% if(waveform_format == "fst") { %>
	std::string f = "logs/" + name + ".fst";
<% } else { %>
	std::string f = "logs/" + name + ".vcd";
<% } %>
       tfp->open(f.c_str());

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
	<% } else if (e.width < 65) {%>
uint64_t signals::<%= e.name %>(uint64_t val) {
  top-><%= e.name %> = val;
  return top-><%= e.name %>;
}
	<% } else { %>
uint32_t* signals::<%= e.name %>(uint32_t* val) {
    //std::cout << "val: " << val[0] << ", " << val[1] << ", " << val[2] << ", " << val[3] << "\n";
    //top-><%= e.name %> = val;
    <% _.range(Math.ceil(e.width/32.0)).map( x => { %>
    top-><%= e.name %>[<%= x %>] = val[<%= x %>];
    <% }); %>
    //std::cout << "<%= e.name %>: " << top-><%= e.name %>[0] << ", " << top-><%= e.name %>[1] << ", " << top-><%= e.name %>[2] << "\n";
  return top-><%= e.name %>;
}
	<% } %>
      <% } else { %>
	<% if(e.width < 33) { %>
uint32_t signals::<%= e.name %>() {
  return top-><%= e.name %>;
}
	<% } else if (e.width < 65) {%>
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
      <% } else if (e.width < 65) {%>
// Signals of width 33 to 64 use BigInt
Napi::BigInt signals::<%= e.name %>Wrapped(const Napi::CallbackInfo& info) {
  int sign_bit = 0;
  bool lossless = false;
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !(info[0].IsBigInt()))) {
    Napi::TypeError::New(env, "BigInt expected").ThrowAsJavaScriptException();
  }
    
  Napi::BigInt returnValue;
  if(info.Length() == 1) {
    Napi::BigInt val = info[0].As<Napi::BigInt>();
    returnValue = Napi::BigInt::New(env, signals::<%= e.name %>(val.Uint64Value(&lossless)));
  } else {
    returnValue = Napi::BigInt::New(env, top-><%= e.name %>);
  }
  return returnValue;
}
      <% } else { %>
Napi::BigInt signals::<%= e.name %>Wrapped(const Napi::CallbackInfo& info) {
    int sign_bit = 0;
    size_t size = <%= Math.ceil(e.width/64.0) %>;
    WideSignal bigint_ptr;
    bigint_ptr.sig64 = (uint64_t*)malloc(<%= Math.ceil(e.width/64.0) %> * sizeof(uint64_t));
    <% _.range(Math.ceil(e.width/64.0)).map( x => { %>
	    bigint_ptr.sig64[<%= x %>] = 0;
    <% }); %>
  Napi::Env env = info.Env();
  if(info.Length() > 1 || (info.Length() == 1 && !info[0].IsBigInt())) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::BigInt returnValue;
  if(info.Length() == 1) {
    Napi::BigInt val = info[0].As<Napi::BigInt>();
    val.ToWords(&sign_bit, &size, bigint_ptr.sig64);
    //std::cout << bigint_ptr.sig64[0] << ", " << bigint_ptr.sig64[1] << "\n";
    WideSignal getVal;
    getVal.sig32=signals::<%= e.name %>(bigint_ptr.sig32);
    returnValue = Napi::BigInt::New(env, sign_bit, size, getVal.sig64);
  } else {
      *(bigint_ptr.sig32)=*(top-><%= e.name %>);
      returnValue = Napi::BigInt::New(env, sign_bit, size, bigint_ptr.sig64);
  }
  return returnValue;
}
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
      <% } else if (e.width < 65) {%>
Napi::BigInt signals::<%= e.name %>Wrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "BigInt expected").ThrowAsJavaScriptException();
  }
    
  Napi::BigInt returnValue;
  returnValue = Napi::BigInt::New(env, top-><%= e.name %>);
  return returnValue;
}
      <% } else { %>
Napi::BigInt signals::<%= e.name %>Wrapped(const Napi::CallbackInfo& info) {
    int sign_bit = 0;
    int size = <%= Math.ceil(e.width/64.0) %>;
    WideSignal bigint_ptr;
    bigint_ptr.sig64 = (uint64_t*)malloc(<%= Math.ceil(e.width/64.0) %> * sizeof(uint64_t));
    <% _.range(Math.ceil(e.width/64.0)).map( x => { %>
	    bigint_ptr.sig64[<%= x %>] = 0;
    <% }); %>
  Napi::Env env = info.Env();
  if(info.Length() > 0) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }
    
  Napi::BigInt returnValue;
    *(bigint_ptr.sig32)=*(top-><%= e.name %>);
    //std::cout << "get: " << bigint_ptr.sig32[0] << ", " << bigint_ptr.sig32[1] << ", " << bigint_ptr.sig32[2] << ", " << bigint_ptr.sig32[3] << ", " << bigint_ptr.sig32[4] << ", " << bigint_ptr.sig32[5] << "\n";
  returnValue = Napi::BigInt::New(env, sign_bit, size, bigint_ptr.sig64);
  return returnValue;
  }
      <% } %>
    <% } %>
<% }) %>



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

<% sigs.map(e => { %>

  exports.Set("<%= e.name %>", Napi::Function::New(env, signals::<%= e.name %>Wrapped));

<% }) %>
  exports.Set("eval", Napi::Function::New(env, signals::evalWrapped));
  exports.Set("finish", Napi::Function::New(env, signals::finishWrapped));
  exports.Set("init", Napi::Function::New(env, signals::initWrapped));
  return exports;

}
