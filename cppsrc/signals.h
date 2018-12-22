#include "napi.h"


namespace signals {

  void init_top();
  
  int tick();
  
      
	
  uint32_t clk(uint32_t val);
	
      
  
      
	
  uint32_t fastclk(uint32_t val);
	
      
  
      
	
  uint32_t reset_l(uint32_t val);
	
      
  
      
	
  uint32_t out_small();
	
      
  
      
	
  uint64_t out_quad();
	
      
  
      
	
  uint32_t* out_wide();
	
      
  
      
	
  uint32_t in_small(uint32_t val);
	
      
  
      
	
  uint64_t in_quad(uint64_t val);
	
      
  
      
	
  uint32_t* in_wide(uint32_t* val, int len);
	
      
  
  int eval();
  
  Napi::Number TickWrapped(const Napi::CallbackInfo& info);
  
      
  Napi::Number clkWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number fastclkWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number reset_lWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number out_smallWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number out_quadWrapped(const Napi::CallbackInfo& info);
      
  
      
  //Napi::BigInt out_wideWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number in_smallWrapped(const Napi::CallbackInfo& info);
      
  
      
  Napi::Number in_quadWrapped(const Napi::CallbackInfo& info);
      
  
      
  //Napi::BigInt in_wideWrapped(const Napi::CallbackInfo& info);
      
  
  Napi::Number evalWrapped(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
};
