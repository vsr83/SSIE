import { checkFloat, checkFloatArray} from './common';
import { Polynomials } from '../src/Polynomials';
import 'mocha';

describe('Polynomials', function() {

    it('legendreValue', function() {
        checkFloat(Polynomials.legendreValue(0, -1.0), 1.0, 1e-10);
        checkFloat(Polynomials.legendreValue(0, -0.5), 1.0, 1e-10);
        checkFloat(Polynomials.legendreValue(0,  0.0), 1.0, 1e-10);
        checkFloat(Polynomials.legendreValue(0,  0.5), 1.0, 1e-10);
        checkFloat(Polynomials.legendreValue(0,  1.0), 1.0, 1e-10);

        checkFloat(Polynomials.legendreValue(1, -1.0), -1.0, 1e-10);
        checkFloat(Polynomials.legendreValue(1, -0.5), -0.5, 1e-10);
        checkFloat(Polynomials.legendreValue(1,  0.0),  0.0, 1e-10);
        checkFloat(Polynomials.legendreValue(1,  0.5),  0.5, 1e-10);
        checkFloat(Polynomials.legendreValue(1,  1.0),  1.0, 1e-10);

        checkFloat(Polynomials.legendreValue(2, -1.0),    1.0, 1e-10);
        checkFloat(Polynomials.legendreValue(2, -0.5), -0.125, 1e-10);
        checkFloat(Polynomials.legendreValue(2,  0.0),   -0.5, 1e-10);
        checkFloat(Polynomials.legendreValue(2,  0.5), -0.125, 1e-10);
        checkFloat(Polynomials.legendreValue(2,  1.0),    1.0, 1e-10);

        checkFloat(Polynomials.legendreValue(3, -1.0),    -1.0, 1e-10);
        checkFloat(Polynomials.legendreValue(3, -0.5),  0.4375, 1e-10);
        checkFloat(Polynomials.legendreValue(3,  0.0),     0.0, 1e-10);
        checkFloat(Polynomials.legendreValue(3,  0.5), -0.4375, 1e-10);
        checkFloat(Polynomials.legendreValue(3,  1.0),     1.0, 1e-10);

        checkFloat(Polynomials.legendreValue(4, -1.0),        1.0, 1e-10);
        checkFloat(Polynomials.legendreValue(4, -0.5), -0.2890625, 1e-10);
        checkFloat(Polynomials.legendreValue(4,  0.0),      0.375, 1e-10);
        checkFloat(Polynomials.legendreValue(4,  0.5), -0.2890625, 1e-10);
        checkFloat(Polynomials.legendreValue(4,  1.0),        1.0, 1e-10);

        checkFloat(Polynomials.legendreValue(5, -1.0),        -1.0, 1e-10);
        checkFloat(Polynomials.legendreValue(5, -0.5), -0.08984375, 1e-10);
        checkFloat(Polynomials.legendreValue(5,  0.0),         0.0, 1e-10);
        checkFloat(Polynomials.legendreValue(5,  0.5),  0.08984375, 1e-10);
        checkFloat(Polynomials.legendreValue(5,  1.0),         1.0, 1e-10);

        checkFloat(Polynomials.legendreValue(6, -1.0),          1.0, 1e-10);
        checkFloat(Polynomials.legendreValue(6, -0.5), 0.3232421875, 1e-10);
        checkFloat(Polynomials.legendreValue(6,  0.0),      -0.3125, 1e-10);
        checkFloat(Polynomials.legendreValue(6,  0.5), 0.3232421875, 1e-10);
        checkFloat(Polynomials.legendreValue(6,  1.0),          1.0, 1e-10);
    });
    it('legendreDeriv', function() {
        checkFloat(Polynomials.legendreDeriv(0, -1.0), 0.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(0, -0.5), 0.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(0,  0.0), 0.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(0,  0.5), 0.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(0,  1.0), 0.0, 1e-10);

        checkFloat(Polynomials.legendreDeriv(1, -1.0), 1.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(1, -0.5), 1.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(1,  0.0), 1.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(1,  0.5), 1.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(1,  1.0), 1.0, 1e-10);

        checkFloat(Polynomials.legendreDeriv(2, -1.0), -3.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(2, -0.5), -1.5, 1e-10);
        checkFloat(Polynomials.legendreDeriv(2,  0.0),  0.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(2,  0.5),  1.5, 1e-10);
        checkFloat(Polynomials.legendreDeriv(2,  1.0),  3.0, 1e-10);

        checkFloat(Polynomials.legendreDeriv(3, -1.0),   6.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(3, -0.5), 0.375, 1e-10);
        checkFloat(Polynomials.legendreDeriv(3,  0.0),  -1.5, 1e-10);
        checkFloat(Polynomials.legendreDeriv(3,  0.5), 0.375, 1e-10);
        checkFloat(Polynomials.legendreDeriv(3,  1.0),   6.0, 1e-10);

        checkFloat(Polynomials.legendreDeriv(4, -1.0),   -10.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(4, -0.5),  1.5625, 1e-10);
        checkFloat(Polynomials.legendreDeriv(4,  0.0),       0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(4,  0.5), -1.5625, 1e-10);
        checkFloat(Polynomials.legendreDeriv(4,  1.0),    10.0, 1e-10);

        checkFloat(Polynomials.legendreDeriv(5, -1.0),       15.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(5, -0.5), -2.2265625, 1e-10);
        checkFloat(Polynomials.legendreDeriv(5,  0.0),      1.875, 1e-10);
        checkFloat(Polynomials.legendreDeriv(5,  0.5), -2.2265625, 1e-10);
        checkFloat(Polynomials.legendreDeriv(5,  1.0),       15.0, 1e-10);

        checkFloat(Polynomials.legendreDeriv(6, -1.0),       -21.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(6, -0.5),  0.57421875, 1e-10);
        checkFloat(Polynomials.legendreDeriv(6,  0.0),         0.0, 1e-10);
        checkFloat(Polynomials.legendreDeriv(6,  0.5), -0.57421875, 1e-10);
        checkFloat(Polynomials.legendreDeriv(6,  1.0),        21.0, 1e-10); 
    });

    it('legendreAssoc', function() {
        checkFloat(Polynomials.legendreAssoc(1, 0, -1.0), -1.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(1, 0, -0.5), -0.5, 1e-10);
        checkFloat(Polynomials.legendreAssoc(1, 0,  0.0),  0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(1, 0,  0.5),  0.5, 1e-10);
        checkFloat(Polynomials.legendreAssoc(1, 0,  1.0),  1.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(1, 1, -1.0),  0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(1, 1, -0.5), -0.866025403784439, 1e-10);
        checkFloat(Polynomials.legendreAssoc(1, 1,  0.0), -1.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(1, 1,  0.5), -0.866025403784439, 1e-10);
        checkFloat(Polynomials.legendreAssoc(1, 1,  1.0),  0.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(2, 0,  1.0),    1.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 0, -0.5), -0.125, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 0,  0.0),   -0.5, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 0,  0.5), -0.125, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 0,  1.0),    1.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(2, 1, -1.0),    0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 1, -0.5), 1.299038105676658, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 1,  0.0),    0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 1,  0.5), -1.299038105676658, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 1,  1.0),    0.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(2, 2, -1.0),    0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 2, -0.5),   2.25, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 2,  0.0),   3.00, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 2,  0.5),   2.25, 1e-10);
        checkFloat(Polynomials.legendreAssoc(2, 2,  1.0),    0.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(3, 0, -1.0),    -1.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 0, -0.5),  0.4375, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 0,  0.0),     0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 0,  0.5), -0.4375, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 0,  1.0),     1.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(3, 1, -1.0),     0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 1, -0.5), -0.324759526419165, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 1,  0.0),     1.5, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 1,  0.5), -0.324759526419165, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 1,  1.0),     0.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(3, 2, -1.0),    0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 2, -0.5), -5.625, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 2,  0.0),    0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 2,  0.5),  5.625, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 2,  1.0),    0.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(3, 3, -1.0),     0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 3, -0.5), -9.742785792574935, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 3,  0.0),   -15.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 3,  0.5), -9.742785792574935, 1e-10);
        checkFloat(Polynomials.legendreAssoc(3, 3,  1.0),     0.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(4, 0, -1.0),        1.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 0, -0.5), -0.2890625, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 0,  0.0),      0.375, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 0,  0.5), -0.2890625, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 0,  1.0),        1.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(4, 1, -1.0),        0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 1, -0.5), -1.353164693413186, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 1,  0.0),        0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 1,  0.5), 1.353164693413186, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 1,  1.0),        0.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(4, 2, -1.0),     0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 2, -0.5), 4.21875, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 2,  0.0),    -7.5, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 2,  0.5), 4.21875, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 2,  1.0),     0.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(4, 3, -1.0),        0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 3, -0.5), 34.099750274012273, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 3,  0.0),        0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 3,  0.5),-34.099750274012273, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 3,  1.0),        0.0, 1e-10);

        checkFloat(Polynomials.legendreAssoc(4, 4, -1.0),      0.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 4, -0.5),  59.0625, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 4,  0.0),    105.0, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 4,  0.5),  59.0625, 1e-10);
        checkFloat(Polynomials.legendreAssoc(4, 4,  1.0),      0.0, 1e-10);
    });

    it('legendreAssocd', function() {
        const delta = 1e-9;
        for (let degree = 1; degree < 5; degree++) {
            for (let order = 0; order <= degree; order++) {
                for (let value = -0.99; value <= 0.99; value+= 0.1) {
                    const derivExp = (Polynomials.legendreAssoc(degree, order, value + delta/2) 
                                   - Polynomials.legendreAssoc(degree, order, value - delta/2)) / delta;
                    const deriv = Polynomials.legendreAssocd(degree, order, value);
                    checkFloat(deriv, derivExp, 1e-4);
                }
            }
        }
    });
});