#include "napi.h"
#include <string>

namespace signals {

    void init_top(std::string name);
  
  int tick();
  
      
	
  uint32_t t0_valid(uint32_t val);
	
      
  
      
	
  uint32_t t0_ready();
	
      
  
      
	
  uint32_t i0_valid();
	
      
  
      
	
  uint32_t i0_ready(uint32_t val);
	
      
  
      
	
  uint32_t clk(uint32_t val);
	
      
  
      
	
  uint32_t rstf(uint32_t val);
	
      
  
      
	
  uint32_t t0_data(uint32_t val);
	
      
  
      
	
  uint32_t i0_data();
	
      
  
  int eval();
  int finish();
  
  Napi::Number TickWrapped(const Napi::CallbackInfo& info);
  
      
  Napi::Number t0_validWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t0_readyWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i0_validWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i0_readyWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number clkWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number rstfWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number t0_dataWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number i0_dataWrapped(const Napi::CallbackInfo& info);
      
  
  void evalWrapped(const Napi::CallbackInfo& info);
  void finishWrapped(const Napi::CallbackInfo& info);
  void initWrapped(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
};

