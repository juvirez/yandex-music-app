const specialCodeToAccelerators = {
  IntlBackslash: "`",
  Equal: "=",
  Minus: "-",
  BracketRight: "]",
  BracketLeft: "[",
  Enter: "Enter",
  Quote: "'",
  Semicolon: ";",
  Backslash: "\\",
  Comma: ",",
  Slash: "/",
  Period: ".",
  Tab: "Tab",
  Space: "Space",
  Backquote: "§", // TODO: check
  Backspace: "Backspace",
  Escape: "Escape",
  OSRight: "Command",
  OSLeft: "Command",
  ShiftLeft: "Shift",
  CapsLock: "Capslock",
  AltLeft: "Alt",
  ControlLeft: "Control",
  ShiftRight: "Shift",
  AltRight: "Alt",
  ControlRight: "Control",
  NumpadDecimal: "numdec",
  NumpadMultiply: "nummult",
  NumpadAdd: "numadd",
  NumLock: "Numlock",
  AudioVolumeUp: "VolumeUp",
  AudioVolumeDown: "VolumeDown",
  AudioVolumeMute: "VolumeMute",
  NumpadDivide: "numdiv",
  NumpadEnter: "Enter",
  NumpadSubtract: "numsub",
  NumpadEqual: "=",
  IntlYen: undefined,
  IntlRo: undefined,
  NumpadComma: "numdec",
  Insert: "Insert",
  Home: "Home",
  PageUp: "PageUp",
  Delete: "Delete",
  End: "End",
  PageDown: "PageDown",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  ArrowDown: "Down",
  ArrowUp: "Up",
  MetaLeft: "Command",
  MetaRight: "Command"
};

exports.keyCodeToAccelerator = code => {
  const keyMatch = code.match(/^Key(\w)$/);
  if (keyMatch && keyMatch[1]) {
    return keyMatch[1];
  }

  const digitMatch = code.match(/^Digit(\d)$/);
  if (digitMatch && digitMatch[1]) {
    return digitMatch[1];
  }

  const fMatch = code.match(/^F\d{1,2}$/);
  if (fMatch) {
    return code;
  }

  const numpadMatch = code.match(/^Numpad(\d)$/);
  if (numpadMatch && numpadMatch[1]) {
    return "num" + numpadMatch[1];
  }

  return specialCodeToAccelerators[code];
};

exports.acceleratorToHumanReadable = accelerator => {
  const numMatch = accelerator.match(/^num(\d)$/);
  if (numMatch && numMatch[1]) {
    return numMatch[1];
  }

  switch (accelerator) {
    case "numdec":
      return ".";
    case "numadd":
      return "+";
    case "numsub":
      return "-";
    case "nummult":
      return "*";
    case "numdiv":
      return "÷";
    case "Command":
      return "Cmd";
  }

  return accelerator;
};
