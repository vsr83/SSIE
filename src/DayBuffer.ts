import { Integration, IntegrationConf, IntegrationState, IntegrationMethod } from "./Integration";
import { JPLData } from "./JPLData";

export interface BufferItem {
    JD : number,
    state : IntegrationState
};

//   Back buffer          Front buffer
// 7 6 5 4 3 2 1 0 + 0 1 2 3 4 5 6 7 8 9
//                 |
//             currentItem


/**
 * Class implementing of the day buffer.
 */
export class DayBuffer {
    public bufferBack   : BufferItem[];
    public bufferFront  : BufferItem[];
    public currentItem? : BufferItem;
    private JDinit : number;

    private bufferBackSize : number;
    private bufferFrontSize : number;

    private integrationConf : IntegrationConf;

    /**
     * Public constructor.
     * 
     * @param {IntegrationConf} confIn 
     * @param {number} bufferBackSizeIn 
     * @param {number} bufferFrontSizeIn 
     */
    constructor(confIn : IntegrationConf, bufferBackSizeIn : number, 
        bufferFrontSizeIn : number) {
        this.integrationConf = confIn;
        this.bufferBackSize = bufferBackSizeIn;
        this.bufferFrontSize = bufferFrontSizeIn;
        this.bufferBack = [];
        this.bufferFront = [];
    }

    /**
     * Get 
     * 
     * @param {number} fullJD 
     *      
     * @returns {IntegrationState} 
     */
    public get(fullJD : number) : IntegrationState {
        if (fullJD != Math.round(fullJD)) {
            throw new Error(fullJD + " not an integer!");
        }

        if ((this.bufferFront.length == 0 && this.bufferBack.length == 0) ||
            Math.abs(fullJD - this.JDinit) > 350.0) {
            // First request or the requested time is almost a year away from the 
            // initial condition.

            //console.log("Initialize initial condition " + fullJD);

            this.currentItem = {
                state : this.fromInitialCondition(fullJD),
                JD    : fullJD
            }
            this.JDinit = this.currentItem.JD;
            this.bufferBack = [];
            this.bufferFront = [];

            //console.log("Creating buffers ");
            this.addBack(this.bufferBackSize);
            this.addFront(this.bufferFrontSize);

            return this.currentItem.state;
        }

        if (this.currentItem === undefined) throw Error("Unreachable");

        const numDays = fullJD - this.currentItem.JD;

        if (numDays > 0) {
            if (numDays <= this.bufferFrontSize) {
                this.currentItem.JD = this.bufferFront[numDays - 1].JD;
                this.currentItem.state = this.bufferFront[numDays - 1].state;

                this.frontToBack(numDays);
                this.addFront(numDays);

                return this.currentItem.state;
            }
        } else if (numDays < 0) {
            if (-numDays <= this.bufferBackSize) {
                this.currentItem.JD = this.bufferBack[-1 - numDays].JD;
                this.currentItem.state = this.bufferBack[-1 - numDays].state;

                this.backToFront(-numDays);
                this.addBack(-numDays);

                return this.currentItem.state;
            }
        }
        return this.currentItem.state;
    }

    public addBack(numStates : number) {
        const numBack = this.bufferBack.length;

        if (this.currentItem === undefined) return;

        let state : IntegrationState = this.currentItem.state;
        if (this.bufferBack.length != 0) {
            state = this.bufferBack.slice(-1)[0].state;
        }

        // Integrate from initial condition to the closest full Julian day.
        const integration : Integration = new Integration();
        integration.initialize(state, this.integrationConf);
        integration.getIntegrationConf().stepSize = 
            -Math.abs(integration.getIntegrationConf().stepSize);
        const stepsPerDay = Math.round(Math.abs(1.0 / this.integrationConf.stepSize));

        //console.log("Integrating " + numStates*stepsPerDay + " steps");
        for (let ind = 0; ind < numStates; ind++) {
            integration.integrateSteps(stepsPerDay);

            const stateOut : IntegrationState = JSON.parse(JSON.stringify(
                integration.getIntegrationState()));
            const bufferItem = {
                JD: stateOut.JTepoch + stateOut.deltaT,
                state: stateOut
            };

            this.bufferBack.push(bufferItem);
            if (this.bufferBack.length > this.bufferBackSize) {
                this.bufferBack.shift();
            }
        }
    }

