export const initNeoLine = async () => {
  try {
    // @ts-ignore
    const instance = new NEOLineN3.Init();
    // NEOLineN3 doesn't have getNetworks function
    // @ts-ignore
    const instance2 = new NEOLine.Init();
    const network = await instance2.getNetworks();
    const account = await instance.getAccount();
    return {
      name: "NeoLine",
      instance,
      account,
      network,
    };
  } catch (e: any) {
    throw new Error(e.message ? e.message : "Failed to connect NeoLine.");
  }
};
