/** record variant that ensures all members of an enumeration are used as keys */
export type EnumRecord<E extends string | number | symbol, V> = {
	[K in E]: V
};

/**
 * converts snake_case string literal to a label with only the first word capitalized (e.g. "open_fireplace" -> "Open fireplace")
 */
export type SnakeToSentenceCase<E extends string> = Capitalize<StringReplace<Lowercase<E>, "_", " ">>;

type StringReplace<
	TString extends string,
	TToReplace extends string,
	TReplacement extends string,
> = TString extends `${infer TPrefix}${TToReplace}${infer TSuffix}`
	? `${TPrefix}${TReplacement}${StringReplace<
		TSuffix,
		TToReplace,
		TReplacement
	>}`
	: TString;

export type PascalToSentenceCase<S extends string> =
  S extends `${infer First}${infer Rest}`
  	? `${First}${PascalToSentenceCaseHelper<Rest>}`
  	: S;

type PascalToSentenceCaseHelper<S extends string, Acc extends string = ''> =
  S extends `${infer First}${infer Rest}`
  	? First extends Lowercase<First>
  		? `${First}${PascalToSentenceCaseHelper<Rest>}`
  		: ` ${Lowercase<First>}${PascalToSentenceCaseHelper<Rest>}`
  	: Acc;