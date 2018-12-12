#include <napi.h>



namespace signals {

void init_top();
std::string hello();
int tick();
int set_in_quad(int val);
int get_in_quad();
Napi::String HelloWrapped(const Napi::CallbackInfo& info);
Napi::Number TickWrapped(const Napi::CallbackInfo& info);
Napi::Number SetInQuadWrapped(const Napi::CallbackInfo& info);
Napi::Number GetInQuadWrapped(const Napi::CallbackInfo& info);
Napi::Object Init(Napi::Env env, Napi::Object exports);
};
