export const removeTagLinks = <T extends Record<string, unknown>>(
  sections: EcaasFormList<T>[],
  id: string,
  key = "associatedItemId"
) => {
  for (const section of sections) {
    removeTags(section, id, key);
  }
};

export const removeTags = <T extends Record<string, unknown>>(
  sectionItems: EcaasFormList<T>,
  idToRemove: string | undefined,
  keyToCheck: keyof T = "associatedItemId"
) => {
  const store = useEcaasStore();

  for (const item of sectionItems.data) {
    const idOfTaggedItem = (item.data as Partial<T>)[keyToCheck];
    if (idOfTaggedItem === idToRemove) {
      store.$patch(() => {
        (item.data as Partial<T>)[keyToCheck] = undefined;
        item.complete = false;
        sectionItems.complete = false;
      });
    }
  }
};
