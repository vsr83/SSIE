import { LibrationOutput, LibrationState } from "./Libration";
import { PointMass, PointMassState } from "./PointMass";
import { Figure, FigureOutput } from "./Figure";
import { MathUtils } from "./MathUtils";

/**
 * State of integration.
 */
export interface IntegrationState {
    // Julian time at the start of the integration.
    JTepoch : number, 
    // Julian delta time w.r.t. the epoch.
    deltaT  : number, 
    // State of each point mass integrated.
    pointMasses : PointMassState[],
    // State of the lunar libration.
    libration : LibrationState
};

/**
 * Integration configuration.
 */
export interface IntegrationConf {
    // Integration method.
    integrationMethod : IntegrationMethod;
    // Integration step size (Julian days).
    stepSize : number;
    // Include relativity in the integration.
    withRelativity : boolean;
    // Include figure effects in the integration.
    withFigure : boolean;
    // Index of the Sun body for the computation of figure effects. 
    figIndSun   : number;
    // Index of the Earth body for the computation of figure effects. 
    figIndEarth : number;
    // Index of the Moon body for the computation of figure effects. 
    figIndMoon : number;
}

/**
 * Enumeration for the integration method.
 */
export enum IntegrationMethod {
    INTEGRATION_RK4,
    INTEGRATION_ADAMS8
};

/**
 * Class implementing the integration.
 */
export class Integration {
    // Integration state.
    private state : IntegrationState;

    private conf : IntegrationConf;
    
    constructor() {
    }

    /**
     * Initialize integrator.
     * 
     * @param {IntegrationState} stateIn
     *      Integration state.
     * @param {IntegrationConf} conf
     *      Integration configuration.
     */
    initialize(
        stateIn : IntegrationState, 
        confIn : IntegrationConf) {
            
        this.state = stateIn;
        this.conf = confIn;
    }

    /**
     * Convert state to degrees of freedom.
     * 
     * @returns {number[]} Degrees of freedom.
     */
    private stateToDof() : number[] {
        const dof : number[] = [];

        const libration : LibrationState = this.state.libration;
        const pointMasses : PointMassState[] = this.state.pointMasses;

        if (this.conf.withFigure) {
            dof.push(this.state.libration.phi);
            dof.push(this.state.libration.phi1);
            dof.push(this.state.libration.theta);
            dof.push(this.state.libration.theta1);
            dof.push(this.state.libration.psi);
            dof.push(this.state.libration.psi1);
        }
    
        for (let indObject = 0; indObject < pointMasses.length; indObject++) {
            const {r, v, mu} = pointMasses[indObject];
    
            dof.push(r[0]);
            dof.push(r[1]);
            dof.push(r[2]);
            dof.push(v[0]);
            dof.push(v[1]);
            dof.push(v[2]);
        }
    
        return dof;
    }

    /**
     * Convert degrees of freedom to an integration state.
     * 
     * @param {number[]} dof
     *      Degrees of freedom. 
     * @param {number} deltaT
     *      New time after epoch.
     */
    private dofToState(dof : number[], deltaT : number) : IntegrationState {
        let librationState;
        let startIndex;

        if (this.conf.withFigure) {
            startIndex = 6;
            librationState = {
                phi    : dof[0],
                phi1   : dof[1],
                theta  : dof[2],
                theta1 : dof[3],
                psi    : dof[4],
                psi1   : dof[5]
            };
        } else {
            startIndex = 0;
            librationState = {
                phi    : 0.0,
                phi1   : 0.0,
                theta  : 0.0,
                theta1 : 0.0,
                psi    : 0.0,
                psi1   : 0.0
            };
        }

        const oldPointMasses = this.state.pointMasses;
        const numPointMasses = oldPointMasses.length;
        const newPointmasses : PointMassState[] = [];

        for (let indTarget = 0; indTarget < numPointMasses; indTarget++) {
            const indDof = startIndex + indTarget * 6;
            const name = oldPointMasses[indTarget].name;
            const mu   = oldPointMasses[indTarget].mu;
            const r    = [dof[indDof], dof[indDof + 1], dof[indDof + 2]]; 
            const v    = [dof[indDof + 3], dof[indDof + 4], dof[indDof + 5]]; 

            newPointmasses.push({name : name, mu : mu, r : r,  v : v});
        }

        return {
            JTepoch     : this.state.JTepoch,
            deltaT      : deltaT,
            pointMasses : newPointmasses,
            libration   : librationState
        };
    }

    /**
     * This method performs a single integration step for the initial value
     * problem
     *    dy/dt = f(t, y) 
     *    y(t_in) = y_in 
     * with fourth order Runge-Kutta.
     * 
     * @param {any} funcIn 
     *      Function handle for f(t, y).
     * @param {number} tIn 
     *      Time before the step.
     * @param {number[]} yIn 
     *      DoFs before the step.
     * @param {number} h 
     *      Step size.
     * @param {any} param
     *      Parameter passed to the method funcIn. 
     * @returns Object with yOut and tOut fields for the DoFs and 
     * time after the step.
     */
    private runge4(funcIn : any, tIn : number, yIn : number[], h : number, 
        param : any) {
        const k1 = funcIn(tIn, yIn, param);
        const k2 = funcIn(tIn + h/2, MathUtils.linComb([1, h/2], [yIn, k1]), param);
        const k3 = funcIn(tIn + h/2, MathUtils.linComb([1, h/2], [yIn, k2]), param);
        const k4 = funcIn(tIn + h,   MathUtils.linComb([1, h],   [yIn, k3]), param);

        const yOut = MathUtils.linComb([1, h/6, h/3, h/3, h/6], [yIn, k1, k2, k3, k4]);
        const tOut = tIn + h;

        return {yOut : yOut, tOut : tOut};
    }

