# SSIE
Solar System Integration Engine

The Solar System Integration Engine (SSIE) attempts to implement real-time integration of the positions of the planets and the Moon from initial conditions exported from DE422 for each new year. For each requested TDB time, the positions at the closest noon are integrated with 8th order Adams-Bashforth-Moulton method using the full relativistic PPN equations. Position at the requested time is integrated with RK4 from the state at noon using Newtonian equations.