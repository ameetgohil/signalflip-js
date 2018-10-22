#include "n_api_test.h"
#include <verilated.h>
#include "Vtop.h"

#include <verilated_vcd_c.h>

// Current simulation time (64-bit unsigned)
vluint64_t main_time = 0;
// Called by $time Verilog
double sc_time_stamp() {
  return main_time;
}

using namespace Napi;

NApiTest::NApiTest(const Napi::CallbackInfo& info) : ObjectWrap(info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1) {
        Napi::TypeError::New(env, "Wrong number of arguments")
          .ThrowAsJavaScriptException();
        return;
    }

    if (!info[0].IsString()) {
        Napi::TypeError::New(env, "You need to name yourself")
          .ThrowAsJavaScriptException();
        return;
    }

    this->_greeterName = info[0].As<Napi::String>().Utf8Value();
}

Napi::Value NApiTest::Greet(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

    if (info.Length() < 1) {
        Napi::TypeError::New(env, "Wrong number of arguments")
          .ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsString()) {
        Napi::TypeError::New(env, "You need to introduce yourself to greet")
          .ThrowAsJavaScriptException();
        return env.Null();
    }

    Napi::String name = info[0].As<Napi::String>();

    printf("Hello %s\n", name.Utf8Value().c_str());
    printf("I am %s\n", this->_greeterName.c_str());

    return Napi::String::New(env, this->_greeterName);
}

Napi::Value NApiTest::VerilatorInit(const::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Verilated::commandArgs(info[0], info[1]);


  // Set debug level, 0 is off, 9 is highest presetnly used
  Veerilated::debug(0);

  //Randomization reset policy
  Verilated::randReset(2);

  //Construct the Verilated model, from Vtop.h generated from Verilating "top.v"
  Vtop* top = new Vtop; // Or use a const unique_ptr, or the VL_UNIQUE_PTR wrapper

  VerilatedVcdC* tfp = NULL;
  Verilated::traceEverOn(true);
  VL_PRINTF("Enabling waves into logs/vlt_dump.vcd...\n");
  tfp = new VerilatedVcdC;
  top->trace(tfp, 99); // Trace 99 levels of hierarchy
  Verilated::mkdir("logs");
  tfp->open("logs/vlt_dump.vcd"); //Open the dump file

  top->rstf = 0;
  top->clk = 0;
  top->t0_data = 0;
  top->t0_valid = 0;
  top->i0_ready = 1;

  return Napi::Value::Value();
}

Napi::Value NApiTest::Tick(const Napi::CallbackInfo& info) {
  top->clk = !top->clk;
  top->eval();
  return Napi::Value::Value();
}

Napi::Value NApiTest::t0_data(const Napi::CallbackInfo& info) {
  if(info[0].IsNumber()) {
    top->t0_data;
  }
  return Napi::Value::Value();
}

Napi::Value NApiTest::t0_valid(const Napi::CallbackInfo& info) {
  return Napi::Value::Value();
}

Napi::Value NApiTest::t0_ready(const Napi::CallbackInfo& info) {
  return Napi::Value::Value();
}

Napi::Value NApiTest::i0_data(const Napi::CallbackInfo& info) {
  return Napi::Value::Value();
}

Napi::Value NApiTest::i0_valid(const Napi::CallbackInfo& info) {
  return Napi::Value::Value();
}

Napi::Value NApiTest::i0_ready(const Napi::CallbackInfo& info) {
  return Napi::Value::Value();
}

Napi::Function NApiTest::GetClass(Napi::Env env) {
    return DefineClass(env, "NApiTest", {
        NApiTest::InstanceMethod("greet", &NApiTest::Greet),
    });
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    Napi::String name = Napi::String::New(env, "NApiTest");
    exports.Set(name, NApiTest::GetClass(env));
    return exports;
}

NODE_API_MODULE(addon, Init)
