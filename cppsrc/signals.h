#include "napi.h"
#include <string>

namespace signals {

    void init_top(std::string name);
  
  int tick();
  
      
	
  uint32_t clk(uint32_t val);
	
      
  
      
	
  uint32_t clk2(uint32_t val);
	
      
  
      
	
  uint32_t rstf(uint32_t val);
	
      
  
      
	
  uint32_t t0_valid(uint32_t val);
	
      
  
      
	
  uint32_t t0_ready();
	
      
  
      
	
  uint32_t i0_valid();
	
      
  
      
	
  uint32_t i0_ready(uint32_t val);
	
      
  
      
	
  uint32_t t1_valid(uint32_t val);
	
      
  
      
	
  uint32_t t1_ready();
	
      
  
      
	
  uint32_t i1_valid();
	
      
  
      
	
  uint32_t i1_ready(uint32_t val);
	
      
  
      
	
  uint32_t t2_valid(uint32_t val);
	
      
  
      
	
  uint32_t t2_ready();
	
      
  
      
	
  uint32_t i2_valid();
	
      
  
      
	
  uint32_t i2_ready(uint32_t val);
	
      
  
      
	
  uint32_t t3_valid(uint32_t val);
	
      
  
      
	
  uint32_t t3_ready();
	
      
  
      
	
  uint32_t i3_valid();
	
      
  
      
	
  uint32_t i3_ready(uint32_t val);
	
      
  
      
	
  uint32_t clk3(uint32_t val);
	
      
  
      
	
  uint32_t clk4(uint32_t val);
	
      
  
      
	
  uint32_t clk5(uint32_t val);
	
      
  
      
	
  uint32_t t0_data(uint32_t val);
	
      
  
      
	
  uint32_t i0_data();
	
      
  
      
	
  uint32_t* t2_data(uint32_t* val);
	
      
  
      
	
  uint32_t* i2_data();
	
      
  
      
	
  uint32_t t3_data(uint32_t val);
	
      
  
      
	
  uint32_t i3_data();
	
      
  
      
	
  uint64_t t1_data(uint64_t val);
	
      
  
      
	
  uint64_t i1_data();
	
      
  
  int eval(uint64_t time);
  int finish();
  
  Napi::Number TickWrapped(const Napi::CallbackInfo& info);
  
      
  Napi::Number clkWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number clk2Wrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number rstfWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t0_validWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t0_readyWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i0_validWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i0_readyWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t1_validWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t1_readyWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i1_validWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i1_readyWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t2_validWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t2_readyWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i2_validWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i2_readyWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t3_validWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t3_readyWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i3_validWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i3_readyWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number clk3Wrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number clk4Wrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number clk5Wrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t0_dataWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i0_dataWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::BigInt t2_dataWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::BigInt i2_dataWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t3_dataWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i3_dataWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::BigInt t1_dataWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::BigInt i1_dataWrapped(const Napi::CallbackInfo& info);
      
  
  void evalWrapped(const Napi::CallbackInfo& info);
  void finishWrapped(const Napi::CallbackInfo& info);
  void initWrapped(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
};

