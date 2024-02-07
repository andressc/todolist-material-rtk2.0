import React, { FC, useCallback, useEffect } from 'react'
import '../App.css'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Menu } from '@mui/icons-material'
import { TodoListsList } from '../features/TodoListsList/ui/todoListsList/TodoListsList'
import LinearProgress from '@mui/material/LinearProgress'
import { CustomizedSnackbars } from '../common/components/ErrorSnackBar/ErrorSnackBar'
import { useAppDispatch } from '../common/hooks/useAppDispatchSelector'
import { Route, Routes } from 'react-router-dom'
import { Login } from '../features/auth/ui/Login'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { appSelectors, appActions } from './appSlice'
import { authSelectors, authActions } from '../features/auth/model/authSlice'
import { useSelector } from 'react-redux'

type Props = {
    demo?: boolean
}

const App: FC<Props> = ({ demo = false }) => {
    const status = useSelector(appSelectors.selectStatus)
    const isInitialized = useSelector(appSelectors.selectIsInitialized)
    const isAuth = useSelector(authSelectors.selectIsAuth)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(appActions.initializeApp())
    }, [dispatch])

    const logoutHandler = useCallback(() => {
        dispatch(authActions.logout())
    }, [dispatch])

    if (!isInitialized) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress size={150} />
            </Box>
        )
    }

    return (
        <div className="App">
            <CustomizedSnackbars />
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                    {isAuth && (
                        <Button color="inherit" onClick={logoutHandler}>
                            Log out
                        </Button>
                    )}
                </Toolbar>
                {status === 'loading' && <LinearProgress />}
            </AppBar>

            <Container fixed>
                <Routes>
                    <Route path="/" element={<TodoListsList demo={demo} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<h1>404: PAGE NOT FOUND</h1>} />
                </Routes>
            </Container>
        </div>
    )
}

export default App
