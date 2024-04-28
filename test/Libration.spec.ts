import { checkFloat, checkFloatArray} from './common';
import { Libration, LibrationOutput, LibrationState } from '../src/Libration';
import 'mocha';

describe('Libration', function() {
    it('librationMoon', function() {
       const librationState : LibrationState = {
        phi : 0.1, 
        theta : 0.2,
        psi : 0.3,
        phi1 : 0.4,
        theta1 : 0.5,
        psi1 : 0.6
       };
       const librationOutputExp : LibrationOutput = {
        phi2 : 2.106787477360440e+11,
        theta2 : 6.915268060712579e+09,
        psi2 : -1.495885663077352e+11
       };
       const librationOutput = Libration.librationMoon(librationState,
        [1, 2, 3]);
        checkFloat(librationOutput.phi2, librationOutputExp.phi2, 1.0);
        checkFloat(librationOutput.theta2, librationOutputExp.theta2, 1.0);
        checkFloat(librationOutput.psi2, librationOutputExp.psi2, 1.0);
    });
});