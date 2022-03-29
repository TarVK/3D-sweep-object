import {createTheme} from "@mui/material";

export const theme = createTheme({
    palette: {
        primaryColor: "#145DA0",
        secondaryColor: "#2E8BC0",
        darkBlue: "#0C2D48",
        lightBlue: "#B1D4E0",
    },
    typography: {
        h1: {
            fontSize: "2.5em",
            margin: "10px"
        },
        h2: {
            fontSize: "1.875em"
        },
        h3: {
            fontSize: "1.25em"
        },
        h4: {
            fontSize: "0.875em",
            fontWeight: "normal"
        }
    }
});

declare module "@mui/material/styles" {
    interface Theme {
        palette: {
            primaryColor: string;
            secondaryColor: string;
            darkBlue: string;
            lightBlue: string;
        };
        typography: {
            h1: {
                fontSize: string,
                margin: string
            },
            h2: {
                fontSize: string
            },
            h3: {
                fontSize: string
            },
            h4: {
                fontSize: string,
                fontWeight: string
            }
        }
    }

    interface PaletteOptions {
        primaryColor: string;
        secondaryColor: string;
        darkBlue: string;
        lightBlue: string;
    }

    interface TypographyOptions{
        h1: {
            fontSize: string,
            margin: string
        },
        h2: {
            fontSize: string
        },
        h3: {
            fontSize: string
        },
        h4: {
            fontSize: string,
            fontWeight: string
        }
    }
}
