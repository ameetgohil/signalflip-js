cmake_minimum_required(VERSION 3.0)
set (CMAKE_CXX_STANDARD 11)
project (dut)
#include_directories($CMAKE_JS_INC})

IF(DEFINED ENV{VERILATOR_ROOT})
  set(VERPATH $ENV{VERILATOR_ROOT})
#  message($ENV{VERILATOR_ROOT})
ELSE()
  set(VERPATH "/usr/local/share/verilator")
ENDIF()
message(${VERPATH})
#message($ENV{VERILATOR_ROOT})
file(GLOB SOURCE_FILES "cppsrc/*.cpp")
file(GLOB VERLIBS "obj_dir/*.a")
add_definitions(-DNAPI_EXPERIMENTAL) # -DSRC_NAPI_INL_H_)
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})
link_directories(${CMAKE_SOURCE_DIR}/obj_dir)
target_include_directories(${PROJECT_NAME}
  PRIVATE ${CMAKE_SOURCE_DIR}/node_modules/node-addon-api
  PRIVATE ${VERPATH}/include
  PRIVATE ${VERPATH}/include/vltstd
  PRIVATE ${VERPATH}/include/gtkwave
  PRIVATE ./obj_dir
  PRIVATE ${CMAKE_JS_INC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} ${VERLIBS})

