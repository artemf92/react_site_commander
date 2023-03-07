/* eslint-disable no-unused-vars */
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import {
  createTheme,
  CssBaseline,
  Paper,
  ThemeProvider
} from '@mui/material'
import { useState } from 'react';
import './App.css'
import Login from './components/Login';
import Panel from './components/Panel';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  marginBottom: '1rem'
}))

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  const theme = useTheme()

  const [isAuth, setIsAuth] = useState(false)
  const [isDemo, setIsDemo] = useState(true)

  console.log(isDemo)
  
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {isAuth ? <Panel isDemo={isDemo}/> : <Login open={!isAuth} setDemo={setIsDemo} setOpen={setIsAuth} />}
     </ThemeProvider>
  )
}

export default App
