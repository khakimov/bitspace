import { Node, Output } from '@bitspace/circuit';

import { NodeType } from '../../types';
import { Vector2Schema } from '@bitspace/schemas';
import {
    Observable,
    animationFrameScheduler,
    from,
    fromEvent,
    interval,
    map,
    switchMap
} from 'rxjs';

export class Gamepad extends Node {
    static displayName = 'Gamepad';
    static type = NodeType.GAMEPAD;

    gamepad$ = fromEvent(window, 'gamepadconnected').pipe(
        switchMap(this.initializeGamepad.bind(this))
    );

    inputs = {};

    outputs = {
        leftAnalog: new Output({
            name: 'Left Analog',
            type: Vector2Schema(-1, 1),
            observable: this.gamepad$.pipe(map(this.extractAxis('left')))
        }),
        rightAnalog: new Output({
            name: 'Right Analog',
            type: Vector2Schema(-1, 1),
            observable: this.gamepad$.pipe(map(this.extractAxis('right')))
        })
    };

    /** Extracts axis from gamepad */
    public extractAxis(analog: 'left' | 'right') {
        return (gamepad: globalThis.Gamepad) => {
            const [x, y] = gamepad.axes.slice.call(
                null,
                ...(analog === 'left' ? [0, 2] : [2, 4])
            );
            return { x: x ?? 0, y: y ?? 0 };
        };
    }

    /** Initializes gamepad resources */
    public initializeGamepad(): Observable<globalThis.Gamepad> {
        return interval(0, animationFrameScheduler).pipe(
            switchMap(() =>
                from(
                    navigator
                        .getGamepads()
                        .filter((gamepad): gamepad is globalThis.Gamepad =>
                            Boolean(gamepad?.connected)
                        )
                )
            )
        );
    }
}