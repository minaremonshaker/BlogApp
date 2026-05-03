export function removeTrailingCommaAndSplit(str) {
  return str.replace(/,$/, "").replace(" ", "").split(",");
}

export function removeAllCommasAndTrim(str) {
   return str.replaceAll(",", " ").trim();
}