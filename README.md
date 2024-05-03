# SSIE
Solar System Integration Engine

The Solar System Integration Engine (SSIE) attempts to implement real-time integration of the positions of the planets and the Moon from initial conditions exported from DE422 for each new year in the interval 1900-2100. For each requested TDB time, the positions at the closest noon are integrated with 8th order Adams-Bashforth-Moulton method using the full relativistic PPN equations. Position at the requested time is integrated with RK4 from the state at noon using Newtonian equations.

1.103291588456589   0.434072316107957   0.499030736683958   0.501330086602823   1.477372285843128
   0.557803253978189   0.278839299500502   0.244573157071886   0.247600200751253   0.251209398400652
   0.019454350453341

From comparison to DE422 exports 1900-2100, it seems that the mean and maximum errors with respect to DE422 are as follows:
| Target  | Max. Error (km)   | Mean Error (km)   |
| ------- |:------------------: -----------------:|
| Mercury | 1.103291588456589 | 0.234647640795888 |
| Venus   | 0.434072316107957 | 0.134578149837895 |
| Earth   | 0.499030736683958 | 0.098347978485213 |
| Mars    | 1.477372285843128 | 0.060360260374254 |
| Jupiter | 0.557803253978189 | 0.046755323475495 |
| Saturn  | 0.278839299500502 | 0.037325515293097 |   
| Uranus  | 0.244573157071886 | 0.036408359080810 |
| Neptune | 0.247600200751253 | 0.036328739307928 |
| Pluto   | 0.251209398400652 | 0.036323973415330 |
| Moon    | 0.019454350453341 | 0.003747422334109 |
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