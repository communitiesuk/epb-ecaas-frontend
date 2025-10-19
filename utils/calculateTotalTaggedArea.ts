import { isFormComplete } from "../stores/ecaasStore.schema"

export const calculateTotalTaggedArea = (
  id: string,
  sectionsOfTaggedItems: EcaasFormList<EcaasTaggedItem>[]
): number | undefined => {
  let totalTaggedArea = 0;
  const completeItems = sectionsOfTaggedItems
    .flatMap(section => section.data)
    .filter((item) => isFormComplete(item));

  for (const completeItem of completeItems) {
    const item = completeItem.data
    if("associatedItemId" in item && item.associatedItemId === id || "taggedItem" in item && item.taggedItem === id) {

      totalTaggedArea += getAreaOfItem(completeItem.data);
    }
  }
  return totalTaggedArea;
};

const getAreaOfItem = (item: EcaasTaggedItem) => {
  return "surfaceArea" in item ? item.surfaceArea : Number(item.height) * Number(item.width);
};

export const isTotalTaggedAreaLessThanGross = (
  grossArea: number,
  totalTaggedArea: number,
  currentItemArea: number = 0
) => {

  return grossArea - (totalTaggedArea! + currentItemArea) > 0;
};
