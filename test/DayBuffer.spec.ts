import { checkFloat, checkFloatArray} from './common';
import { Integration, IntegrationConf, IntegrationMethod, IntegrationState } from '../src/Integration';
import { stateInitial, constants } from '../src';
import { DayBuffer } from '../src';
import { MathUtils } from '../src';
import 'mocha';

describe('DayBuffer', function() {

    it('get', function() {
        const integrationConf : IntegrationConf = {
            integrationMethod : IntegrationMethod.ADAMS8,
            stepSize : 0.1,
            withRelativity : true,
            withFigure : true,
            figIndSun : 0,
            figIndEarth : 3,
            figIndMoon : 4
        };        
        const dayBuffer : DayBuffer = new DayBuffer(integrationConf, 10, 10);
        
        for (let delta = 3650; delta > 0; delta--) {
            const state = dayBuffer.get(2460433 + delta);
            console.log((2460433 + delta) + " " + MathUtils.vecDiff(state.pointMasses[3].r, state.pointMasses[0].r)
            + dayBuffer.bufferBack.length + " " + dayBuffer.bufferFront.length
            );
        }
    });
});