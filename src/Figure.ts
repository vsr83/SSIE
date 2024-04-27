import { Rotations } from "./Rotations";
import { MathUtils } from "./MathUtils";
import { Polynomials } from "./Polynomials";

/**
 * Class implementing static methods for computation of figure effects.
 */
export class Figure {
    /**
     * Compute the acceleration and torque due to zonal and tesseral harmonics 
     * from an extended body.
     * 
     * This method computes the expression in equation (2) of [1] or (8.3) in
     * [2] and transforms the acceleration to body coordinates. 
     * 
     * REFERENCES: 
     *  [1] Newhall, Standish, Williams - DE 102: a numerically integrated
     *  ephemeris of the Moon and planets spanning forty-four centuries,
     *  Astronomy and Astrophysics, 125, 150-167, 1983.
     *  [2] Urban, Seidelmann - Explanatory Supplement to the Astronomical
     *  Almanac, 3rd edition, University Science Books, 2013.
     *  [3] Steve Moshier, DE118i available at 
     *  http://www.moshier.net/de118i-2.zip * 
     * 
     * @param {number[]} rPoint 
     *      The position of the point-mass w.r.t. the body center in body 
     *      coordinates (au).
     * @param {number} a 
     *      The equatorial radius of the extended body (au).
     * @param {number} mu 
     *      Standard gravitational parameter (au^3/d^2) or 1 if the results 
     *      are multiplied with -mu afterwards.
     * @param {number[]} Jn 
     *      Zonal harmonics for the extended body starting from n = 2.
     * @param {number[][]} CSnm 
     *      Tesseral harmonics in the (n, m, C_nm, Snm) row format.
     * @returns {number[]} The acceleration of the point mass in body coordinates 
     *      (au/d^2, 3).
     */
    static accBody(rPoint : number[], a : number, mu : number, Jn : number[], 
        CSnm : number[][]) : number[] {
        // Distance between center of the extended body and the point mass.
        const r = MathUtils.norm(rPoint);

        // Latitude and longitude of the point mass w.r.t. body coordinates (rad).
        const sinLat = rPoint[2] / MathUtils.norm(rPoint);
        const latPoint = Math.asin(sinLat);
        const lonPoint = Math.atan2(rPoint[1], rPoint[0]);
        const cosLat = Math.cos(latPoint);

        // Number of zonal harmonics starting from n=2.
        const numberZonal = Jn.length;
        const numberTesseral = CSnm.length;
        
        let accPointZonal = [0, 0, 0];
        let accPointTesseral = [0, 0, 0];
        let accPoint = [0, 0, 0];

        // Evaluate zonal harmonics.
        for (let indZonal = 0; indZonal < numberZonal; indZonal++) {
            const n = indZonal + 2;

            // Legendre value and derivative terms.
            const Pn    = Polynomials.legendreValue(n, sinLat);
            const PnDot = Polynomials.legendreDeriv(n, sinLat);

            accPointZonal = MathUtils.linComb([1, Jn[indZonal] * Math.pow(a/r, n)], 
                [accPointZonal, [(n + 1) * Pn, 0, -cosLat * PnDot]]);
        }
        accPointZonal = MathUtils.vecMul(accPointZonal, -mu / (r * r));

        // Evaluate tesseral harmonics.
        for (let indTesseral = 0; indTesseral < numberTesseral; indTesseral++) {
            const n    = CSnm[indTesseral][0];
            const m    = CSnm[indTesseral][1];
            const Cnm  = CSnm[indTesseral][2];
            const Snm  = CSnm[indTesseral][3];
        
            const cosMlon = Math.cos(m * lonPoint);
            const sinMlon = Math.sin(m * lonPoint);

            const Pnm    = Math.pow(-1, m) * Polynomials.legendreAssoc(n, m, sinLat);
            const PnmDot = Math.pow(-1, m) * Polynomials.legendreAssocd(n, m, sinLat);

            accPointTesseral = MathUtils.linComb([1, Math.pow(a / r, n)],
                [accPointTesseral,
                [-(n + 1)     * Pnm    * ( Cnm * cosMlon + Snm * sinMlon), 
                (m/cosLat) * Pnm    * (-Cnm * sinMlon + Snm * cosMlon), 
                cosLat     * PnmDot * ( Cnm * cosMlon + Snm * sinMlon)]]);
        }
        accPointTesseral = MathUtils.vecMul(accPointTesseral, -mu / (r * r));
        accPoint = MathUtils.linComb([1, 1], [accPointZonal, accPointTesseral]);

        return Rotations.rotateCart3(
            Rotations.rotateCart2(accPoint, latPoint), -lonPoint);
    }
}