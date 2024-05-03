import { checkFloat, checkFloatArray} from './common';
import { Integration, IntegrationConf, IntegrationMethod, IntegrationState } from '../src/Integration';
import { stateInitial, constants } from '../src';
import { JPLData } from '../src';
import { MathUtils } from '../src';
import 'mocha';

describe('Integration', function() {

    it('DE422', function() {
        const JDlist = JPLData.getTdbTimestamps();
        //console.log(DE422.JD_list);
        //console.log(DE422.objects_list);

        return;
        /*
        for (let indJD = 0; indJD < JDlist.length - 1; indJD++) {
            const JD = JDlist[indJD];
            const JDnext = JDlist[indJD + 1];
            const state = JPLData.getState(indJD);
            const stateNext = JPLData.getState(indJD + 1);

            const initialCondition : IntegrationState = {
                JTepoch     : JD,
                deltaT      : 0.0,
                pointMasses : state.pointMasses,
                libration   : state.libration
            };
            const integrationConf : IntegrationConf = {
                integrationMethod : IntegrationMethod.ADAMS8,
                stepSize : 0.1,
                withRelativity : true,
                withFigure : true,
                figIndSun : 0,
                figIndEarth : 3,
                figIndMoon : 4
            };
            const integration : Integration = new Integration();
            integration.initialize(initialCondition, integrationConf);
            integration.integrateSteps((JDnext - JD) / integrationConf.stepSize);

            const pointMasses = integration.getIntegrationState().pointMasses;
            const pointMassesExp = stateNext.pointMasses;

            const libration = integration.getIntegrationState().libration;
            const librationExp = stateNext.libration;

            let s = "";
            for (let indObj = 1; indObj < pointMasses.length; indObj++) {
                const rDiff = MathUtils.vecDiff(pointMasses[indObj].r, pointMasses[0].r);
                const rDiffExp = MathUtils.vecDiff(pointMassesExp[indObj].r, pointMassesExp[0].r);
                //console.log(pointMasses[indObj].name + " " + rDiff);
                //console.log(pointMasses[indObj].name + " " + rDiffExp);
                const errKm = MathUtils.norm(MathUtils.vecDiff(rDiff, rDiffExp)) * constants.au;
                //console.log(pointMasses[indObj].name + " " + errKm);
                s = s + errKm + " ";
            }
            const rDiff = MathUtils.vecDiff(pointMasses[4].r, pointMasses[3].r);
            const rDiffExp = MathUtils.vecDiff(pointMassesExp[4].r, pointMassesExp[3].r);
            const errKm = MathUtils.norm(MathUtils.vecDiff(rDiff, rDiffExp)) * constants.au;
            s = s + errKm;
            
            console.log(JDnext + " " + s);
            //console.log(Math.abs(libration.phi - librationExp.phi) * 180 / Math.PI);
            //console.log(Math.abs(libration.theta - librationExp.theta) * 180 / Math.PI);
            //console.log(Math.abs(libration.psi - librationExp.psi) * 180 / Math.PI);

            //console.log(JDnext + " " + (integration.getIntegrationState().JTepoch + integration.getIntegrationState().deltaT));
        }
        */



        for (let indJD = 1; indJD < JDlist.length; indJD++) {
            const JD = JDlist[indJD];
            const JDprev = JDlist[indJD - 1];
            const state = JPLData.getState(indJD);
            const statePrev = JPLData.getState(indJD - 1);

            const initialCondition : IntegrationState = {
                JTepoch     : JD,
                deltaT      : 0.0,
                pointMasses : state.pointMasses,
                libration   : state.libration
            };
            const integrationConf : IntegrationConf = {
                integrationMethod : IntegrationMethod.ADAMS8,
                stepSize : -0.1,
                withRelativity : true,
                withFigure : true,
                figIndSun : 0,
                figIndEarth : 3,
                figIndMoon : 4
            };
            const integration : Integration = new Integration();
            integration.initialize(initialCondition, integrationConf);
            integration.integrateSteps(Math.abs((JD - JDprev) / integrationConf.stepSize)-100);
            integration.integrateSteps(100);

            const pointMasses = integration.getIntegrationState().pointMasses;
            const pointMassesExp = statePrev.pointMasses;

            const libration = integration.getIntegrationState().libration;
            const librationExp = statePrev.libration;

            let s = "";
            for (let indObj = 1; indObj < pointMasses.length; indObj++) {
                const rDiff = MathUtils.vecDiff(pointMasses[indObj].r, pointMasses[0].r);
                const rDiffExp = MathUtils.vecDiff(pointMassesExp[indObj].r, pointMassesExp[0].r);
                //console.log(pointMasses[indObj].name + " " + rDiff);
                //console.log(pointMasses[indObj].name + " " + rDiffExp);
                const errKm = MathUtils.norm(MathUtils.vecDiff(rDiff, rDiffExp)) * constants.au;
                //console.log(pointMasses[indObj].name + " " + errKm);
                s = s + errKm + " ";
            }
            const rDiff = MathUtils.vecDiff(pointMasses[4].r, pointMasses[3].r);
            const rDiffExp = MathUtils.vecDiff(pointMassesExp[4].r, pointMassesExp[3].r);
            const errKm = MathUtils.norm(MathUtils.vecDiff(rDiff, rDiffExp)) * constants.au;
            s = s + errKm;
            
            console.log(JDprev + " " + s);
            //console.log(Math.abs(libration.phi - librationExp.phi) * 180 / Math.PI);
            //console.log(Math.abs(libration.theta - librationExp.theta) * 180 / Math.PI);
            //console.log(Math.abs(libration.psi - librationExp.psi) * 180 / Math.PI);

            //console.log(JDnext + " " + (integration.getIntegrationState().JTepoch + integration.getIntegrationState().deltaT));
        }

    });

    it('integrateSteps', function() {
        return;
        const initialCondition : IntegrationState = {
            JTepoch     : stateInitial.JTepoch,
            deltaT      : stateInitial.deltaT,
            pointMasses : stateInitial.pointMasses,
            libration   : stateInitial.libration
        };
        const integrationConf : IntegrationConf = {
            integrationMethod : IntegrationMethod.ADAMS8,
            stepSize : 0.05,
            withRelativity : true,
            withFigure : true,
            figIndSun : 0,
            figIndEarth : 3,
            figIndMoon : 4
        };
        //const pointMassesExp = [{"name": "Sun", "mu": 0.00029591220828559115, "r": [-0.0013660453468012851, 0.0010865673943211622, 0.0004792749319696909], "v": [-2.4853093037358994e-06, -4.995120060221501e-06, -2.104782505175246e-06]}, {"name": "Mercury", "mu": 4.912549571868067e-11, "r": [0.06335882082296557, 0.26896158034434714, 0.13689858833675111], "v": [-0.033147174502257834, 0.004957597104840404, 0.006080243830651466]}, {"name": "Venus", "mu": 7.243452332702627e-10, "r": [-0.6957665622841896, 0.15154995039992986, 0.11211317283676761], "v": [-0.00524310390548951, -0.018049444209773852, -0.007792810627180372]}, {"name": "Earth", "mu": 8.887692462955904e-10, "r": [0.10419010360011025, -0.926590534617393, -0.4015456213212952], "v": [0.01682694953222254, 0.0015800529513423781, 0.0006839195059536493]}, {"name": "Moon", "mu": 1.0931894529945686e-11, "r": [0.10168945945635591, -0.9274964919010852, -0.40202510034694133], "v": [0.01703297316469165, 0.001086830532434069, 0.0005215342470476683]}, {"name": "Mars", "mu": 9.549548695623833e-11, "r": [1.2550048091944137, -0.5069558661087474, -0.2663156915944417], "v": [0.006327211337927305, 0.012725845425061298, 0.0056674377902409135]}, {"name": "Jupiter", "mu": 2.825345842083777e-07, "r": [4.687209591473178, -1.5229409446020374, -0.7666688429553273], "v": [0.002481977017042732, 0.006871945186273348, 0.0028848216111875776]}, {"name": "Saturn", "mu": 8.459706072729002e-08, "r": [-9.487592451769927, -1.0484169343700125, -0.023772458105699838], "v": [0.00026667562356762415, -0.005135806726785982, -0.0021334316926239893]}, {"name": "Uranus", "mu": 1.29202482578787e-08, "r": [-4.483154945925235, -17.005006982194786, -7.384183419669914], "v": [0.0037946964504816175, -0.0009961743736006325, -0.0004899111318007574]}, {"name": "Neptune", "mu": 1.5243591092119296e-08, "r": [-3.8921786501650066, 27.415026634014342, 11.318016270219053], "v": [-0.0031305201509707996, -0.00038736595361174385, -8.060945112065121e-05]}, {"name": "Pluto", "mu": 2.1784410519905144e-12, "r": [43.60169461889951, 5.815605657231516, -11.322013870748895], "v": [0.0003477347614875474, 0.002250643639335166, 0.0005976090480980081]}];
        //const pointMassesExp = [{"name": "Sun", "mu": 0.00029591220828559115, "r": [-0.004767027336395555, -0.005905094121099242, -0.0023180205716301708], "v": [6.34560321045002e-06, -5.941527324814558e-06, -2.715280035007287e-06]}, {"name": "Mercury", "mu": 4.912549571868067e-11, "r": [-0.14326935837769514, -0.404428092062384, -0.20089185486246994], "v": [0.02121590839138936, -0.005401993512882828, -0.00508176126126005]}, {"name": "Venus", "mu": 7.243452332702627e-10, "r": [0.212966515499709, 0.6257536862049313, 0.26821313498251176], "v": [-0.019341511777768078, 0.005034638929752194, 0.0034895344106704064]}, {"name": "Earth", "mu": 8.887692462955904e-10, "r": [0.10184650803907068, -0.9334674467842966, -0.4043126057731718], "v": [0.016830827664738136, 0.001584842326535651, 0.0006866407466475053]}, {"name": "Moon", "mu": 1.0931894529945686e-11, "r": [0.10350394424041545, -0.9350235372156647, -0.40522121841196196], "v": [0.01728229478193005, 0.0019793736774278824, 0.0008452199596974871]}, {"name": "Mars", "mu": 9.549548695623833e-11, "r": [-1.3497971576791405, -0.7954495235362813, -0.3282983680617319], "v": [0.008028298936427756, -0.009579652611962993, -0.0046098551278064975]}, {"name": "Jupiter", "mu": 2.825345842083777e-07, "r": [3.6888333139746794, 3.089541998907566, 1.2344872273132097], "v": [-0.0051503463143396195, 0.0054286482104814356, 0.002451916989994629]}, {"name": "Saturn", "mu": 8.459706072729002e-08, "r": [5.396767236141711, 6.882264369034908, 2.610748780219699], "v": [-0.0047899526233170404, 0.0029684292406044, 0.001432904240529912]}, {"name": "Uranus", "mu": 1.29202482578787e-08, "r": [-15.741425119389543, -8.950046091942047, -3.6973002883021735], "v": [0.0020317249310327586, -0.003227505046943609, -0.0014422482050070473]}, {"name": "Neptune", "mu": 1.5243591092119296e-08, "r": [7.546191572370674, 26.7910578958626, 10.777842469892626], "v": [-0.0030551763169518174, 0.0007260820493330186, 0.0003732524432713144]}, {"name": "Pluto", "mu": 2.1784410519905144e-12, "r": [41.386714502407564, -2.4708518463760623, -13.240677610571437], "v": [0.0008717589111818658, 0.002270197142521113, 0.0004458219672707201]}];
        //const pointMassesExp = [{"name": "Sun", "mu": 0.00029591220828559115, "r": [0.0070843692366411165, -0.0017724068956660817, -0.0009880699999625616], "v": [5.229021105005184e-06, 6.09660944234274e-06, 2.4503774799281347e-06]}, {"name": "Mercury", "mu": 4.912549571868067e-11, "r": [-0.3614784492746978, -0.21492155272677624, -0.07659017688737361], "v": [0.008913679906631175, -0.019804391562520732, -0.011503281552750584]}, {"name": "Venus", "mu": 7.243452332702627e-10, "r": [0.38841384352289104, 0.5659218203591155, 0.23023035562454763], "v": [-0.017231680145650487, 0.009275484340230233, 0.005263175221816525]}, {"name": "Earth", "mu": 8.887692462955904e-10, "r": [0.12212981052465045, -0.9285024896388312, -0.4028239886593258], "v": [0.016823237230507784, 0.0017383262263935603, 0.0007530377675105638]}, {"name": "Moon", "mu": 1.0931894529945686e-11, "r": [0.12001977920896365, -0.9269203019903866, -0.4022248805862127], "v": [0.016467818582522085, 0.001324131420823944, 0.0006243359361038893]}, {"name": "Mars", "mu": 9.549548695623833e-11, "r": [1.13880808684425, 0.8308642988683436, 0.35026011127826345], "v": [-0.008187781040805513, 0.010952335503208602, 0.0052449211379798815]}, {"name": "Jupiter", "mu": 2.825345842083777e-07, "r": [-3.869770758142957, 3.320829174959611, 1.5178252657221767], "v": [-0.005263539340163124, -0.004772521036191784, -0.0019175978440343668]}, {"name": "Saturn", "mu": 8.459706072729002e-08, "r": [-9.031012362579634, 2.097691779706077, 1.2544307765101965], "v": [-0.0017465307587381101, -0.005019896362309033, -0.0019977630018571902]}, {"name": "Uranus", "mu": 1.29202482578787e-08, "r": [-12.038764758840593, -13.159011459982588, -5.592753053717785], "v": [0.0029793338512578427, -0.0024735681038112254, -0.0011255755062715724]}, {"name": "Neptune", "mu": 1.5243591092119296e-08, "r": [-5.503264679151609, -27.60702124006323, -11.162807760881076], "v": [0.003066780984363337, -0.00048400916632617623, -0.0002744348962370567]}, {"name": "Pluto", "mu": 2.1784410519905144e-12, "r": [-27.36731277144107, -12.043817466562203, 4.48691463537583], "v": [0.0013915086972930606, -0.002899424203164765, -0.0013239849307597413]}];
        //const pointMassesExp = [{"name": "Sun", "mu": 0.00029591220828559115, "r": [0.0038597849502077855, 0.0025236377818932303, 0.0010338503790798712], "v": [-3.226401180332201e-06, 4.212180795075427e-06, 1.877485677489817e-06]}, {"name": "Mercury", "mu": 4.912549571868067e-11, "r": [0.20270936132319167, 0.2239774898974976, 0.09867441283752482], "v": [-0.02732132128843861, 0.015848103724408143, 0.011299905316426197]}, {"name": "Venus", "mu": 7.243452332702627e-10, "r": [-0.6977801546694989, -0.16061841083510606, -0.02792317776209981], "v": [0.0043938027760057115, -0.01795771710863056, -0.008355560025604976]}, {"name": "Earth", "mu": 8.887692462955904e-10, "r": [0.11976565576335217, -0.9241033814187957, -0.4007823377577958], "v": [0.01681228691081417, 0.0017400733460268217, 0.0007543071028554408]}, {"name": "Moon", "mu": 1.0931894529945686e-11, "r": [0.12190219203577932, -0.9229130798440875, -0.4000572336132191], "v": [0.01651083926563004, 0.0021966762281506918, 0.0009850114134831586]}, {"name": "Mars", "mu": 9.549548695623833e-11, "r": [-0.6630297113836259, 1.341218643001148, 0.6331122128695081], "v": [-0.012227264694805137, -0.004262812361445482, -0.0016238603025553557]}, {"name": "Jupiter", "mu": 2.825345842083777e-07, "r": [-4.35404711126506, -3.0162526535061795, -1.1868191210845043], "v": [0.0044153126576709665, -0.005203129339119243, -0.0023380873191623077]}, {"name": "Saturn", "mu": 8.459706072729002e-08, "r": [6.531805535854363, 6.051994731758679, 2.2182788514141736], "v": [-0.004217094620988763, 0.0035970321374959617, 0.0016665638635937324]}, {"name": "Uranus", "mu": 1.29202482578787e-08, "r": [-18.125901750658652, -2.530993566596056, -0.8516878268203755], "v": [0.0005420880072284444, -0.003729960705632005, -0.001641317721026154]}, {"name": "Neptune", "mu": 1.5243591092119296e-08, "r": [-15.078616498521397, -24.47234458736462, -9.641453676122419], "v": [0.0027032077969243507, -0.0014043097772441472, -0.0006420698239749472]}, {"name": "Pluto", "mu": 2.1784410519905144e-12, "r": [-30.346755574737262, -2.0198332071860716, 8.512417245355742], "v": [0.00042579281711710416, -0.0031386509760113076, -0.0011076315263556444]}];
        const pointMassesExp = [{"name": "Sun", "mu": 0.00029591220828559115, "r": [0.0038597847469502285, 0.0025236375091977677, 0.0010338502579781762], "v": [-3.2264011018122464e-06, 4.21218080120619e-06, 1.8774856501727675e-06]}, {"name": "Mercury", "mu": 4.912549571868067e-11, "r": [0.20270936033821949, 0.22397748737715747, 0.09867441685613369], "v": [-0.027321321467051553, 0.015848104078590476, 0.011299904600537052]}, {"name": "Venus", "mu": 7.243452332702627e-10, "r": [-0.6977801547797471, -0.1606184118439608, -0.027923175704338603], "v": [0.0043938027704311135, -0.0179577171123041, -0.008355560021717754]}, {"name": "Earth", "mu": 8.887692462955904e-10, "r": [0.11976565562013261, -0.9241033818676014, -0.4007823374720579], "v": [0.016812286910796358, 0.0017400733666749837, 0.000754307056562764]}, {"name": "Moon", "mu": 1.0931894529945686e-11, "r": [0.12190219189218376, -0.9229130802859191, -0.40005723333700527], "v": [0.016510839265231347, 0.0021966762478858987, 0.000985011368381019]}, {"name": "Mars", "mu": 9.549548695623833e-11, "r": [-0.6630297110301828, 1.3412186427596329, 0.6331122135188405], "v": [-0.012227264694836584, -0.004262812373491237, -0.001623860263809674]}, {"name": "Jupiter", "mu": 2.825345842083777e-07, "r": [-4.3540470985038136, -3.0162526222909434, -1.1868192336783463], "v": [0.004415312685887592, -0.0052031293364957305, -0.002338087286847511]}, {"name": "Saturn", "mu": 8.459706072729002e-08, "r": [6.531805540646652, 6.051994713012816, 2.218278885038392], "v": [-0.004217094617365123, 0.0035970321343936997, 0.0016665638786639908]}, {"name": "Uranus", "mu": 1.29202482578787e-08, "r": [-18.125901044711735, -2.5309924525488876, -0.8516871779501558], "v": [0.000542087608679025, -0.0037299609135362853, -0.0016413177070643298]}, {"name": "Neptune", "mu": 1.5243591092119296e-08, "r": [-15.078613611818913, -24.472341170336282, -9.641450128011387], "v": [0.002703207471488755, -0.0014043105353604027, -0.0006420702445006935]}, {"name": "Pluto", "mu": 2.1784410519905144e-12, "r": [-30.346759278629655, -2.019836203282525, 8.512406827663721], "v": [0.00042579309800976143, -0.0031386502991776646, -0.0011076307250617867]}];
        const integration : Integration = new Integration();
        integration.initialize(initialCondition, integrationConf);
        integration.integrateSteps(365.25 * 1 / 0.05);
        console.log(integration.getIntegrationState().pointMasses);

        const pointMasses = integration.getIntegrationState().pointMasses;
        for (let indObj = 1; indObj < pointMasses.length; indObj++) {
            const rDiff = MathUtils.vecDiff(pointMasses[indObj].r, pointMasses[0].r);
            const rDiffExp = MathUtils.vecDiff(pointMassesExp[indObj].r, pointMassesExp[0].r);
            //console.log(pointMasses[indObj].name + " " + rDiff);
            //console.log(pointMasses[indObj].name + " " + rDiffExp);
            const errKm = MathUtils.norm(MathUtils.vecDiff(rDiff, rDiffExp)) * constants.au;
            console.log(pointMasses[indObj].name + " " + errKm);
        }
    });
});