{
  'targets': [
    {
      'target_name': 'dut',
#      'sources': [
#      		 'cppsrc/main.cpp',
#		 'cppsrc/signals.cpp',
#		 'obj_dir/Vtop_elastic.cpp',
#		 'obj_dir/Vtop_elastic__Syms.cpp',
#		 'obj_dir/Vtop_elastic__Trace.cpp',
#		 'obj_dir/Vtop_elastic__Trace__Slow.cpp'
#		 '/usr/local/share/verilator/include/verilated.cpp'
#     		 ],
      'sources': ["<!@(node -p \"require('./getconfig.js').sources\")"],
#      'sources': '<!(["node", ])',
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")",
      "<!@(node -p \"require('./getconfig.js').libraries\")"
#      "/usr/local/share/verilator/include",
#      "./obj_dir"
      ],
     'libraries': ["../obj_dir/verilator_global_libs.a"],
#      'ld_flags': ["-L/home/qubits/proj/veri-js/obj_dir/"],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions', '-MMD', '-MP', '-DVL_DEBUG=1' ],
#      'cflags!': [ '-fno-exceptions', '-fPIC'],
#      'cflags_cc!': [ '-fno-exceptions', '-fPIC'],

      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'CLANG_CXX_LIBRARY': 'libc++',
        'MACOSX_DEPLOYMENT_TARGET': '10.7'
      },
      'msvs_settings': {
        'VCCLCompilerTool': { 'ExceptionHandling': 1 },
      }
    }
  ]
}