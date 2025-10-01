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
