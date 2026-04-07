import { v4 as uuidv4 } from "uuid";

export const duplicateFormEntry = <T extends { name: string; }>(item: EcaasForm<T, "name">, duplicates: number, complete?: boolean) => {
	const newItem = {
		complete: complete ?? item.complete,
		data: {
			...item.data,
			name: `${item.data.name} (${duplicates})`,
			id: uuidv4(),
		},
	};

	return newItem;
};
