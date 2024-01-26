import * as React from "react"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert, {AlertProps} from "@mui/material/Alert"
import {useAppDispatch, useAppSelector} from "../../hooks/useAppDispatchSelector"
import {setErrorAC} from "../../app/app-reducer"

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export function CustomizedSnackbars() {
    //const [open, setOpen] = React.useState(false)

    const dispatch = useAppDispatch()
    const error = useAppSelector(state => state.app.error)

    const isOpen =  error != null

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return
        }

        dispatch<any>(setErrorAC({error: null}))
    }

    return (

        <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}
                  anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
            <Alert onClose={handleClose} severity="error" sx={{width: "100%"}}>
                {error}
            </Alert>
        </Snackbar>

    )
}