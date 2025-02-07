import { Output } from '@bitspace/circuit';
import { inversesqrt } from '@thi.ng/shader-ast';
import { map } from 'rxjs';

import { PrimSchema } from '../../../schemas/Prim/Prim';
import { InputPrimNode } from '../../internal/InputPrimNode/InputPrimNode';

export class InverseSquareRoot extends InputPrimNode {
    static displayName = 'InverseSquareRoot';

    outputs = {
        output: new Output({
            name: 'Output',
            type: PrimSchema(),
            observable: this.inputs.input.pipe(map(inversesqrt))
        })
    };
}
