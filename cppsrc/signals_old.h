#include <napi.h>



namespace signals {

  void init_top();
  std::string hello();
  int tick();
  int in_quad(uint64_t val);
  int fastclk(uint32_t val);
  int clk(uint32_t val);
  int reset_l(uint32_t val);
  uint32_t* in_wide(uint32_t* val, int words);
  int eval();
  
  Napi::String HelloWrapped(const Napi::CallbackInfo& info);
  Napi::Number TickWrapped(const Napi::CallbackInfo& info);
  Napi::Number in_quadWrapped(const Napi::CallbackInfo& info);
  Napi::Number fastclkWrapped(const Napi::CallbackInfo& info);
  Napi::Number clkWrapped(const Napi::CallbackInfo& info);
  Napi::Number reset_lWrapped(const Napi::CallbackInfo& info);
  //  Napi::BigInt in_wideWrapped(const Napi::CallbackInfo& info);
  Napi::Number evalWrapped(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
};
