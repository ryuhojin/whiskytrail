import { cookies } from "next/headers";

const fetchInstance = async (url: string, options: RequestInit) => {
  const cookieStore = await cookies();
  const cookieHeader = await cookieStore.toString();
  const modifiedUrl = new URL(`/api${url}`, process.env.NEXT_PUBLIC_API_URL);
  const modifiedOptions = {
    ...options,
    headers: {
      ...options.headers,
      Cookie: cookieHeader,
    },
  };
  return await fetch(modifiedUrl, modifiedOptions);
};
export default fetchInstance;