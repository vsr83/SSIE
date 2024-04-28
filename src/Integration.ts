import { LibrationState } from "./Libration";
import { PointMassState } from "./PointMass";
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

    // Integration method.
    private integrationMethod : IntegrationMethod;

    // Integration step size (Julian days).
    private stepSize : number;
    
    constructor() {
    }

    /**
     * Initialize integrator.
     * 
     * @param {IntegrationState} stateIn 
     *      Initial condition for the integrator.
     * @param {IntegrationMethod} integrationMethodIn 
     *      Integration method.
     * @param {number} stepSizeIn 
     *      Integration step size (Julian days).
     */
    initialize(
        stateIn : IntegrationState, 
        integrationMethodIn : IntegrationMethod, 
        stepSizeIn : number) {
            
        this.state = stateIn;
        this.integrationMethod = integrationMethodIn;
        this.stepSize = stepSizeIn;
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

        dof.push(this.state.libration.phi);
        dof.push(this.state.libration.phi1);
        dof.push(this.state.libration.theta);
        dof.push(this.state.libration.theta1);
        dof.push(this.state.libration.psi);
        dof.push(this.state.libration.psi1);
    
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
        const librationState : LibrationState = {
            phi    : dof[0],
            phi1   : dof[1],
            theta  : dof[2],
            theta1 : dof[3],
            psi    : dof[4],
            psi1   : dof[5]
        };

        const oldPointMasses = this.state.pointMasses;
        const numPointMasses = oldPointMasses.length;
        const newPointmasses : PointMassState[] = [];

        for (let indTarget = 0; indTarget < numPointMasses; indTarget++) {
            const indDof = 6 + indTarget * 6;
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
    static runge4(funcIn : any, tIn : number, yIn : number[], h : number, 
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
     * Set integration method.
     * 
     * @param {IntegrationMethod} integrationMethodIn 
     *      Integration method.
     */
    setIntegrationMethod(integrationMethodIn : IntegrationMethod) {
        this.integrationMethod = integrationMethodIn;
    }

    /**
     * Get integration method.
     * 
     * @returns {IntegrationMethod} The integration method.
     */
    getIntegrationMethod() : IntegrationMethod {
        return this.integrationMethod;
    }

    /**
     * Set step size.
     * 
     * @param {number} stepSizeIn 
     *      Step size (Julian days).
     */
    setStepSize(stepSizeIn : number) {
        this.stepSize = stepSizeIn;
    }

    /**
     * Get step size.
     * 
     * @returns {number} Step size (Julian days).
     */
    getStepSize() : number {
        return this.stepSize;
    }
}