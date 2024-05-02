import { Integration, IntegrationConf, IntegrationState, IntegrationMethod } from "./Integration";
import { JPLData } from "./JPLData";

/**
 * Configuration for the integration engine.
 */
export interface EngineConf {
    bufferSizeBack : number,
    bufferSizeFront : number 
}

export interface BufferItem {
    JD : number,
    state : IntegrationState
};

/**
 * 
 */
export interface EngineState {
    lastJD        : number,
    bufferBack    : BufferItem[],
    bufferFront   : BufferItem[],
    bufferFirstJD : number,
    bufferLastJD  : number
}

/**
 * The implementation of the integration engine.
 */
export class Engine {
    // Engine configuration.
    private conf : EngineConf;

    // State of the engine.
    private state : EngineState;

    // Integration configuration.
    private integrationConf : IntegrationConf;

    /**
     * Public constructor.
     * 
     * @param {EngineConf} confIn
     *      Engine configuration. 
     */
    constructor(confIn : EngineConf) {
        this.conf = confIn;
        this.state = {
            lastJD : 0,
            bufferBack : [],
            bufferFront : [],
            bufferFirstJD : 0,
            bufferLastJD : 0
        };
        this.integrationConf  = {
            integrationMethod : IntegrationMethod.ADAMS8,
            stepSize : 0.1,
            withRelativity : true,
            withFigure : true,
            figIndSun : 0,
            figIndEarth : 3,
            figIndMoon : 4
        };
    }

    /**
     * 
     * 
     * @param {number} JD 
     */
    compute(JD : number) : IntegrationState {
        if (JD < JPLData.getFirstJD() || JD > JPLData.getLastJD()) {
            throw new Error('Parameter out of range!');
        }

        if (this.state.bufferFront.length == 0 && this.state.bufferBack.length == 0) {
            // First call.
            const closestFullJD = Math.max(Math.round(JD), JPLData.getFirstJD());
            const closestFull : IntegrationState = this.fromIcToFullDay(JD);

            this.updateBuffers(closestFull, closestFullJD);
        }
    }

    public updateBuffers(state : IntegrationState, closestFullJD : number) {
        if (this.state.bufferFront.length == 0 && this.state.bufferBack.length == 0) {

        }
    }
    
    public addBack(state : IntegrationState, numStates : number) {
        const numBack = this.state.bufferBack.length;

        // Integrate from initial condition to the closest full Julian day.
        const integration : Integration = new Integration();
        integration.initialize(state, this.integrationConf);
        integration.getIntegrationConf().stepSize = 
            -Math.abs(integration.getIntegrationConf().stepSize);
        const stepsPerDay = Math.round(Math.abs(1.0 / this.integrationConf.stepSize));

        for (let ind = 0; ind < numStates; ind++) {
            integration.integrateSteps(stepsPerDay);

            const stateOut : IntegrationState = JSON.parse(JSON.stringify(
                integration.getIntegrationState()));
            const bufferItem = {
                JD: stateOut.JTepoch + stateOut.deltaT,
                state: stateOut
            };

            this.state.bufferBack.push(bufferItem);
        }
    }

    public addFront(state : IntegrationState, numStates : number) {

    }

    /**
     * Integration from an initial condition to closest full Julian day.
     * 
     * @param {number} JD
     *      The Julian day. 
     */
    public fromIcToFullDay(JD) : IntegrationState {
        // Index of the closest full Julian day.
        const closestFullJD    = Math.min(Math.max(Math.round(JD), JPLData.getFirstJD()),
            JPLData.getLastJD());
        // Index of the closest initial condition to the full Julian day.
        const closestInitInd   = JPLData.findClosest(closestFullJD);
        const closestInitJD    = JPLData.getTdbTimestamps()[closestInitInd];
        const initialCondition = JPLData.getState(closestInitInd);

        // The integrated time.
        const deltaJD = closestFullJD - closestInitJD;

        // Integrate from initial condition to the closest full Julian day.
        const integration : Integration = new Integration();
        integration.initialize(initialCondition, this.integrationConf);
        integration.getIntegrationConf().stepSize = 
            Math.abs(integration.getIntegrationConf().stepSize) * Math.sign(deltaJD);

        const numSteps = Math.round(Math.abs(deltaJD / this.integrationConf.stepSize));

        // Important: Initial conditions should be constructed so that there never
        // can be substep time differences.
        if (numSteps > 0) {
            integration.integrateSteps(numSteps);
        } else {
            return initialCondition;
        }

        return integration.getIntegrationState();
    }
}