    /**
     * This method performs a single integration step for the initial value
     * problem
     *    dy/dt = f(t, y) 
     *    y(t_in) = y_in * 
     * with 8th order Adams-Bashforth-Moulton.
     * 
     * @param {any} funcIn 
     *      Function handle for f(t, y)
     * @param {number} tIn 
     *      Time before the step.
     * @param {number[]} yIn 
     *      DoFs before the step.
     * @param {number[][]} Fin 
     *      Last 8 funcIn outputs.
     * @param {number} h 
     *      Step size.
     * @param {any} param 
     *      Parameter passed to the method funcIn.
     * @returns {}
     */
    private adams8(funcIn : any, tIn : number, yIn : number[], Fin : number[][], 
        h : number, param : any) {

        const predCof = [
             h *  434241/120960, 
            -h * 1152169/120960,
             h * 2183877/120960,
            -h * 2664477/120960,
             h * 2102243/120960,
            -h * 1041723/120960,
             h *  295767/120960,
            -h *   36799/120960
        ];
        const corrCof = [
             h *  36799/120960,
             h * 139849/120960,
            -h * 121797/120960,
             h * 123133/120960,
            -h *  88547/120960,
             h *  41499/120960,
            -h *  11351/120960,
             h *   1375/120960
        ];
    
        const numDof = yIn.length;
        // Predictor step.
        let yNew = yIn.slice();
        let yOut = yIn.slice();
    
        for (let indCof = 0; indCof < predCof.length; indCof++) {
            const coeff = predCof[indCof];
    
            for (let indDof = 0; indDof < numDof; indDof++) {
                yNew[indDof] += coeff * Fin[indCof][indDof];
            }
        }
    
        let f1 = funcIn(tIn + h, yNew, param);
        // Corrector step.
        const Ftmp = [f1].concat(Fin).slice(0, 8);
    
        for (let indCof = 0; indCof < corrCof.length; indCof++) {
            const coeff = corrCof[indCof];
    
            for (let indDof = 0; indDof < numDof; indDof++) {
                yOut[indDof] += coeff * Ftmp[indCof][indDof];
            }
        }
    
        f1 = funcIn(tIn + h, yOut, param);
        const Fout = [f1].concat(Fin).slice(0, 8);
    
        const tOut = tIn + h;
    
        return {tOut : tOut, yOut : yOut, Fout : Fout};
    }

    /**
     * Compute the vector f(t, y) = y'.
     * 
     * @param {number} tIn 
     *      Time after epoch.
     * @param {number[]} yNew 
     *      Degrees of freedom.
     * @param {number} JT
     *      Julian time at epoch. 
     */
    private func(tIn : number, yNew : number[], JT : number) : number[] {
        const fOut : number[] = [];

        let state : IntegrationState = this.dofToState(yNew, tIn);

        const accPointMass : number[][] = PointMass.accPointMass(
            state.pointMasses, this.conf.withRelativity);
        
        let startIndex = 0;
        if (this.conf.withFigure) {
            startIndex = 6;

            const osvSun   = state.pointMasses[this.conf.figIndSun];
            const osvEarth = state.pointMasses[this.conf.figIndEarth];
            const osvMoon  = state.pointMasses[this.conf.figIndMoon];

            const figureOutput : FigureOutput = Figure.accOblateness(
                osvSun, osvEarth, osvMoon, state.libration, state.JTepoch + tIn
            );

            // Add figure effects to outputs.
            accPointMass[this.conf.figIndSun] = MathUtils.vecSum(
                accPointMass[this.conf.figIndSun], figureOutput.accSJ2000);
            accPointMass[this.conf.figIndEarth] = MathUtils.vecSum(
                accPointMass[this.conf.figIndEarth], figureOutput.accEJ2000);
            accPointMass[this.conf.figIndMoon] = MathUtils.vecSum(
                accPointMass[this.conf.figIndMoon], figureOutput.accMJ2000);

            // Collect libration time derivatives.
            const librationState : LibrationState = state.libration;
            const librationOutput : LibrationOutput = figureOutput.libration;

            fOut.push(librationState.phi1);
            fOut.push(librationOutput.phi2);
            fOut.push(librationState.theta1);
            fOut.push(librationOutput.theta2);
            fOut.push(librationState.psi1);
            fOut.push(librationOutput.psi2);
        }

        for (let indObject = 0; indObject < state.pointMasses.length; indObject++) {
            const indDof = startIndex + indObject * 6;

            const acc = accPointMass[indObject];
            fOut.push(yNew[indDof + 3]);
            fOut.push(yNew[indDof + 4]);
            fOut.push(yNew[indDof + 5]);
            fOut.push(acc[0]);
            fOut.push(acc[1]);
            fOut.push(acc[2]);
        }

        return fOut;
    }

    /**
     * Set integration state.
     * 
     * @param {IntegrationState} stateIn 
     *      Integration state.
     */
    setIntegrationState(stateIn : IntegrationState) {
        this.state = stateIn;
    }

    /**
     * Get integration state.
     * 
     * @returns {IntegrationState} The integration state.
     */
    getIntegrationState() : IntegrationState {
        return this.state;
    }

    /**
     * Set integration configuration.
     * 
     * @param {IntegrationConf} confIn 
     *      Integration configuration.
     */
    setIntegrationConf(confIn : IntegrationConf) {
        this.conf = confIn;
    }

    /**
     * Get integration configuration.
     */
    getIntegrationConf() : IntegrationConf {
        return this.conf;
    }
}