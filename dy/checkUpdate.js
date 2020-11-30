import check from './check'
const dyJSON = require('./star.json')
console.log(dyJSON)
export default async function (msg_id, name, time = 5 * 10 * 1000) {
    let previousData = (await check(dyJSON[name]))
    setInterval(async () => {
        let newData = (await check(dyJSON[name]))
        if (newData.focus !== previousData.focus) {
            bot.sendMessage(msg_id, `${name}目前关注数为${newData.focus}`)
        }
        if (newData.works !== previousData.works) {
            const resMsg = (newData > previousData) ? `${name}更新了${newData - previousData}部作品` : `${name}可能删减了${previousData - newData}部作品`
            bot.sendMessage(msg_id, `${resMsg}, 点击${dyJSON[name].user}查看！`)
        }
        previousData = newData
    }, time)
}