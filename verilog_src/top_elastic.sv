module top_elastic
  (
   input wire [31:0] t0_data,
   input wire        t0_valid,
   output wire       t0_ready,
   output reg [31:0] i0_data,
   output reg        i0_valid,
   input wire        i0_ready,
   input wire        clk,
   input wire        rstf
   );


`ifdef EB0
   assign t0_ready = rstf ? i0_ready:0;
   
   always @(*) begin
      i0_data = rstf ? t0_data << 2 : 0;
      i0_valid = rstf ? t0_valid : 0;
   end
`else

   logic      data_en;
   assign t0_ready = ~rstf ? 0:~i0_valid | i0_ready;

   assign data_en = t0_valid & t0_ready;

   always @(posedge clk or negedge rstf) begin
      if(!rstf) begin
         i0_data <= 0;
         i0_valid <= 0;
      end
      else begin
         if(data_en)
           i0_data <= t0_data<<2;
         i0_valid <= ~t0_ready | t0_valid;
      end
   end
`endif
endmodule
