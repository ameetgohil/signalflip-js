#include <napi.h>



namespace signals {

void init_top();
std::string hello();
int tick();
int set_in_quad(int val);
int get_in_quad();
int fastclk(int val);
int clk(int val);
int reset_l(int val);
int eval();
Napi::String HelloWrapped(const Napi::CallbackInfo& info);
Napi::Number TickWrapped(const Napi::CallbackInfo& info);
Napi::Number SetInQuadWrapped(const Napi::CallbackInfo& info);
Napi::Number GetInQuadWrapped(const Napi::CallbackInfo& info);
Napi::Number fastclkWrapped(const Napi::CallbackInfo& info);
Napi::Number clkWrapped(const Napi::CallbackInfo& info);
Napi::Number reset_lWrapped(const Napi::CallbackInfo& info);
Napi::Number evalWrapped(const Napi::CallbackInfo& info);
Napi::Object Init(Napi::Env env, Napi::Object exports);
};
