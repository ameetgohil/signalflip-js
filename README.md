# veri-js
verilator testbench w/ Javascript using N-API

## Dependencies
- Verilator
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