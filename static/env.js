const proc = require('child_process');

function checkEnvironment() {
    let cmd = process.platform.startsWith("win") ? 'where' : 'which';
    let exe = process.platform.startsWith("win") ? 'gm.exe' : 'gm';
    proc.exec(`${cmd} ${exe}`, (err, stdout, stderr) => {
        if (stdout.trim() === '') {
            showEnvError();
        }
    });
}

function showEnvError() {
    $('#popEnvErrRoot')[0].style.display = 'block';
    $('#popEnvErr')[0].style.display = 'block';
}

function closeEnvErr() {
    $('#popEnvErrRoot')[0].style.display = 'none';
    $('#popEnvErr')[0].style.display = 'none';
}
