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
			const area = unitValue(770, millimetresSquare);
			expect(asCentimetresSquare(area)).toEqual(7.7);
		});
		test("0 millimetres square is equivalent to 0 centimetres square", () => {
			const area = unitValue(0, millimetresSquare);
			expect(asCentimetresSquare(area)).toEqual(0);
		});
            
		test("1000 millimetres square is equivalent to 10 centimetres square", () => {
			const area = unitValue(1000, millimetresSquare);
			expect(asCentimetresSquare(area)).toEqual(10);
		});
		test("7 metres square is equivalent to 7700 centimetres square", () => {
			const area = unitValue(7, metresSquare);
			expect(asCentimetresSquare(area)).toEqual(70000);
		});
		test("0 metres square is equivalent to 0 centimetres square", () => {
			const area = unitValue(0, metresSquare);
			expect(asCentimetresSquare(area)).toEqual(0);
		});
            
		test("10 metres square is equivalent to 10 centimetres square", () => {
			const area = unitValue(10, metresSquare);
			expect(asCentimetresSquare(area)).toEqual(100000);
		});
	});
});