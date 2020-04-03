/**
 * Logs the error in a correct format to the console
 * @param msg {string}
 */
export function logError(msg: string): void {
  // eslint-disable-next-line no-console
  console.log(`Workshop Butler ERROR: ${msg}`);
}

export function logInfo(msg: string): void {
  // eslint-disable-next-line no-console
  console.log(`Workshop Butler INFO: ${msg}`);
}
