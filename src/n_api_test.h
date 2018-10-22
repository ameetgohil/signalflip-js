#pragma once

#include <napi.h>

class NApiTest : public Napi::ObjectWrap<NApiTest>
{
public:
    NApiTest(const Napi::CallbackInfo&);
    Napi::Value Greet(const Napi::CallbackInfo&);

    static Napi::Function GetClass(Napi::Env);

private:
    std::string _greeterName;
};
