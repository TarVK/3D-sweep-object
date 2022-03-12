import {useDataHook} from "model-react";
import {FC, useCallback, useRef, useState} from "react";
import {Vec2} from "../../../util/Vec2";
import {useCrossSectionEditorState} from "../CrossSectionEditorStateContext";
import {CrossSectionPolygon} from "./CrossSectionPolygon";
import {ICrossSectionProps} from "./_types/ICrossSectionProps";

export const CrossSection: FC<ICrossSectionProps> = ({crossSection}) => {
    const [h] = useDataHook();
    const [size, setSize] = useState<Vec2>(new Vec2(0, 0));
    const state = useCrossSectionEditorState();
    const containerRef = useRef<SVGElement>();

    const setContainer = useCallback((container: SVGElement | null) => {
        if (container) {
            const rect = container.getBoundingClientRect();
            setSize(new Vec2(rect.width, rect.height));
            containerRef.current = container;
        }
    }, []);

    const {scale, offset} = state.getTransformation(h);
    return (
        <svg
            style={{position: "absolute"}}
            width="100%"
            height="100%"
            ref={setContainer}
            viewBox={`${-offset.x / scale - size.x / scale / 2} ${
                offset.y / scale - size.y / scale / 2
            } ${size.x / scale} ${size.y / scale}`}>
            <CrossSectionPolygon crossSection={crossSection} />
        </svg>
    );
};
