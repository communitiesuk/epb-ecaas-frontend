import { asCentimetresSquare, centimetresSquare, metresSquare, millimetresSquare } from "./area";

describe("AreaUnit", () => {
	test("suffix for millimetres square is mm²", () => {
		expect(millimetresSquare.suffix).toEqual("mm²");
	});
    
	test("suffix for centimetres square is cm²", () => {
		expect(centimetresSquare.suffix).toEqual("cm²");
	});
    
	test("suffix for metres square is m²", () => {
		expect(metresSquare.suffix).toEqual("m²");
	});
	describe("asCentimetresSquare", () => {
		test("770 millimitres square is equivalent to 7.7 centimetres square", () => {
			expect(asCentimetresSquare(770)).toEqual(7.7);
		});
		test("0 millimetres square is equivalent to 0 centimetres square", () => {
			expect(asCentimetresSquare(0)).toEqual(0);
		});
            
		test("1000 millimetres square is equivalent to 10 centimetres square", () => {
			expect(asCentimetresSquare(1000)).toEqual(10);
		});
	});
});