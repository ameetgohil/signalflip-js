[![npm version](https://badge.fury.io/js/signalflip-js.svg)](https://badge.fury.io/js/signalflip-js)

# signalflip-js
verilator testbench w/ Javascript using N-API

## Dependencies
- Verilator (version 4.0 or above)
- nvm
- gtkwave (optional)

## Instructions to run
```
> git clone https://github.com/ameetgohil/create-signalflip-js-tb.git testbench_name && rm -rf testbench_name/.git
> cd testbench_name
> nvm use || nvm install
> npm i --ignore-scripts
> npm run gen
> npm run all
```

## Show graph
```
gtkwave logs/vlt_dump.vcd
```
## TODO

- [ ] Add support for signals wider than 63 bits (BigInt)
- [ ] Testbench framework
