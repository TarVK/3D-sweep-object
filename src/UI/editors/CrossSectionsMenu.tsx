import {AddBox, IndeterminateCheckBox} from "@mui/icons-material";
import {Button} from "@mui/material";
import {useDataHook} from "model-react";
import {FC, useCallback} from "react";
import {CrossSectionState} from "../../state/CrossSectionState";
import {useCrossSectionEditorState} from "./crossSections/CrossSectionEditorStateContext";

export const CrossSectionsMenu: FC = () => {
    const [h] = useDataHook();
    const editorState = useCrossSectionEditorState();
    const sweepObject = editorState.getSweepObject(h);
    const crossSections = sweepObject.getCrossSections(h);
    const selectedCrossSection = editorState.getSelectedCrossSection(h);

    const updateCrossSectionPositions = useCallback(
        (crossSections: CrossSectionState[]) => {
            const step = 1 / (crossSections.length - 1);
            let pos = 0;
            for (let crossSection of crossSections) {
                crossSection.setPosition(pos);
                pos += step;
            }
        },
        []
    );

    const onDelete = useCallback(() => {
        // TODO: add confirmation prompt
        const crossSections = sweepObject.getCrossSections();
        if (crossSections.length <= 1) return;
        const remainingCrossSections = crossSections.filter(
            crossSection => crossSection != selectedCrossSection
        );
        sweepObject.setCrossSections(remainingCrossSections);
        updateCrossSectionPositions(remainingCrossSections);
    }, [sweepObject, selectedCrossSection]);

    const onAdd = useCallback(() => {
        const copy = selectedCrossSection.copy();
        const index = editorState.getSelectCrossSectionIndex();
        const crossSections = sweepObject.getCrossSections();
        const newCrossSections = [
            ...crossSections.slice(0, index + 1),
            copy,
            ...crossSections.slice(index + 1),
        ];
        editorState.selectCrossSection(index + 1);
        sweepObject.setCrossSections(newCrossSections);
        updateCrossSectionPositions(newCrossSections);
    }, [editorState, sweepObject, selectedCrossSection]);

    return (
        <div
            css={{
                position: "absolute",
                bottom: 0,
                left: 0,
                backgroundColor: "rgba(177,212,224,0.7)",
                margin: "10px",
                borderRadius: "4px",
                minWidth: "100px",
                padding: "5px",
                color: "#145DA0",
            }}>
            <div
                className="cross-sections"
                css={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    overflowY: "auto",
                    minHeight: "90px",
                }}>
                {crossSections.map((crossSection, index) => (
                    <div
                        key={index}
                        css={{cursor: "pointer"}}
                        onClick={() => editorState.selectCrossSection(index)}>
                        <h4
                            css={{
                                margin: "5px",
                                // TODO: add proper styling/differentiation
                                fontWeight:
                                    crossSection == selectedCrossSection ? 800 : 100,
                            }}>
                            cross section {index + 1}
                        </h4>
                    </div>
                ))}
            </div>
            <div
                className="cross-sections-buttons"
                css={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                }}>
                <Button
                    onClick={onAdd}
                    css={{
                        maxWidth: "30px",
                        minWidth: "30px",
                        color: "#145DA0",
                        margin: "0px 5px 0px",
                    }}>
                    <AddBox />
                </Button>
                <Button
                    onClick={onDelete}
                    css={{
                        maxWidth: "30px",
                        minWidth: "30px",
                        color: "#145DA0",
                        margin: "0px 5px 0px",
                    }}>
                    <IndeterminateCheckBox />
                </Button>
            </div>
        </div>
    );
};
