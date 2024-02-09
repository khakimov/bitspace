import { Output } from '@bitspace/circuit';
import { tan } from '@thi.ng/shader-ast';
import { map } from 'rxjs';

import { PrimSchema } from '../../../schemas/Prim/Prim';
import { InputPrimNode } from '../../internal/InputPrimNode/InputPrimNode';

export class Tangent extends InputPrimNode {
    static displayName = 'Tangent';

    outputs = {
        output: new Output({
            name: 'Output',
            type: PrimSchema,
            observable: this.inputs.input.pipe(map(tan))
        })
    };
}
