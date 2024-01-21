'use client';

import { useEffect, useMemo, useState } from 'react';
import { Image } from '../../nodes/Image/Image';
import { Node } from '@bitspace/circuit';
import { AnalogousHarmony } from '../../nodes/AnalogousHarmony/AnalogousHarmony';
import { TriadHarmony } from '../../nodes/TriadHarmony/TriadHarmony';
import { ColorWheel } from '../../components/ColorPicker/ColorPicker';
import { harmonies, hsv2rgb } from '../../components/ColorPicker/ColorPicker.utils';
import { HSV } from '../../nodes/HSV/HSV';
import { Circuit, CircuitStore, StoreContext } from '../../circuit';
import { NodeWindowResolver } from '../../circuit/containers/Circuit/Circuit.types';
import { MenuButton } from '../../components/Menu/MenuButton/MenuButton';
import { Menu } from '../../components/Menu/Menu/Menu';
import { NodeWindow } from '../../circuit/components/Node/Node';

const ImageWindow = ({ node }: { node: Image }) => {
    const [imageSrc, setImageSrc] = useState<string>();

    useEffect(() => {
        node.outputs.output.subscribe(value => {
            setImageSrc(value);
        });
    }, [node]);

    return (
        <NodeWindow>
            <input
                className="text-black"
                onBlur={e => node.inputs.prompt.next(e.target.value)}
                defaultValue={node.inputs.prompt.value}
            />
            <div
                className="w-[244px] h-80 bg-cover bg-center bg-slate-100"
                style={{
                    backgroundImage: `url(${imageSrc})`
                }}
            />
        </NodeWindow>
    );
};

const HSVWindow = ({ node }: { node: HSV }) => {
    const [rgb, setRgb] = useState<[number, number, number]>([0, 0, 0]);

    useEffect(() => {
        node.inputs.color.subscribe(hsv => {
            const rgb = hsv2rgb(hsv.hue, hsv.saturation, hsv.value);
            setRgb(rgb);
        });
    }, [node]);

    const [r, g, b] = rgb;

    return (
        <NodeWindow>
            <div className="w-full h-[226px]" style={{ backgroundColor: `rgba(${r}, ${g}, ${b})` }} />
        </NodeWindow>
    );
};

const nodeWindowManager: NodeWindowResolver = (node: Node) => {
    if ('displayName' in node.constructor === false) return <></>;

    switch (node.constructor.displayName) {
        case 'Image':
            return <ImageWindow node={node as Image} />;
        case 'Prompt':
            return (
                <NodeWindow>
                    <textarea
                        className="text-black"
                        onBlur={e => node.inputs.prompt?.next(e.target.value)}
                        defaultValue={node.inputs.prompt?.value}
                    />
                </NodeWindow>
            );
        case 'Triad Harmony':
        case 'Analogous Harmony':
        case 'Square Harmony':
        case 'Tetradic Harmony':
        case 'Complementary Harmony':
            return (
                <NodeWindow className="overflow-hidden rounded-full">
                    <ColorWheel
                        defaultColor={(node as TriadHarmony).inputs.color.value}
                        radius={113}
                        harmony={node.constructor.displayName.split(' ')[0]?.toLowerCase() as keyof typeof harmonies}
                        onChange={hsv =>
                            hsv && '0' in hsv ? (node as TriadHarmony).inputs.color.next(hsv[0]) : void 0
                        }
                    />
                </NodeWindow>
            );
        case 'HSV':
            return <HSVWindow node={node as HSV} />;
    }
};

export default function Page(): JSX.Element {
    const [menuOpen, setMenuOpen] = useState(false);

    const store = useMemo(() => {
        const circuitStore = new CircuitStore();
        const analogousHarmonyNode = new AnalogousHarmony();
        const hsvNode = new HSV();
        const hsv2Node = new HSV();
        const hsv3Node = new HSV();

        analogousHarmonyNode.outputs.a.connect(hsvNode.inputs.color);
        analogousHarmonyNode.outputs.b.connect(hsv2Node.inputs.color);
        analogousHarmonyNode.outputs.c.connect(hsv3Node.inputs.color);

        circuitStore.setNodes([
            [analogousHarmonyNode, { x: -500, y: 0 }],
            [hsvNode, { x: 0, y: 500 }],
            [hsv2Node, { x: 0, y: 0 }],
            [hsv3Node, { x: 0, y: -500 }]
        ]);

        return circuitStore;
    }, []);

    return (
        <main className="flex flex-col justify-between h-screen w-screen cursor-[url('/cursor.svg')_4_4,auto]">
            <StoreContext.Provider value={{ store }}>
                <Circuit store={store} nodeWindowResolver={nodeWindowManager} />
                {menuOpen && <Menu onClose={() => setMenuOpen(false)} />}
            </StoreContext.Provider>
            <div className="fixed left-1/2 bottom-20 -translate-x-1/2 flex flex-row justify-center">
                <MenuButton onClick={() => setMenuOpen(true)} />
            </div>
        </main>
    );
}
