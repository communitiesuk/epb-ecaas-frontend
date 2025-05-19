/** record variant that ensures all members of an enumeration are used as keys */
export type EnumRecord<E extends string | number | symbol, V> = {
	[K in E]: V
};
