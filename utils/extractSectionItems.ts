export const extractSectionItems = <T extends Record<string, unknown>>(
	section: EcaasFormList<T>,
): AssociatedItemValues[] => {
	return section.data.map((x) => {
		const item = x.data as Partial<T>;

		return {
			id: item.id!,
			pitch: item.pitchOption === undefined ? item.pitch : extractPitch(item),
			...("orientation" in item && { orientation: item.orientation }),
		} as AssociatedItemValues;
	});
};

export const extractResolvedSectionItems = <T extends Record<string, unknown>>(
	section: T[],
): AssociatedItemValues[] => {
	return section?.map((x) => {

		return {
			id: x.id!,
			pitch: x.pitchOption === undefined ? x.pitch : extractPitch(x),
			...("orientation" in x && { orientation: x.orientation }),
		} as AssociatedItemValues;
	}) ?? [];
};