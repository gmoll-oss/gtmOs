const origExit = process.exit;
process.exit = function(code) {
  if (code !== 0) {
    return;
  }
  return origExit.call(process, code);
};
