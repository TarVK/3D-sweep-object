import {Box, Modal} from "@mui/material";
import {ChangeEvent, FC, useCallback, useState} from "react";
import {JSONToSweepObject} from "../../state/JSON/JSONToSweepObject";
import {IErrorData} from "../../state/JSON/verifier/_types/IVerifier";
import {IJSON} from "../../state/JSON/_types/IJSON";
import {SweepObjectState} from "../../state/SweepObjectState";

/** An invisible input element that fills its parent's container and handles the user selecting a json sweep object file */
export const ImportButton: FC<{onInput: (object: SweepObjectState) => void}> = ({
    onInput,
}) => {
    const [parseError, setParseError] = useState<any>(null);
    const [jsonErrors, setJsonErrors] = useState<IErrorData[] | null>(null);
    const closeModal = useCallback(() => {
        setJsonErrors(null);
        setParseError(null);
    }, []);

    const onFileSelect = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        event.target.value = ""; // Resets the file to allow it to be selected multiple times

        const text = await file.text();
        let json: IJSON;
        try {
            json = JSON.parse(text);
        } catch (e) {
            setParseError(e);
            setJsonErrors(null);
            return;
        }

        const parsed = JSONToSweepObject(json);
        if ("errors" in parsed) {
            setJsonErrors(parsed.errors);
            setParseError(null);
            return;
        }

        setJsonErrors(null);
        setParseError(null);
        onInput(parsed.result);
    }, []);
    return (
        <>
            <input
                type="file"
                css={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                    opacity: 0,
                }}
                onChange={onFileSelect}
            />

            {/* TODO: proper styling */}
            <Modal
                open={parseError || jsonErrors ? true : false}
                onClose={closeModal}
                aria-labelledby="import-error">
                <Box
                    sx={{
                        position: "absolute" as "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}>
                    {parseError && "The selected file does not contain valid JSON data"}
                    {jsonErrors && (
                        <>
                            The given JSON file does not contain a valid sweep line
                            specification:
                            <ul>
                                {jsonErrors.map((error, i) => (
                                    <ErrorLine error={error} key={i} />
                                ))}
                            </ul>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};

// TODO: add nice styling
const ErrorLine: FC<{error: IErrorData}> = ({error}) => (
    <li
        css={{
            color: "red",
        }}>
        {error.path ? error.path + ": " : ""}
        {error.message}
        {error.subErrors && (
            <details>
                {error.subErrors.map((errors, i) => (
                    <div css={{marginLeft: 10, marginTop: 10}} key={i}>
                        {i != 0 && <>or</>}
                        <ul>
                            {errors.map((childError, j) => (
                                <ErrorLine error={childError} key={j} />
                            ))}
                        </ul>
                    </div>
                ))}
            </details>
        )}
    </li>
);
