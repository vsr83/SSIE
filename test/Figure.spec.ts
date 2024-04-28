import { checkFloat, checkFloatArray} from './common';
import { Figure } from '../src/Figure';
import { MathUtils } from '../src/MathUtils';
import { constants, stateInitial } from '../src/Constants';
import 'mocha';

describe('Figure', function() {
    it('accBody', function() {
        const rPoint = [0.943722189960001, 0.382748021970811, 0.027075526655788];
        const a = 1.161781241920150e-05;
        const mu = 1;
        const accExp = [0.475697396181525e-13, 0.318936432638165e-13, 0.038407095415640e-13];
        const acc = Figure.accBody(rPoint, a, mu, constants.Jm, constants.CSnm);
        const T = MathUtils.cross(rPoint, acc);
        const Texp = [0.006064867916584e-13, -0.023365870665248e-13, 0.118915151222176e-13];
        checkFloatArray(acc, accExp, 1.0e-28);
        checkFloatArray(T, Texp, 1.0e-28);        
    });
    it('accOblateness', function() {
        const JT = stateInitial.JTepoch;

        const acc : number[][] = Figure.accOblateness(
            stateInitial.pointMasses[0], 
            stateInitial.pointMasses[3], 
            stateInitial.pointMasses[4],
            stateInitial.libration, stateInitial.JTepoch);
        const accSun   = acc[0];
        const accEarth = acc[1];
        const accMoon  = acc[2];
        const libMoon  = stateInitial.libration;
        const expSun = [0.006693249200862e-20, -0.048757372219467e-20, -0.21549982209912e-20];
        const expEarth = [-0.001397684554884e-12, -0.006003096556495e-12, -0.865835515062385e-12];
        const expMoon = [0.001118207727728e-10, 0.005012531494318e-10, 0.704512523742023e-10];

        console.log(acc);
        checkFloatArray(accSun, expSun, 1e-34);
        checkFloatArray(accEarth, expEarth, 1e-22);
        checkFloatArray(accMoon, expMoon, 1e-20);
        //checkFloat(libMoon.phi2, -0.213971696871218e-5, 1e-15);
        //checkFloat(libMoon.theta2, 0.245634047922518e-5, 1e-15);
        //checkFloat(libMoon.psi2, -0.102242383380786e-5, 1e-15);
    });
});