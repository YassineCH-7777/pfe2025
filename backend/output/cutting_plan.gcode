G21 ; Set units to millimeters
G90 ; Absolute positioning
T1 M6 ; Select tool 1 (6.0mm diameter, 50.0mm length)
M3 S1000 ; Start spindle at 1000 RPM
; Define a safe Z height to raise the tool between moves
#100=5.0  ; Safe Z height
G0 X0 Y0 Z0 ; Move to start position (safe height)
; Rectangle 1
G1 Z[#100] F500 ; Raise tool to safe height
G1 X0 Y0 F1000 ; Move to start of rectangle
G1 Z-5.0 F200 ; Lower tool into material (5.0mm depth)
G1 X200.0 Y0 F1000 ; Draw width
G1 X200.0 Y250.0 F1000 ; Draw height
G1 X0 Y250.0 F1000 ; Close rectangle
G1 X0 Y0 F1000 ; Return to start of rectangle
; Rectangle 2
G1 Z[#100] F500 ; Raise tool to safe height
G1 X200.0 Y0 F1000 ; Move to start of rectangle
G1 Z-5.0 F200 ; Lower tool into material (5.0mm depth)
G1 X400.0 Y0 F1000 ; Draw width
G1 X400.0 Y130.0 F1000 ; Draw height
G1 X200.0 Y130.0 F1000 ; Close rectangle
G1 X200.0 Y0 F1000 ; Return to start of rectangle
; Rectangle 3
G1 Z[#100] F500 ; Raise tool to safe height
G1 X400.0 Y0 F1000 ; Move to start of rectangle
G1 Z-5.0 F200 ; Lower tool into material (5.0mm depth)
G1 X550.0 Y0 F1000 ; Draw width
G1 X550.0 Y120.0 F1000 ; Draw height
G1 X400.0 Y120.0 F1000 ; Close rectangle
G1 X400.0 Y0 F1000 ; Return to start of rectangle
M5 ; Stop spindle
G1 Z[#100] F500 ; Raise tool to safe height
M02 ; End of program