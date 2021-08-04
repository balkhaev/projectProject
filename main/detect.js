const Tesseract = require("tesseract.js");

exports.detect = function (path) {
  return Tesseract.recognize(path, "eng+rus").then(({ data }) => {
    return {
      number: parseInt(data.text.replace(" ", "").replace("o", "0")),
      text: data.text,
    };
  });
};
