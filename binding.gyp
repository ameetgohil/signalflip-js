{
  'targets': [
    {
      'target_name': 'dut',
      'sources': [
      		 'cppsrc/main.cpp',
		 'cppsrc/signals.cpp'
      		 ],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")",
      "/usr/local/share/verilator/include",
      "./obj_dir"
      ],
      'libraries': ["/home/qubits/proj/veri-js/obj_dir/Vtop__ALL.a"],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
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