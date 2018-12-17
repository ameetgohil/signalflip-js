const dut = require('./build/Release/dut.node');
console.log('dut: ', dut);
console.log(dut.hello());
for(var i=1; i<1000; i++) {
    dut.in_quad(dut.in_quad() + 0x12);
    //dut.tick();
//    i
    dut.fastclk(dut.fastclk() ? 0:1);
    if(i%10 == 3) {
	dut.clk(1);
    }
    if(i%10 == 8) {
	dut.clk(0);
    }
    if(i > 1 && i < 10) {
	dut.reset_l(0);
    } else {
	dut.reset_l(1);
    }

    dut.eval();
//    console.log(dut.tick());
}

/*var EventEmitter = require('events').EventEmitter,
    puts = require('sys').puts;

var Ticker = function( interval ){
  var self = this,
      nextTick = function(){
    self.emit('tick', Math.random() * 1000);
    setTimeout(nextTick, interval);
  }

  nextTick();
};

// Extend from EventEmitter 'addListener' and 'emit' methods
Ticker.prototype = new EventEmitter;

// A ticker instance with an interval of 5 seconds
var ticktock = new Ticker( 5000 );

// Bind an event handler to the 'tick' event
ticktock.addListener('tick', function( number ) {
  puts('number emitted: '+ number);
});*/

module.exports = dut;
