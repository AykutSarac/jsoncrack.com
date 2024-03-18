import { deflate, inflate } from "pako";

// fast, Buffer-compatible implem
export const toByteString = (data: string | Uint8Array | ArrayBuffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const blob =
      typeof data === "string"
        ? new Blob([new TextEncoder().encode(data)])
        : new Blob([data instanceof Uint8Array ? data : new Uint8Array(data)]);
    const reader = new FileReader();
    reader.onload = event => {
      if (!event.target || typeof event.target.result !== "string") {
        return reject(new Error("couldn't convert to byte string"));
      }
      resolve(event.target.result);
    };
    reader.readAsBinaryString(blob);
  });
};

type EncodedData = {
  encoded: string;
  encoding: "bstring";
  /** whether text is compressed (zlib) */
  compressed: boolean;
  /** version for potential migration purposes */
  version?: string;
};

/**
 * Encodes (and potentially compresses via zlib) text to byte string
 */
export const encode = async ({
  text,
  compress,
}: {
  text: string;
  /** defaults to `true`. If compression fails, falls back to bstring alone. */
  compress?: boolean;
}): Promise<EncodedData> => {
  let deflated!: string;
  if (compress !== false) {
    try {
      deflated = await toByteString(deflate(text));
    } catch (error: any) {
      console.error("encode: cannot deflate", error);
    }
  }
  return {
    version: "1",
    encoding: "bstring",
    compressed: !!deflated,
    encoded: deflated || (await toByteString(text)),
  };
};

const byteStringToArrayBuffer = (byteString: string) => {
  const buffer = new ArrayBuffer(byteString.length);
  const bufferView = new Uint8Array(buffer);
  for (let i = 0, len = byteString.length; i < len; i++) {
    bufferView[i] = byteString.charCodeAt(i);
  }
  return buffer;
};

const byteStringToString = (byteString: string) => {
  return new TextDecoder("utf-8").decode(byteStringToArrayBuffer(byteString));
};

export const decode = async (data: EncodedData): Promise<string> => {
  let decoded: string;

  switch (data.encoding) {
    case "bstring":
      // if compressed, do not double decode the bstring
      decoded = data.compressed ? data.encoded : await byteStringToString(data.encoded);
      break;
    default:
      throw new Error(`decode: unknown encoding "${data.encoding}"`);
  }

  if (data.compressed) {
    return inflate(new Uint8Array(byteStringToArrayBuffer(decoded)), {
      to: "string",
    });
  }

  return decoded;
};
