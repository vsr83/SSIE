import { checkFloat, checkFloatArray} from './common';
import { Integration, IntegrationConf, IntegrationMethod, IntegrationState } from '../src/Integration';
import { stateInitial, constants } from '../src';
import { Engine } from '../src';
import { MathUtils } from '../src';
import 'mocha';

describe('Engine', function() {

    it('get', function() {
        const engine : Engine = new Engine();
        

        for (let delta = 0; delta < 36.0; delta += 0.01) {
            //const state = engine.get(2460433 + delta);
            //console.log((2460433 + delta) + " " + MathUtils.vecDiff(state.pointMasses[3].r, state.pointMasses[0].r)
            //);
        }
    });
});