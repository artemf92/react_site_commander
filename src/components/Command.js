import { Button, Paper, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/system';
import CopyAllIcon from '@mui/icons-material/CopyAll'
import CheckIcon from '@mui/icons-material/Check'
import Typography from '@mui/material/Typography';

function Command({
  active,
  template,
  siteName,
  dbName,
  dbPassword,
  email,
  phone,
  templateOnNewDisk,
  isNewTemplate,
  resetForm,
  diskLocation,
  ftpLogin,
  ftpAddress,
  ftpDir
}) {
  const [copied, setCopied] = useState(false)
  const textarea = useRef()
  const textarea2 = useRef()

  let command = ''

  if (diskLocation === 'FTP') {
    command += `scp -rp ${process.env.REACT_APP_SSH_LOGIN}@${
      process.env.REACT_APP_SSH_ADDRESS
    }:/var/www/www-root/data/${templateOnNewDisk ? 'mnt/disk2' : 'www'}/${
      template.name
    }/* ${ftpDir}/;\n`
    command += `scp -rp ${process.env.REACT_APP_SSH_LOGIN}@${
      process.env.REACT_APP_SSH_ADDRESS
    }:/var/www/www-root/data/${templateOnNewDisk ? 'mnt/disk2' : 'www'}/${
      template.name
    }/.htaccess ${ftpDir}/;\n`
  } else {
    command += `scp -rp /var/www/www-root/data/${
      templateOnNewDisk ? 'mnt/disk2' : 'www'
    }/${template.name}/* /var/www/www-root/${
      diskLocation === 'SSD' ? 'data/mnt' : 'www'
    }/disk2/${siteName}/;\n`
    command += `scp -rp /var/www/www-root/data/${
      templateOnNewDisk ? 'mnt/disk2' : 'www'
    }/${template.name}/.htaccess /var/www/www-root/${
      diskLocation === 'SSD' ? 'data/mnt' : 'www'
    }/disk2/${siteName}/;\n`
    command += `mysqldump --no-tablespaces -u${template.db} -p${template.password_db} ${template.db} > /var/www/www-root/data/mnt/disk2/db/${template.db}.sql;\n`
  }

  if (diskLocation === 'FTP') {
    command += `mysql -u${dbName} -p${dbPassword} ${dbName} < ${ftpDir}/${template.db}.sql;\n`
  } else {
    command += `mysql -u${dbName} -p${dbPassword} ${dbName} < /var/www/www-root/data/mnt/disk2/db/${template.db}.sql;\n`
  }

  command += `mysql;\n`
  command += `use ${dbName};\n`
  command += `TRUNCATE oc_order;\n`
  command += `TRUNCATE oc_order_history;\n`
  command += `TRUNCATE oc_order_option;\n`
  command += `TRUNCATE oc_order_product;\n`
  command += `TRUNCATE oc_order_total;\n`
  command += `TRUNCATE oc_newfastorder;\n`
  command += `TRUNCATE oc_newfastorder_product;\n`
  command += `UPDATE \`oc_information_description\` SET \`description\` = REPLACE(\`description\`,'${template.name}', '${siteName}');\n`
  if (email)
    command += `UPDATE \`oc_information_description\` SET \`description\` = REPLACE(\`description\`,'help@jastholding.com', '${email}');\n`
  command += `UPDATE \`oc_module\` SET \`setting\` = REPLACE(\`setting\`,'${template.name}', '${siteName}');\n`
  if (!isNewTemplate) {
    command += `UPDATE \`oc_user\` SET password = 'ae15d81189e35cb0a9d3fa017fc3a9c027d307b7' WHERE user_id = 1;\n`
    command += `UPDATE \`oc_user\` SET salt = 'k0AFlVMUz' WHERE user_id = 1;\n`
  }
  command += `UPDATE \`oc_setting\` SET \`value\` = REPLACE(\`value\`,'${template.name}', '${siteName}');\n`
  if (email)
    command += `UPDATE \`oc_setting\` SET \`value\` = REPLACE(\`value\`,'help@jastholding.ru', '${email}');\n`
  if (email)
    command += `UPDATE \`oc_setting\` SET \`value\` = REPLACE(\`value\`,'help@jastholding.com', '${email}');\n`
  if (phone)
    command += `UPDATE \`oc_setting\` SET \`value\` = REPLACE(\`value\`,'8 (999) 999-99-99', '${phone}');\n`
  if (email)
    command += `UPDATE \`oc_user\` SET \`email\` = REPLACE(\`email\`,'help@jastholding.com', '${email}');\n`
  command += `quit;\n`

  if (diskLocation === 'FTP') command += `cd ${ftpDir}/;\n`
  else
    command += `cd /var/www/www-root/data/${
      diskLocation === 'SSD' ? 'data/mnt' : 'www'
    }/${siteName}/;\n`

  command += `grep -irl "DB_DATABASE', '${template.db}" config.php|xargs perl -pi -e "s/DB_DATABASE', '${template.db}/DB_DATABASE', '${dbName}/";\n`
  command += `grep -irl "DB_DATABASE', '${template.db}" admin/config.php|xargs perl -pi -e "s/DB_DATABASE', '${template.db}/DB_DATABASE', '${dbName}/";\n`
  command += `grep -irl "DB_USERNAME', '${template.db}" config.php|xargs perl -pi -e "s/DB_USERNAME', '${template.db}/DB_USERNAME', '${dbName}/";\n`
  command += `grep -irl "DB_USERNAME', '${template.db}" admin/config.php|xargs perl -pi -e "s/DB_USERNAME', '${template.db}/DB_USERNAME', '${dbName}/";\n`
  command += `grep -irl '${template.name}' config.php|xargs perl -pi -e 's/${template.name}/${siteName}/';\n`
  command += `grep -irl '${template.name}' admin/config.php|xargs perl -pi -e 's/${template.name}/${siteName}/';\n`
  command += `grep -irl '${template.name}' robots.txt|xargs perl -pi -e 's/${template.name}/${siteName}/';\n`
  command += `grep -irl '${template.password_db}' admin/config.php|xargs perl -pi -e 's/${template.password_db}/${dbPassword}/';\n`
  command += `grep -irl '${template.password_db}' config.php|xargs perl -pi -e 's/${template.password_db}/${dbPassword}/';\n`

  if (!templateOnNewDisk && diskLocation === 'SSD') {
    command += `grep -irl 'data\\/www' config.php|xargs perl -pi -e 's/data\\/www/data\\/mnt\\/disk2/';\n`
    command += `grep -irl 'data\\/www' admin/config.php|xargs perl -pi -e 's/data\\/www/data\\/mnt\\/disk2/';\n`
  }

  // Настроить замену путей для новго ftp

  let command2 = ''
  command2 += `mysqldump --no-tablespaces -u${template.db} -p${template.password_db} ${template.db} > /var/www/www-root/data/mnt/disk2/db/${template.db}.sql;\n`
  command2 += `scp /var/www/www-root/data/mnt/disk2/db/${template.db}.sql ${ftpLogin}@${ftpAddress}:${ftpDir};\n`
  
  if (diskLocation === 'FTP') {
    command += `rm ${ftpDir}/${template.db}.sql;\n`
    command2 += `rm /var/www/www-root/data/mnt/disk2/db/${template.db}.sql;\n`
  } else command += `rm /var/www/www-root/data/mnt/disk2/db/${template.db}.sql;\n`
  command += '\n'

  const copyHandler = function () {
    setCopied(true)

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(command)
        .then(() => 'Получилось')
        .catch((error) => alert('Что-то пошло не так! Скопируйте вручную.'))
    } else {
      textarea.current.select()
      document.execCommand('copy')
    }
  }
  const copyHandler2 = function () {
    setCopied(true)

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(command)
        .then(() => 'Получилось')
        .catch((error) => alert('Что-то пошло не так! Скопируйте вручную.'))
    } else {
      textarea2.current.select()
      document.execCommand('copy')
    }
  }

  const resetFormHandler = function () {
    return resetForm()
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [copied])

  // if (!active || !template || !siteName || !dbName) return;

  return (
    <>
      {diskLocation === 'FTP' ? (
        <Box>
          <Typography variant="h5">
            Выполнить на хостинге JastHolding
          </Typography>
          <Box style={{ position: 'relative' }}>
            <Paper
              className="px-2 py-2 text-gray-100 whitespace-pre-wrap text-xs max-w-sm overflow-scroll pb-2 mb-4"
              style={{ fontFamily: 'monospace' }}
              elevation={1}
            >
              <textarea
                ref={textarea2}
                cols="50"
                rows="18"
                className="bg-transparent"
                value={command2}
              ></textarea>
            </Paper>
            <Box
              className={[
                'flex flex-wrap justify-center content-center w-10 rounded-md h-10 absolute right-2 top-2 hover:scale-75 transition-all cursor-pointer ',
                copied ? ' bg-green-400 opacity-60' : ' bg-gray-200'
              ]}
              onClick={copyHandler2}
            >
              <Tooltip
                title={copied ? 'Скопировано' : 'Скопировать'}
                placement="top"
                arrow
              >
                {!copied ? <CopyAllIcon /> : <CheckIcon />}
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="h5">Выполнить на новом хостинге</Typography>
        </Box>
      ) : (
        ''
      )}
      <Box style={{ position: 'relative' }}>
        <Paper
          className="px-2 py-2 text-gray-100 whitespace-pre-wrap text-xs max-w-sm overflow-scroll pb-2 mb-4"
          style={{ fontFamily: 'monospace' }}
          elevation={1}
        >
          <textarea
            ref={textarea}
            cols="50"
            rows="18"
            className="bg-transparent"
            value={command}
          ></textarea>
        </Paper>
        <Box
          className={[
            'flex flex-wrap justify-center content-center w-10 rounded-md h-10 absolute right-2 top-2 hover:scale-75 transition-all cursor-pointer ',
            copied ? ' bg-green-400 opacity-60' : ' bg-gray-200'
          ]}
          onClick={copyHandler}
        >
          <Tooltip
            title={copied ? 'Скопировано' : 'Скопировать'}
            placement="top"
            arrow
          >
            {!copied ? <CopyAllIcon /> : <CheckIcon />}
          </Tooltip>
        </Box>
      </Box>
      <Button
        style={{ margin: 'auto', display: 'flex' }}
        variant={'contained'}
        onClick={resetFormHandler}
      >
        Сбросить
      </Button>
    </>
  )
}

Command.propTypes = {}

export default Command
