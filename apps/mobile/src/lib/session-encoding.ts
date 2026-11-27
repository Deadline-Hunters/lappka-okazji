// Encoding UTF-16 code units avoids relying on a TextEncoder polyfill in Hermes.
export function encodeSession(value: string): Uint8Array {
  const bytes = new Uint8Array(value.length * 2);
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    bytes[i * 2] = code >>> 8;
    bytes[i * 2 + 1] = code & 0xff;
  }
  return bytes;
}

export function decodeSession(bytes: Uint8Array): string {
  if (bytes.length % 2 !== 0) throw new Error("Invalid encrypted session");
  let value = "";
  for (let i = 0; i < bytes.length; i += 2) {
    value += String.fromCharCode((bytes[i] << 8) | bytes[i + 1]);
  }
  return value;
}
