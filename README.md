# SSIE
Solar System Integration Engine

The Solar System Integration Engine (SSIE) attempts to implement real-time integration of the positions of the planets and the Moon from initial conditions exported from DE422 for each new year in the interval 1900-2100. For each requested TDB time, the positions at the closest noon are integrated with 8th order Adams-Bashforth-Moulton method using the full relativistic PPN equations. Position at the requested time is integrated with RK4 from the state at noon using Newtonian equations.

```
<html>
    <head>
        <script src="./SSIE.js"></script>
    </head>
    <body>
        <script>
            const engine = new SSIE.Engine();
            const state = engine.get(2460433.123);
            console.log(state);
            // Relative position of the Earth w.r.t. Sun.
            const posEarthAu = SSIE.MathUtils.vecDiff(state.pointMasses[3].r, 
                state.pointMasses[0].r);
            const posEarthKm = SSIE.MathUtils.vecMul(posEarthAu, SSIE.constants.au);
            console.log(posEarthKm);

            // The above produces:
            // -111431568.0911878, -93209397.36383773, -40403983.0859398
            // JPL Horizon produces:
            // -1.114315682231201E+08, -9.320939705000147E+07, -4.040398323582593E+07
            // corresponding to 371.9 meter error.
        </script>
    </body>
</html>
```