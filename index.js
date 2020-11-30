const TelegramBot = require('node-telegram-bot-api')
const RSSHub = require('rsshub')
const dyJSON = require("./dy/star.json")
const user = require("./user.json")
const token = '1268459911:AAFY1R2O-wN_4cfyNWhR4XmhwYTRErNSnc0'

import check from './dy/check'

const bot = new TelegramBot(token, {
  polling: true
})

bot.sendMessage(user.msg_id, "bot start")


bot.onText(/\/btc/, (msg) => {
  bot.sendMessage(msg.chat.id, 'gg')
  console.log(msg.chat.id)
})

bot.onText(/\/test/, (msg) => {
  RSSHub.request('/bilibili/bangumi/media/9192')
    .then((data) => {
      console.log(data)
    })
    .catch((e) => {
      console.log(e)
    })
})


bot.onText(/\/check/, async (msg) => {
  const res = await check(dyJSON["南北芝麻糊"])
  const resMsg = `南北芝麻糊 当前粉丝数${res.follower}, 关注数${res.focus}, 被赞量${res.likedNum}, 作品数${res.works}, 喜欢的作品${res.likes}`
  bot.sendMessage(msg.chat.id, resMsg)
})

bot.onText(/\/dylists/, (msg) => {
  const users = Object.getOwnPropertyNames(dyJSON)
  const resMsg = users.length ? (`当前关注用户： ${users.join(", ")}`) : "当前抖音无特别关注"
  bot.sendMessage(msg.chat.id, resMsg)
})

async function checkDyUpdates(msg_id, name, time = 10 * 1000) {
  let previousData = (await check(dyJSON[name]))
  console.log(previousData.works)
  setInterval(async () => {
      let newData = (await check(dyJSON[name]))
      console.log(newData.works)
      if (newData.focus !== previousData.focus) {
          bot.sendMessage(msg_id, `${name}目前关注数为${newData.focus}`)
      }
      let change = newData.works - previousData.works
      if (change !== 0) {
        console.log(`${new Date()} check dy updates ${change}`)
          const resMsg = (change > 0) ? `${name}更新了${change}部作品` : `${name}可能删减了${0-change}部作品`
          bot.sendMessage(msg_id, `${resMsg}, 点击${dyJSON[name].user}查看！`)
      }
      previousData = newData
  }, time)
}
checkDyUpdates(user.msg_id, "test")
checkDyUpdates(user.msg_id, "胡楚靓", 5 * 60 * 1000)
checkDyUpdates(user.msg_id, "人民日报", 10 * 60 * 1000)

bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id
  const resp = match[1]
  bot.sendMessage(chatId, resp)
})