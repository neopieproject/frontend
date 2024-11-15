import { BaseDapi } from "@neongd/neo-dapi";

export const initNeoLineMobile = async () => {
  try {
    // @ts-ignore
    const instance = new BaseDapi(window.NeoLineMobile);
    const account = await instance.getAccount();
    return {
      name: "NeoLine Mobile",
      instance,
      account,
    };
  } catch (e: any) {
    throw new Error(
      e.message ? e.message : "Failed to connect NeoLine Mobile."
    );
  }
};