    /**
     * Expand buffer forward.
     * 
     * @param {number} numStates 
     */
    public addFront(numStates : number) {
        const numFront = this.bufferFront.length;

        if (this.currentItem === undefined) return;

        let state : IntegrationState = this.currentItem.state;
        if (this.bufferFront.length != 0) {
            state = this.bufferFront.slice(-1)[0].state;
        }

        // Integrate from initial condition to the closest full Julian day.
        const integration : Integration = new Integration();
        integration.initialize(state, this.integrationConf);
        integration.getIntegrationConf().stepSize = 
            Math.abs(integration.getIntegrationConf().stepSize);
        const stepsPerDay = Math.round(Math.abs(1.0 / this.integrationConf.stepSize));

        //console.log("Integrating " + numStates*stepsPerDay + " steps");
        for (let ind = 0; ind < numStates; ind++) {
            integration.integrateSteps(stepsPerDay);

            const stateOut : IntegrationState = JSON.parse(JSON.stringify(
                integration.getIntegrationState()));
            const bufferItem = {
                JD: stateOut.JTepoch + stateOut.deltaT,
                state: stateOut
            };

            this.bufferFront.push(bufferItem);
            if (this.bufferFront.length > this.bufferFrontSize) {
                this.bufferFront.shift();
            }
        }
    }

    /**
     * Move items from the start of the front buffer to the start of the back buffer.
     * 
     * @param {number} numItems
     *      The number of items.
     */
    public frontToBack(numItems : number) {
        for (let ind = 0; ind < numItems; ind++) {
            this.bufferBack = this.bufferFront.slice(0,1).concat(this.bufferBack);
            if (this.bufferBack.length > this.bufferBackSize) {
                this.bufferBack.pop();
            }
        }
    }

    /**
     * Move items from the start of the back buffer to the start of the front buffer.
     * 
     * @param {number} numItems
     *      The number of items 
     */
    public backToFront(numItems : number) {
        for (let ind = 0; ind < numItems; ind++) {
            this.bufferFront = this.bufferBack.slice(0,1).concat(this.bufferFront);
            if (this.bufferFront.length > this.bufferFrontSize) {
                this.bufferFront.pop();
            }
        }
    }    

    /**
     * Integration from an initial condition to closest full Julian day.
     * 
     * @param {number} JD
     *      The Julian day. 
     */
    public fromInitialCondition(JD : number) : IntegrationState {
        // Index of the closest full Julian day.
        const closestFullJD    = Math.min(Math.max(Math.round(JD), JPLData.getFirstJD()),
            JPLData.getLastJD());
        // Index of the closest initial condition to the full Julian day.
        const closestInitInd   = JPLData.findClosest(closestFullJD);
        const closestInitJD    = JPLData.getTdbTimestamps()[closestInitInd];
        const initialCondition = JPLData.getState(closestInitInd);

        //console.log("Closest initial condition " + closestInitJD);

        // The integrated time.
        const deltaJD = closestFullJD - closestInitJD;

        // Integrate from initial condition to the closest full Julian day.
        const integration : Integration = new Integration();
        integration.initialize(initialCondition, this.integrationConf);
        integration.getIntegrationConf().stepSize = 
            Math.abs(integration.getIntegrationConf().stepSize) * Math.sign(deltaJD);

        const numSteps = Math.round(Math.abs(deltaJD / this.integrationConf.stepSize));

        //console.log("Integrating " + numSteps + " steps");

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