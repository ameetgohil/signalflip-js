# veri-js
verilator testbench w/ Javascript using N-API

## Dependencies
- Verilator (version 4.0 or above)
- nvm
- gtkwave (optional)

## Instructions to run
- Clone repository
```
> cd veri-js
> nvm i 10
> npm run compile
> npm i
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
