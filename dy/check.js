const phantom = require("phantom")
export default async function (user) {
  const instance = await phantom.create()
  const page = await instance.createPage()

  await page.on('onConsoleMessage', function (msg) {
    console.info(msg)
  })
  await page.on('onError', function (msg) {
    console.info(msg)
  })

  await page.open(user.url)

  await new Promise(resolve => setTimeout(resolve, 3000))

  await page.includeJs(user.jsFile)
  const res = await page.evaluate(function () {
    return {
      follower: $(".follower .num").text(),
      likedNum: $(".liked-num .num").text(),
      focus: $(".focus .num").text(),
      works: $(".user-tab .num").text(),
      likes: $(".like-tab .num").text(),
    }
  })
  await instance.exit()
  return res
}