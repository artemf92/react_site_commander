import React, { useEffect, useState } from 'react'
import Command from './Command'
import { Grid, Button, TextField, StepContent, StepLabel, Step, FormGroup, FormControlLabel, Checkbox, Select, InputLabel, FormControl, MenuItem, Stepper, Typography, Radio, RadioGroup } from '@mui/material';
import { Box } from '@mui/system';
// import { sites as sitesData } from '../libs/sites';
import { demo_sites } from '../libs/demo_sites'

import logo from '../images/logo.png'
import { database } from '../firebase'
import { getDocs, collection } from 'firebase/firestore';

function Panel({isDemo}) {
  console.log(isDemo)
  const [sites, setSites] = useState(JSON.parse(process.env.REACT_APP_SITES))
  const templates = isDemo ? demo_sites : sites

  const [selectedTemplate, setSelectedTemplate] = useState({})
  const [siteName, setSiteName] = useState('')
  const [dbShort, setDbShort] = useState(true)
  const [dbName, setDbName] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  // const [isNewDisk, setIsNewDisk] = useState(false)
  const [isNewTemplate, setIsNewTemplate] = useState(false)
  const [diskLocation, setDiskLocation] = useState('SSD')
  const [ftpLogin, setFtpLogin] = useState('')
  const [ftpAddress, setFtpAddress] = useState('')
  const [ftpDir, setFtpDir] = useState('')

  const getSites = async () => {
    await getDocs(collection(database, 'sitesData')).then(
      (querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }))
        setSites(newData)
      }
    )
  }

  const selectTemplateHandler = function (name) {
    const template = [...templates].find((t) => t.name === name)
    setSelectedTemplate(template)
  }
  const siteNameHandler = function (name) {
    setSiteName(name)
    // dbNameHandler(name)
    setDbName(siteName)
  }
  const dbShortHandler = function () {
    setDbShort((prev) => !prev)
    // dbNameHandler(siteName)
    setDbName(siteName)
  }

  // fetchDb()

  useEffect(() => {
    if (dbShort) {
      setDbName(siteName.replace(/(.ru)|(.online)/, ''))
    } else {
      setDbName(siteName)
    }
  }, [dbShort, siteName])

  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const resetFormHandler = function() {
    setActiveStep(0)
    setSelectedTemplate('')
    setIsNewTemplate(false)
    setSiteName('')
    setDbShort(true)
    setDbName('')
    setDbPassword('')
    setEmail('')
    setPhone('')
    // setIsNewDisk(false)
  }


  // useEffect(() => {
  //   if (
  //     selectedTemplate.name === 'brand.vanblack.online' ||
  //     selectedTemplate.name === 'wow.oh-yes.ru' ||
  //     selectedTemplate.name === 'oy.oh-yes.ru' ||
  //     selectedTemplate.name === 'shoes.steptime.online'
  //   ) setIsNewDisk(true)
  // }, [selectedTemplate])

  useEffect(() => {
    if (!sites?.length) getSites()
  }, [])

  return (
    <Box className="px-4 py-6">
      <Typography align="center" marginBottom={2} variant="h4">
        <img
          src={logo}
          alt=""
          width={30}
          className="inline-block align-middle mr-2 mb-1"
        />
        Site commander
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item sm={3}>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel optional={activeStep > 0 ? selectedTemplate.name : ''}>
                Выберите шаблон
              </StepLabel>
              <StepContent>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Шаблон</InputLabel>
                  <Select
                    value={selectedTemplate.name}
                    label="Шаблон"
                    onChange={(e) => selectTemplateHandler(e.target.value)}
                  >
                    {templates?.map((t) => (
                      <MenuItem key={t.name} value={t.name}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      disabled={!selectedTemplate.name}
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Дальше
                    </Button>
                    <Button disabled onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Назад
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel optional={activeStep > 1 ? diskLocation : ''}>
                Расположение
              </StepLabel>
              <StepContent>
                <FormControl>
                  <RadioGroup
                    value={diskLocation}
                    onChange={(e) => setDiskLocation(e.target.value)}
                  >
                    <FormControlLabel
                      value="SSD"
                      control={<Radio />}
                      label="SSD"
                    />
                    <FormControlLabel
                      value="Disk"
                      control={<Radio />}
                      label="Disk"
                    />
                    <FormControlLabel
                      value="FTP"
                      control={<Radio />}
                      label="FTP"
                    />
                  </RadioGroup>
                  {diskLocation === 'FTP' ? (
                    <>
                      <hr />
                      <br />
                      <Grid container alignItems={'center'}>
                        <TextField
                          label={'Логин ftp'}
                          style={{ marginBottom: 10, maxWidth: 100 }}
                          value={ftpLogin}
                          onChange={(e) => setFtpLogin(e.target.value)}
                        />
                        <Typography variant="body1">@</Typography>
                        <TextField
                          label={'Адрес'}
                          style={{
                            marginBottom: 10,
                            maxWidth: 'calc(100% - 100px - 15px)'
                          }}
                          value={ftpAddress}
                          onChange={(e) => setFtpAddress(e.target.value)}
                        />
                      </Grid>
                      <TextField
                        label={'Директория'}
                        value={ftpDir}
                        onChange={(e) => setFtpDir(e.target.value)}
                      />
                    </>
                  ) : (
                    ''
                  )}
                </FormControl>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                      // disabled={
                      //   diskLocation === 'FTP' &&
                      //   !!ftpAddress &&
                      //   !!ftpDir &&
                      //   !!ftpLogin
                      // }
                    >
                      Дальше
                    </Button>
                    <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Назад
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel optional={activeStep > 2 ? siteName : ''}>
                Новый {isNewTemplate ? 'шаблон' : 'сайт'}
              </StepLabel>
              <StepContent>
                <FormGroup>
                  <FormControlLabel
                    className="mb-3"
                    control={
                      <Checkbox
                        onChange={() => setIsNewTemplate((prev) => !prev)}
                        checked={isNewTemplate}
                      />
                    }
                    label="Создать как новый шаблон"
                  />
                </FormGroup>
                <TextField
                  label={'Название'}
                  value={siteName}
                  onChange={(e) => siteNameHandler(e.target.value)}
                />
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      disabled={siteName.length < 5}
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Дальше
                    </Button>
                    <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Назад
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel optional={activeStep > 3 ? dbName : ''}>
                Название базы данных
              </StepLabel>
              <StepContent>
                <FormGroup>
                  <FormControlLabel
                    className="mb-3"
                    control={
                      <Checkbox
                        onChange={() => setDbShort((prev) => !prev)}
                        checked={dbShort}
                      />
                    }
                    label="Убрать доменную зону в названии"
                  />
                </FormGroup>
                <TextField
                  label={'Название БД'}
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                />
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      disabled={dbName.length < 5}
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Дальше
                    </Button>
                    <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Назад
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel optional={activeStep > 4 ? dbPassword : ''}>
                Пароль к новой базе данных
              </StepLabel>
              <StepContent>
                <TextField
                  label={'Пароль'}
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                />
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      disabled={dbPassword < 5}
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Дальше
                    </Button>
                    <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Назад
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step last>
              {activeStep > 5 ? (
                <StepLabel
                  optional={`${email.length ? 'E-mail: ' + email : '\r \n'} ${
                    email.length && phone.length ? ' | ' : ''
                  } ${phone.length ? 'Телефон: ' + phone : ''} `}
                >
                  Данные клиента
                </StepLabel>
              ) : (
                <StepLabel>Данные клиента</StepLabel>
              )}
              <StepContent>
                <TextField
                  style={{ marginBottom: '1rem' }}
                  label={'E-mail'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label={'Телефон'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Finish
                    </Button>
                    <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Назад
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
          {/* <input
                    type="checkbox"
                    className="mr-2"
                    onChange={(e) => dbShortHandler()}
                    checked={dbShort}
                  /> */}
        </Grid>
        <Grid item sm={4}>
          <pre className="relative w-max hover:opacity-80 transition-opacity duration-300">
            <Command
              active={activeStep > 5}
              template={selectedTemplate}
              siteName={siteName}
              dbName={dbName}
              dbPassword={dbPassword}
              email={email}
              phone={phone}
              // templateOnNewDisk={isNewDisk}
              isNewTemplate={isNewTemplate}
              resetForm={resetFormHandler}
              diskLocation={diskLocation}
              ftpLogin={ftpLogin}
              ftpAddress={ftpAddress}
              ftpDir={ftpDir}
            />
          </pre>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Panel