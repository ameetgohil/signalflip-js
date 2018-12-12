#include <napi.h>
#include <verilated.h>


namespace signals {
  void init_top();
  std::string hello();
  Napi::String HelloWrapped(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
}
