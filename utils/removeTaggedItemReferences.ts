export const removeTaggedItemReferences = <T extends Record<string, unknown>>(
  storeItems: EcaasFormList<T>,
  taggedItemId: string | undefined,
  keyToCheck: keyof T
) => {
  const store = useEcaasStore();

  storeItems.data.forEach((x, index) => {
    const data = x.data as Partial<T>;
    if (data[keyToCheck] === taggedItemId) {
      store.$patch(() => {
        (storeItems.data[index]!.data as Partial<T>)[keyToCheck] = undefined;
        storeItems.data[index]!.complete = false;
        storeItems.complete = false;
      });
    }
  });
};
