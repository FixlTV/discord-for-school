const webuntis = require('webuntis');
const { login } = require('./config.json');

(async () => {
    const untis = new webuntis(login.school, login.username, login.password, login.server);
    await untis.login()
    let date = new Date(2022, 2, 21)
    let date1 = new Date(2022, 2, 26)
    console.log(await (await untis.getHomeWorksFor(date, date1)))
    await untis.logout()
})()