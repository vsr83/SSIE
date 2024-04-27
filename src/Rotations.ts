import { MathUtils } from "./MathUtils";

/**
 * Class implementing clockwise rotations of vectors.
 */
export class Rotations 
{
    /**
     * Create rotation matrix w.r.t. the first coordinate.
     * 
     * @param {number[]} p 
     *      Vector.
     * @param {number} angle
     *      Angle in degrees. 
     * @returns {number[]} The rotated vector.
     */
    static rotateCart1d(p : number[], angle : number) : number[]
    {
        const cosd = MathUtils.cosd(angle);
        const sind = MathUtils.sind(angle);
        return [p[0], 
                cosd * p[1] + sind * p[2],
                -sind * p[1] + cosd * p[2]];
    }
    
    /**
     * Create rotation matrix w.r.t. the second coordinate.
     * 
     * @param {number[]} p 
     *      Vector.
     * @param {number} angle
     *      Angle in degrees. 
     * @returns {number[]} The rotated vector.
     */
    static rotateCart2d(p : number[], angle : number) : number[]
    {
        const cosd = MathUtils.cosd(angle);
        const sind = MathUtils.sind(angle);
        return [cosd * p[0] - sind * p[2], 
                p[1],
                sind * p[0] + cosd * p[2]];
    }
    
    /**
     * Create rotation matrix w.r.t. the third coordinate.
     * 
     * @param {number[]} p 
     *      Vector.
     * @param {number} angle
     *      Angle in degrees. 
     * @returns {number[]} The rotated vector.
     */
    static rotateCart3d(p : number[], angle : number) : number[]
    {
        const cosd = MathUtils.cosd(angle);
        const sind = MathUtils.sind(angle);
        return [ cosd * p[0] + sind * p[1], 
                -sind * p[0] + cosd * p[1],
                p[2]];
    }
    
    /**
     * Create rotation matrix w.r.t. the first coordinate.
     * 
     * @param {number[]} p 
     *      Vector.
     * @param {number} angle
     *      Angle in radians. 
     * @returns {number[]} The rotated vector.
     */
    static rotateCart1(p : number[], angle : number) : number[]
    {
        return [p[0], 
                Math.cos(angle) * p[1] + Math.sin(angle) * p[2],
                -Math.sin(angle) * p[1] + Math.cos(angle) * p[2]];
    }
    
    /**
     * Create rotation matrix w.r.t. the second coordinate.
     * 
     * @param {number[]} p 
     *      Vector.
     * @param {number} angle
     *      Angle in radians. 
     * @returns {number[]} The rotated vector.
     */
    static rotateCart2(p : number[], angle : number) : number[]
    {
        return [Math.cos(angle) * p[0] - Math.sin(angle) * p[2], 
                p[1],
                Math.sin(angle) * p[0] + Math.cos(angle) * p[2]];
    }
    
    /**
     * Create rotation matrix w.r.t. the third coordinate.
     * 
     * @param {number[]} p 
     *      Vector.
     * @param {number} angle
     *      Angle in radians. 
     * @returns {number[]} The rotated vector.
     */
    static rotateCart3(p: number[], angle : number) : number[]
    {
        return [Math.cos(angle) * p[0] + Math.sin(angle) * p[1], 
                -Math.sin(angle) * p[0] + Math.cos(angle) * p[1],
                p[2]];
    }
}