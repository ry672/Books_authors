import ImageKit from "imagekit-javascript";

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
});

type ImageKitAuth = {
  token: string;
  expire: number;
  signature: string;
};

export async function uploadToImageKit(file: File) {
  const authResponse = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/imagekit/auth`
  );

  if (!authResponse.ok) {
    throw new Error("Failed to get ImageKit auth parameters");
  }

  const auth: ImageKitAuth = await authResponse.json();

  return imagekit.upload({
    file,
    fileName: file.name,
    token: auth.token,
    signature: auth.signature,
    expire: auth.expire,
    folder: "/authors",
    useUniqueFileName: true,
  });
}