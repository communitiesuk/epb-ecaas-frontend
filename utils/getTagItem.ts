export const getTagItem = (
	id: string,
	sections: EcaasFormList<EcaasTagItem>[],
) => {
	return sections
		.flatMap((section) => section.data)
		.find((item) => item.data.id === id);
};
