const Jimp = require("jimp");
const robot = require("robotjs");

exports.waitColor = async function (
  x,
  y,
  color,
  { wait = 2000, trys = 50 } = {}
) {
  return new Promise((resolve, reject) => {
    const timeoutId = new setInterval(() => {
      robot.moveMouse(x, y);

      trys -= 1;

      if (robot.getPixelColor(x, y) === color) {
        clearInterval(timeoutId);
        resolve();

        return;
      }

      if (trys === 0) {
        clearInterval(timeoutId);
        reject("Not found color " + color);
      }
    }, wait);
  });
};

exports.screen = function (x, y, width, height, path) {
  const bitmap = robot.screen.capture(x, y, width, height);

  return new Promise((resolve, reject) => {
    try {
      const image = new Jimp(bitmap.width, bitmap.height);
      image.scan(
        0,
        0,
        image.bitmap.width,
        image.bitmap.height,
        function (x, y, idx) {
          const color = bitmap.colorAt(x, y);
          const red = parseInt(color[0] + color[1], 16);
          const green = parseInt(color[2] + color[3], 16);
          const blue = parseInt(color[4] + color[5], 16);

          image.bitmap.data[idx + 0] = Number(red);
          image.bitmap.data[idx + 1] = Number(green);
          image.bitmap.data[idx + 2] = Number(blue);
          image.bitmap.data[idx + 3] = 255;
        }
      );
      image.write(path, resolve);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

exports.waitAndClick = async function (
  x,
  y,
  color,
  { wait = 2000, trys = 50 } = {}
) {
  await exports.waitColor(x, y, color, { wait, trys });
  robot.moveMouse(x, y);
  robot.mouseClick();
};

exports.type = function (x, y, string) {
  robot.moveMouse(x, y);
  robot.mouseClick();
  robot.typeString(string);
};

exports.click = function (x, y) {
  robot.moveMouse(x, y);
  robot.mouseClick();
};

exports.wait = function (ms) {
  return new Promise((resolve) => new setTimeout(resolve, ms));
};

exports.mouseToggle = function (down = "down", button = "left") {
  return robot.mouseToggle(down, button);
};

exports.moveMouse = function (x, y) {
  return robot.moveMouse(x, y);
};

exports.moveMouseSmooth = function (x, y) {
  return robot.moveMouseSmooth(x, y);
};

exports.scrollMouse = function (x, y) {
  return robot.scrollMouse(x, y);
};

exports.dragMouse = function (x, y) {
  return robot.dragMouse(x, y);
};

exports.keyTap = function (key) {
  return robot.keyTap(key);
};

exports.debug = function (enabled) {
  if (!enabled) {
    return;
  }

  setInterval(() => {
    const pos = robot.getMousePos();

    console.log(
      `X: ${pos.x} Y: ${pos.y} Color: ${robot.getPixelColor(pos.x, pos.y)}`
    );
  }, 2000);
};
