import React, {FC} from "react"
import "../App.css"
import AppBar from "@mui/material/AppBar"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import {Menu} from "@mui/icons-material"
import {TodoListsList} from "../features/TodoListsList/TodoListsList"
import LinearProgress from '@mui/material/LinearProgress';
import {CustomizedSnackbars} from "../components/ErrorSnackBar/ErrorSnackBar"
import {useAppSelector} from "../hooks/useAppDispatchSelector"

type PropsType = {
    demo?: boolean
}

const App: FC<PropsType> = ({demo = false}) => {

    const status = useAppSelector(state => state.app.status)

    return (
        <div className="App">
            <CustomizedSnackbars/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === 'loading' && <LinearProgress />}
            </AppBar>

            <Container fixed>
                <TodoListsList demo={demo}/>
            </Container>
        </div>
    )
}

export default App
