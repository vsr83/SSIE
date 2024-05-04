# SSIE
Solar System Integration Engine

The Solar System Integration Engine (SSIE) attempts to implement real-time integration of the positions of the planets and the Moon from initial conditions exported from DE422 for each new year in the interval 1900-2100. For each requested TDB time, the positions at the closest noon are integrated with 8th order Adams-Bashforth-Moulton method using the full relativistic PPN equations. Position at the requested time is integrated with RK4 from the state at noon using Newtonian equations.

The implementation is based on my another repository [JPL_Ephem](https://github.com/vsr83/JPL_Ephem).

## Accuracy
From comparison to positions generated using DE422 with [jplephem](https://pypi.org/project/jplephem/) for the time period 1900-2100, it seems that the mean and maximum errors with respect to DE422 are as follows:
| Target  | Max. Error (km)   | Mean Error (km)   | Max. Error (mas)   | Mean Error (mas)  |
| ------- |:-----------------:|:-----------------:|:------------------:| -----------------:|
| Mercury | 1.103291588456589 | 0.234647640795888 | 1.583638833741311  | 0.235231268403187 |
| Venus   | 0.434072316107957 | 0.134578149837895 | 0.925710609951289  | 0.163156069801466 |
| Earth   | 0.499030736683958 | 0.098347978485213 | NA                 | NA                |
| Mars    | 1.477372285843128 | 0.060360260374254 | 2.105873475122087  | 0.082023687175836 |
| Jupiter | 0.557803253978189 | 0.046755323475495 | 0.196609069352983  | 0.017411954570040 |
| Saturn  | 0.278839299500502 | 0.037325515293097 | 0.119987798115303  | 0.009594693714536 |
| Uranus  | 0.244573157071886 | 0.036408359080810 | 0.048408484513444  | 0.004771221737666 |
| Neptune | 0.247600200751253 | 0.036328739307928 | 0.030104055336818  | 0.003064592014579 |
| Pluto   | 0.251209398400652 | 0.036323973415330 | 0.027936201940944  | 0.002577668161448 |
| Moon    | 0.019454350453341 | 0.003747422334109 | 10.975927882132135 | 1.985672485818912 |

The angular error is expressed w.r.t. Earth. It is likely that the accuracy could be significantly improved.

## Simple Example
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

## References
1. Newhall, Standish, Williams - DE 102: a numerically integrated ephemeris of the Moon and planets spanning forty-four centuries, Astronomy and Astrophysics, 125, 150-167, 1983 [link](https://adsabs.harvard.edu/full/1983A%26A...125..150N).
2. Urban, Seidelmann - Explanatory Supplement to the Astronomical Almanac, 3rd edition, University Science Books, 2013. [link](https://www.amazon.com/Explanatory-Supplement-Astronomical-Almanac-Urban/dp/1891389858)
3. Folkner, Williams, Boggs - The Planetary and Lunar Ephemeris DE 421, IPN Progress Report 42-178, 2009. [link](https://ipnpr.jpl.nasa.gov/progress_report/42-178/178C.pdf)
