import { checkFloat, checkFloatArray} from './common';
import { Frames } from '../src/Frames';
import 'mocha';
import { NutationParams, Nutation } from '../src/Nutation';

describe('Frames', function() {
    it('coordJ2000Mod', function() {
        checkFloatArray(Frames.coordJ2000Mod([1, 2, 3], 2460428.5000000),
        [0.982014441559190, 2.005390252727589, 3.002342014300564], 1e-10);
    });
    it('coordModJ2000', function() {
        checkFloatArray(Frames.coordModJ2000([1, 2, 3], 2460428.5000000),
        [1.017950389191480, 1.994512016465855, 2.997615522597624], 1e-10);
    });
    it('coordModTod', function() {
        const T = (2460428.5000000 - 2451545.0) / 36525.0;
        const nutParams : NutationParams = Nutation.nutationTerms(T);
        checkFloatArray(Frames.coordModTod([1, 2, 3], 2460428.5000000, nutParams),
        [1.000080684989695, 1.999846962581255, 3.000075124020242], 1e-10);
    });
    it('coordTodMod', function() {
        const T = (2460428.5000000 - 2451545.0) / 36525.0;
        const nutParams : NutationParams = Nutation.nutationTerms(T);
        checkFloatArray(Frames.coordTodMod([1, 2, 3], 2460428.5000000, nutParams),
        [0.999919312065339, 2.000153032226063, 2.999924868565155], 1e-10);
    });
    it('coordJ2000Body', function() {
        checkFloatArray(Frames.coordJ2000Body([1, 2, 3], 0.1, 0.2, 0.3),
        [1.864895575453514, 1.986096990452391, 2.564679948291767], 1e-10);
    });
    it('coordBodyJ2000', function() {
        checkFloatArray(Frames.coordBodyJ2000([1, 2, 3], 0.1, 0.2, 0.3),
        [0.206116195793267, 1.594752616957776, 3.378502657174927], 1e-10);
    });
});