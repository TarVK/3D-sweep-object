import {AddBox, IndeterminateCheckBox} from "@mui/icons-material";
import {Button} from "@mui/material";
import { useTheme } from "@mui/system";
import {useDataHook} from "model-react";
import {FC, useCallback} from "react";
import {CrossSectionState} from "../../state/CrossSectionState";
import {CustomSvg} from "../CustomSvg";
import {useCrossSectionEditorState} from "./crossSections/CrossSectionEditorStateContext";

export const CrossSectionsMenu: FC = () => {
    const theme = useTheme();
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
                maxWidth: "100px",
                maxHeight: "140px",
                padding: "5px",
                color: theme.palette["primaryColor"],
            }}>
            <div
                className="cross-sections"
                css={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    maxHeight: "110px",
                    minHeight: "110px",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    borderBottom: `2px dashed ${theme.palette.primaryColor}`,
                }}>
                {crossSections.map((crossSection, index) => (
                    <CustomSvg
                        key={index}
                        backgroundColor={
                            selectedCrossSection === crossSection ? theme.palette.primaryColor : theme.palette.lightBlue
                        }
                        strokeColor={
                            selectedCrossSection === crossSection ? "#FFF" : theme.palette.primaryColor
                        }
                        index={index}
                        crossSection={crossSection}
                        onClick={() => editorState.selectCrossSection(index)}
                    />
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
                        color: theme.palette.primaryColor,
                        margin: "0px 5px 0px",
                    }}>
                    <AddBox />
                </Button>
                <Button
                    onClick={onDelete}
                    css={{
                        maxWidth: "30px",
                        minWidth: "30px",
                        color: theme.palette.primaryColor,
                        margin: "0px 5px 0px",
                    }}>
                    <IndeterminateCheckBox />
                </Button>
            </div>
        </div>
    );
};
