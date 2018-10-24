#pragma once

#include <napi.h>
#include <verilated.h>
#include <Vtop.h>

class NApiTest : public Napi::ObjectWrap<NApiTest>
{
public:
    NApiTest(const Napi::CallbackInfo&);
    Napi::Value Greet(const Napi::CallbackInfo&);
    Napi::Value VerilatorInit(const Napi::CallbackInfo& info);
    Napi::Value Tick(const Napi::CallbackInfo& info);
    Napi::Value t0_data(const Napi::CallbackInfo& info);
    Napi::Value t0_valid(const Napi::CallbackInfo& info);
    Napi::Value t0_ready(const Napi::CallbackInfo& info);
    Napi::Value i0_data(const Napi::CallbackInfo& info);
    Napi::Value i0_valid(const Napi::CallbackInfo& info);
    Napi::Value i0_ready(const Napi::CallbackInfo& info);
    
    static Napi::Function GetClass(Napi::Env);
    

private:
    std::string _greeterName;
    Vtop* top; // Or use a const unique_ptr, or the VL_UNIQUE_PTR wrapper
};
