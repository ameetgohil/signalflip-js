#include "napi.h"


namespace signals {

  void init_top();
  
  int tick();
  <% sigs.map(sig => { %>
      <% if(sig.dir == 'input') { %>
	<% if(sig.width < 33) { %>
  uint32_t <%= sig.name %>(uint32_t val);
	<% } else if (sig.width < 64) {%>
  uint64_t <%= sig.name %>(uint64_t val);
	<% } else { %>
  uint32_t* <%= sig.name %>(uint32_t* val, int len);
	<% } %>
      <% } else { %>
	<% if(sig.width < 33) { %>
  uint32_t <%= sig.name %>();
	<% } else if (sig.width < 64) {%>
  uint64_t <%= sig.name %>();
	<% } else { %>
  uint32_t* <%= sig.name %>();
	<% } %>
      <% } %>
  <% }) %>
  int eval();
  int finish();
  
  Napi::Number TickWrapped(const Napi::CallbackInfo& info);
  <% sigs.map(sig => { %>
      <% if(sig.width < 64) { %>
  Napi::Number <%= sig.name %>Wrapped(const Napi::CallbackInfo& info);
      <% } else  {%>
  //Napi::BigInt <%= sig.name %>Wrapped(const Napi::CallbackInfo& info);
      <% } %>
  <% }) %>
  void evalWrapped(const Napi::CallbackInfo& info);
  void finishWrapped(const Napi::CallbackInfo& info);
  void initWrapped(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
};
