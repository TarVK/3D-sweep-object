import {createTheme} from "@mui/material";
import { deepmerge } from '@mui/utils';

export const theme = createTheme({
    primaryColor: "#145DA0",
    secondaryColor: "#2E8BC0",
    darkBlue: "#0C2D48",
    lightBlue: "#B1D4E0",
});

declare module "@mui/material/styles" {
    interface Theme {
        primaryColor: string;
        secondaryColor: string;
        darkBlue: string;
        lightBlue: string;
    }

    interface ThemeOptions {
        primaryColor: string;
        secondaryColor: string;
        darkBlue: string;
        lightBlue: string;
    }
}
