import { metre, centimetre, millimetre, asMetres } from "./length";
import { unitValue } from "./units";

describe("LengthUnit", () => {
	test("suffix for metre is m", () => {
		expect(metre.suffix).toEqual("m");
	});

	test("suffix for centimetre is cm", () => {
		expect(centimetre.suffix).toEqual("cm");
	});

	test("suffix for millimetre is mm", () => {
		expect(millimetre.suffix).toEqual("mm");
	});
});

describe("Length", () => {
	test("32 centimetres is equivalent to 0.32 metres", () => {
		const length = unitValue(32, centimetre);
		expect(asMetres(length)).toEqual(0.32);
	});

	test("0 centimetres is equivalent to 0 metres", () => {
		const length = unitValue(0, centimetre);
		expect(asMetres(length)).toEqual(0);
	});
    
	test("1000 millimetres is equivalent to 1 metre", () => {
		const length = unitValue(1000, millimetre);
		expect(asMetres(length)).toEqual(1);
	});

	test("0 millimetres is equivalent to 0 metres", () => {
		const length = unitValue(0, millimetre);
		expect(asMetres(length)).toEqual(0);
	});
});
