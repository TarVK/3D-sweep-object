import {AddBox, IndeterminateCheckBox} from "@mui/icons-material";
import {Button} from "@mui/material";
import {FC} from "react";

interface ICrossSectionsMenu {
    crossSections: Array<string>;
}

export const CrossSectionsMenu: FC<ICrossSectionsMenu> = ({...props}) => {
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
                    overflow: "scroll",
                    minHeight: "90px"
                }}>
                {props.crossSections.map((crossSection, index) => (
                    <div key={index}>
                        <h4
                            css={{
                                margin: "5px",
                            }}>
                            {crossSection}
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
                    css={{
                        maxWidth: "30px",
                        minWidth: "30px",
                        color: "#145DA0",
                        margin: "0px 5px 0px"
                    }}>
                    <AddBox />
                </Button>
                <Button
                    css={{
                        maxWidth: "30px",
                        minWidth: "30px",
                        color: "#145DA0",
                        margin: "0px 5px 0px"
                    }}>
                    <IndeterminateCheckBox />
                </Button>
            </div>
        </div>
    );
};
