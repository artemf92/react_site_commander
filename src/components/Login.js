import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField, Button, Alert } from '@mui/material';
import { signInUser } from '../firebase'
import { startSession, isLoggedIn } from '../session'
import { errors } from '../libs/errors';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  // boxShadow: 24,
  p: 4,
};

export default function Login({open, setOpen, setDemo}) {
  // const password = process.env.REACT_APP_PASSWORD

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const loginHandler = async () => {
    try {
      let registerResponse = await signInUser(email, password)
      console.log(registerResponse)
      startSession(registerResponse.user);
      setOpen(true)
    } catch (error) {
      console.error(error.message)
      setError(errors[error.code]);
    }
  }

  useEffect(() => {
    const token = isLoggedIn()

    if (token?.length) {
      setOpen(true)
    }
  }, [])

  return (
    <>
      <Modal open={open}>
        <Box sx={style}>
          <Typography
            variant="h6"
            component="h2"
            marginBottom={3}
            align={'center'}
          >
            Введите пароль
          </Typography>
          <TextField
            label="E-mail"
            type={'E-mail'}
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            type={'Password'}
            label={'Password'}
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button disabled={password.length < 4} onClick={loginHandler}>Login</Button>
          {
            error ? 
              (
              <Alert variant="filled" severity="error">
                {error}
              </Alert>
              ):''
          }
        </Box>
      </Modal>
    </>
  )
}