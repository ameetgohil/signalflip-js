#include "napi.h"
#include <string>

namespace signals {

    void init_top(std::string name);
  
  int tick();
  <% sigs.map(sig => { %>
      <% if(sig.dir == 'input') { %>
	<% if(sig.width < 33) { %>
  void <%= sig.name %>Set(Napi::CallbackInfo& info);
	<% } else if (sig.width < 65) {%>
  void <%= sig.name %>Set(Napi::CallbackInfo& info);
	<% } else { %>
  void <%= sig.name %>Set(Napi::CallbackInfo& info);
	<% } %>
		  <% } %>
	<% if(sig.width < 33) { %>
Napi::Number <%= sig.name %>Get(Napi::CallbackInfo& info);
	<% } else if (sig.width < 65) {%>
Napi::Number <%= sig.name %>Get(Napi::CallbackInfo& info);
	<% } else { %>
Napi::BigInt <%= sig.name %>Get(Napi::CallbackInfo& info);
	<% } %>

	       <% }); %>
  int eval();
  int finish();
  
  Napi::Number TickWrapped(const Napi::CallbackInfo& info);
  <% sigs.map(sig => { %>
      <% if(sig.width < 65) { %>
  Napi::Number <%= sig.name %>Wrapped(const Napi::CallbackInfo& info);
      <% } else  {%>
  Napi::BigInt <%= sig.name %>Wrapped(const Napi::CallbackInfo& info);
      <% } %>
  <% }) %>
  void evalWrapped(const Napi::CallbackInfo& info);
  void finishWrapped(const Napi::CallbackInfo& info);
  void initWrapped(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
};
