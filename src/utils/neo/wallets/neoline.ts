export const initNeoLine = async () => {
  try {
    // @ts-ignore
    const instance = new NEOLineN3.Init();
    const network = await instance.getNetworks();
    const account = await instance.getAccount();
    if (network.defaultNetwork !== "N3MainNet") {
      throw new Error("Switch your network to N3 MainNet.");
    }
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
