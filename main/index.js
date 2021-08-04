require("dotenv").config();

const { detect } = require("./detect");
const tarkov = require("./tarkov");
const data = require("./data");
const bot = require("./bot");

async function run() {
  bot.debug(true);

  const skipLauncher = await tarkov.isExecuted();

  if (!skipLauncher) {
    tarkov.run(process.env.LAUNCHER_PATH);

    console.log("Waiting for launcher...");

    await bot.waitAndClick(
      data.launcher.coords.x,
      data.launcher.coords.y,
      data.launcher.color
    );
  }

  console.log("Waiting for tarkov...");

  await bot.waitAndClick(
    data.marketplace.coords.x,
    data.marketplace.coords.y,
    data.marketplace.color
  );

  for (item of data.items) {
    console.log(`Searching ${item}...`);

    await bot.wait(2000);

    bot.type(data.searchInput.coords.x, data.searchInput.coords.y, item);

    await bot.wait(2000);

    bot.click(data.searchItem.coords.x, data.searchItem.coords.y);

    await bot.wait(2000);

    console.log(`Detecting ${item} price...`);

    const pricepath = `./files/${item}-price-${new Date().toLocaleDateString()}.jpg`;

    bot.screen(
      data.itemPrice.coords.x,
      data.itemPrice.coords.y,
      data.itemPrice.size.width,
      data.itemPrice.size.height,
      pricepath
    );

    const sellerpath = `./files/${item}-seller-${new Date().toLocaleDateString()}.jpg`;

    bot.screen(
      data.itemSeller.coords.x,
      data.itemSeller.coords.y,
      data.itemSeller.size.width,
      data.itemSeller.size.height,
      sellerpath
    );

    // bot.keyTap("pagedown");

    // await bot.wait(1000);

    // bot.click(data.paginatorLast.coords.x, data.paginatorLast.coords.y);

    // await bot.wait(1000);

    // const quantitypath = `./files/${item}-quantity-${new Date().toLocaleDateString()}.jpg`;

    // bot.screen(
    //   data.itemQuantity.coords.x,
    //   data.itemQuantity.coords.y,
    //   data.itemQuantity.size.width,
    //   data.itemQuantity.size.height,
    //   quantitypath
    // );

    const price = await detect(pricepath);
    const seller = await detect(sellerpath);

    console.log({ price, seller });
  }
}

exports = run;

if (require.main === module) {
  run();
}
