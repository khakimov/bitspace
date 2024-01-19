import { Output } from '@bitspace/circuit';
import { atan } from '@thi.ng/shader-ast';
import { map } from 'rxjs';

import { PrimSchema } from '../../../schemas/Prim/Prim';
import { InputPrimNode } from '../../internal/InputPrimNode/InputPrimNode';

export class Arctangent extends InputPrimNode {
    name = 'Arctangent';

    outputs = {
        output: new Output({
            name: 'Output',
            type: PrimSchema,
            observable: this.inputs.input.pipe(map(value => atan(value)))
        })
    };
}