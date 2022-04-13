import {FC, useState} from "react";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {QuestionMark} from "@mui/icons-material";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{m: 0, p: 2}} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        // color: (theme) => theme.palette.grey[500],
                    }}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export const HelpButton: FC = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="Help"
                onClick={handleClickOpen}>
                <QuestionMark fontSize="large" />
            </IconButton>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="help-menu"
                open={open}>
                <BootstrapDialogTitle id="help-menu" onClose={handleClose}>
                    What is this website?
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        This website can be used to generate a variety of
                        Three-dimensional shapes. The following video describes how this
                        tool can be used.
                    </Typography>
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/Omt5hVE0YDY"
                        title="YouTube video player"
                        frameBorder={0}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
};
