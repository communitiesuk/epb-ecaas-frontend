import type { ValidateFunction } from 'ajv';
import 'vitest';

interface CustomMatchers<R = unknown> {
	toPassJsonSchema: (validate: ValidateFunction<unknown>) => R
}

declare module 'vitest' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface Matchers<T = unknown> extends CustomMatchers<T> {}
}
