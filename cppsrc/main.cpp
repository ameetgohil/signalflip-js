#include <napi.h>

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return signals::Init(env, exports);
}
  

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
