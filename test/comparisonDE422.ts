import { checkFloat, checkFloatArray} from './common';
import { Integration, IntegrationConf, IntegrationMethod, IntegrationState } from '../src/Integration';
import { stateInitial, constants } from '../src';
import { Engine } from '../src';
import { MathUtils } from '../src';
//import DE422 from '../data/DE422_1900-1910.json';
//import DE422 from '../data/DE422_1950-2000.json';
//import DE422 from '../data/DE422_2000-2050.json';
//import DE422 from '../data/DE422_2050-2100.json';
//import 'mocha';
import {readFileSync} from 'fs';

function angleDiff(u : number[], v : number[]) {
    let a = MathUtils.norm(u);
    let b = MathUtils.norm(v);

    let d;
    if (a < b) {
        d = a;
        a = b;
        b = d;
    }
    
    const c = MathUtils.norm(MathUtils.vecDiff(u, v));
    let mu = 0;
    if (b >= c  && c >= 0)
        mu = c - (a - b);
    else if (c > b && b >= 0)
        mu = b - (a - c);
    
    return 3600000 * (180 / Math.PI) * 2 * Math.atan(Math.sqrt((((a - b) + c) * mu) / ((a + (b + c)) * ((a - c) + b))));    
}

function testJson(filename : string) {
    const obj = JSON.parse(readFileSync(filename, 'utf8'));
    //console.log(obj.JD_list);
    let engine : Engine = new Engine();

    for (let ind = 0; ind < obj.JD_list.length; ind++) {
        const JD = obj.JD_list[ind];

        //if (ind % 1000 == 0) engine = new Engine();
        const state = engine.get(JD);
        const pointMasses = state.pointMasses;
        const pointMassesExp = obj.objects_list[ind].point_masses;
        const libration = state.libration;
        const librationExp = obj.objects_list[ind].libration;

        let s = "";
        for (let indObj = 1; indObj < pointMasses.length; indObj++) {
            const rDiff = MathUtils.vecDiff(pointMasses[indObj].r, pointMasses[0].r);
            const rDiffExp = MathUtils.vecDiff(pointMassesExp[indObj].r, pointMassesExp[0].r);
            const errKm = MathUtils.norm(MathUtils.vecDiff(rDiff, rDiffExp)) * constants.au;
            s = s + errKm + " ";
        }
        const rDiff = MathUtils.vecDiff(pointMasses[4].r, pointMasses[3].r);
        const rDiffExp = MathUtils.vecDiff(pointMassesExp[4].r, pointMassesExp[3].r);
        const errKm = MathUtils.norm(MathUtils.vecDiff(rDiff, rDiffExp)) * constants.au;
        s = s + errKm + " ";

        for (let indObj = 1; indObj < pointMasses.length; indObj++) {
            const rDiff = MathUtils.vecDiff(pointMasses[indObj].r, pointMasses[3].r);
            const rDiffExp = MathUtils.vecDiff(pointMassesExp[indObj].r, pointMassesExp[3].r);
            const angDiff = angleDiff(rDiff, rDiffExp);
            s = s + angDiff + " ";
        }
       // const angDiff = angleDiff(rDiff, rDiffExp);
       // s = s + angDiff + " ";
        
        console.log(JD + " " + s);

    }
}

describe('DE422', function() {

    it('1900-2100', function() {
        
        testJson('data/DE422_1900-1910.json');
        testJson('data/DE422_1910-1920.json');
        testJson('data/DE422_1920-1930.json');
        testJson('data/DE422_1930-1940.json');
        testJson('data/DE422_1940-1950.json');
        testJson('data/DE422_1950-1960.json');
        testJson('data/DE422_1960-1970.json');
        testJson('data/DE422_1970-1980.json');
        testJson('data/DE422_1980-1990.json');
        testJson('data/DE422_1990-2000.json');
        testJson('data/DE422_2000-2010.json');
        testJson('data/DE422_2010-2020.json');
        testJson('data/DE422_2020-2030.json');
        testJson('data/DE422_2030-2040.json');
        testJson('data/DE422_2040-2050.json');
        testJson('data/DE422_2050-2060.json');
        testJson('data/DE422_2060-2070.json');
        testJson('data/DE422_2070-2080.json');
        testJson('data/DE422_2080-2090.json');
        testJson('data/DE422_2090-2100.json');

        /*for (let delta = 0; delta < 36.0; delta += 0.01) {
            const state = engine.get(2460433 + delta);
            console.log((2460433 + delta) + " " + MathUtils.vecDiff(state.pointMasses[3].r, state.pointMasses[0].r)
            );
        }*/
    });
});