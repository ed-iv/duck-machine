
export const parseMetadata = (dataURI: string) => {
  const json = Buffer.from(dataURI.substring(29), "base64").toString();
  const result = JSON.parse(json);
  return result;
}

export const getNow = () => Math.ceil(Date.now() / 1000);
