const execFile = require("child_process").execFile;
const exec = require("child_process").exec;

exports.run = function (path) {
  return new Promise((resolve, reject) => {
    execFile(path, function (err, data) {
      if (err) {
        return reject(err);
      }

      resolve(data.toString());
    });
  });
};

exports.isExecuted = function () {
  return new Promise((resolve, reject) => {
    exec("tasklist", function (err, stdout) {
      if (err) {
        return reject(err);
      }

      resolve(stdout.toLowerCase().includes("tarkov"));
    });
  });
};
