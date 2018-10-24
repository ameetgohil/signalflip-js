{
  'targets': [
    {
      'target_name': 'n-api-test-native',
      'sources': [ 'src/n_api_test.cc' ],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")",
      "/usr/local/share/verilator/include",
      "./obj_dir"
      ],
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