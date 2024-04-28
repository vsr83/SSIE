import { checkFloat, checkFloatArray} from './common';
import { Nutation, NutationParams } from '../src/Nutation';
import 'mocha';

describe('Nutation', function() {
    it('nutationTerms', function() {
        const JT = 2460428.5000000;
        const T = (JT - 2451545.0) / 36525.0;
        const nutParams : NutationParams = Nutation.nutationTerms(T);

        checkFloat(nutParams.eps, 23.436128274567935, 1e-12);
        checkFloat(nutParams.deps, 0.002455856984832, 1e-12);
        checkFloat(nutParams.dpsi, -0.001526632555646, 1e-12);
    });
});