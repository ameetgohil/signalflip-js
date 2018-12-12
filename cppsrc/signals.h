#include <napi.h>



namespace signals {

void init_top();
std::string hello();
int tick();
Napi::String HelloWrapped(const Napi::CallbackInfo& info);
Napi::Number TickWrapped(const Napi::CallbackInfo& info);
Napi::Object Init(Napi::Env env, Napi::Object exports);
};
