import { checkFloat, checkFloatArray} from './common';
import { Integration, IntegrationConf, IntegrationMethod, IntegrationState } from '../src/Integration';
import { stateInitial, constants } from '../src';
import { DayIntegrator } from '../src';
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
        const dayBuffer : DayIntegrator = new DayIntegrator(integrationConf);
        

        for (let delta = 3650; delta > 0; delta--) {
            //const state = dayBuffer.get(2460433 + delta);
            //console.log((2460433 + delta) + " " + MathUtils.vecDiff(state.pointMasses[3].r, state.pointMasses[0].r)
            //);
        }
    });

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
        const dayBuffer : DayIntegrator = new DayIntegrator(integrationConf);
        
        const first : IntegrationState[] = [];
        for (let delta = 0; delta < 30; delta++) {
            const state: IntegrationState= dayBuffer.get(2460433 + delta);
            first.push(state);
        }
        for (let delta = 0; delta < 30; delta++) {
            const state: IntegrationState= dayBuffer.get(2460433 + delta);
            const stateExp = first[delta];

            for (let indObj = 0; indObj < state.pointMasses.length; indObj++) {
                checkFloatArray(state.pointMasses[indObj].r, 
                    stateExp.pointMasses[indObj].r, 1e-30);
                checkFloatArray(state.pointMasses[indObj].v, 
                    stateExp.pointMasses[indObj].v, 1e-30);
            }
        }
    });

});