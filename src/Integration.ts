import { LibrationState } from "./Libration";
import { PointMassState } from "./PointMass";

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
    private state : IntegrationState | null;

    // Integration method.
    private integrationMethod : IntegrationMethod;

    // Integration step size in Julian days.
    private stepSize : number;
    
    constructor() {
    }

    initialize(
        stateIn : IntegrationState, 
        integrationMethodIn : IntegrationMethod, 
        stepSizeIn : number) {
            
        this.state = stateIn;
        this.integrationMethod = integrationMethodIn;
        this.stepSize = stepSizeIn;
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
}