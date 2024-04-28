import { checkFloat, checkFloatArray} from './common';
import { Rotations } from '../src/Rotations';
import 'mocha';

describe('Rotations', function() {
    it('rotateCart1', function() {
        checkFloatArray(Rotations.rotateCart1([1, 2, 3], 0.1), 
        [1.000000000000000, 2.289508580496536, 2.785345662540421], 1e-10);
    });
    it('rotateCart2', function() {
        checkFloatArray(Rotations.rotateCart2([1, 2, 3], 0.1), 
        [0.695503915337541, 2.000000000000000, 3.084845912480905], 1e-10);
    });
    it('rotateCart3', function() {
        checkFloatArray(Rotations.rotateCart3([1, 2, 3], 0.1), 
        [1.194670998571682, 1.890174913909223, 3.000000000000000], 1e-10);
    });
    it('rotateCart1d', function() {
        checkFloatArray(Rotations.rotateCart1d([1, 2, 3], 0.1), 
        [1.000000000000000, 2.005232938924270, 2.996504774008066], 1e-10);
    });
    it('rotateCart2d', function() {
        checkFloatArray(Rotations.rotateCart2d([1, 2, 3], 0.1), 
        [0.994762491815593, 2.000000000000000, 3.001740759105761], 1e-10);
    });
    it('rotateCart3d', function() {
        checkFloatArray(Rotations.rotateCart3d([1, 2, 3], 0.1), 
        [1.003489133645084, 1.998251625460677, 3.000000000000000], 1e-10);
    });
});