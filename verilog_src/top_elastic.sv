module top_elastic
  (
   input wire [31:0] t0_data,
   input wire        t0_valid,
   output wire       t0_ready,
   output reg [31:0] i0_data,
   output reg        i0_valid,
   input wire        i0_ready,

   input wire [31:0] t1_data,
   input wire        t1_valid,
   output wire       t1_ready,
   output reg [31:0] i1_data,
   output reg        i1_valid,
   input wire        i1_ready,
   
   input wire        clk,
   input wire        clk2,
   input wire        clk3,
   input wire        clk4,
   input wire        clk5,
   input wire        rstf
   );


`ifdef EB0
   assign t0_ready = rstf ? i0_ready:0;
   
   always @(*) begin
      i0_data = rstf ? t0_data << 2 : 0;
      i0_valid = rstf ? t0_valid : 0;
   end
`else
   logic             data_0_en;

   assign t0_ready = ~rstf ? 0:~i0_valid | i0_ready;

   assign data_0_en = t0_valid & t0_ready;

   always @(posedge clk or negedge rstf) begin
      if(!rstf) begin
         i0_data <= 0;
         i0_valid <= 0;
      end
      else begin
         if(data_0_en)
           i0_data <= t0_data<<2;
         i0_valid <= ~t0_ready | t0_valid;
      end
   end
`endif // !`ifdef EB0


// clkfreq 2.5x of clk   
`ifdef EB0
   assign t1_ready = rstf ? i1_ready:0;
   
   always @(*) begin
      i1_data = rstf ? t1_data << 2 : 0;
      i1_valid = rstf ? t1_valid : 0;
   end
`else

   logic             data_1_en;
   assign t1_ready = ~rstf ? 0:~i1_valid | i1_ready;

   assign data_1_en = t1_valid & t1_ready;

   always @(posedge clk2 or negedge rstf) begin
      if(!rstf) begin
         i1_data <= 0;
         i1_valid <= 0;
      end
      else begin
         if(data_1_en)
           i1_data <= t1_data<<2;
         i1_valid <= ~t1_ready | t1_valid;
      end
   end
`endif
endmodule
