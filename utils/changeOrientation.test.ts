import { getUpdatedOrientation } from "./changeOrientation";

describe("getUpdatedOrientation", () => {

	describe("when difference is a postive number", () => {
		
		it("when current orientation plus difference is within 0 and 360", () => {
			//Arrange
			const currentOrientation = 10;
			const newOrientation = 50;
			//Act
			const orientation = getUpdatedOrientation(currentOrientation, newOrientation);
			//Assert
			expect(orientation).toBe(60);
			expect(getUpdatedOrientation(100, 200)).toBe(300);
		});

		it("when current orientation is 360 it resets to 0", () => {
			//Arrange
			const currentOrientation = 360;
			const newOrientation = 50;
			//Act
			const orientation = getUpdatedOrientation(currentOrientation, newOrientation);
			//Assert
			expect(orientation).toBe(50);
		});
	
		it("when current orientation plus difference exceeds 360 it resets to 0", () => {
			//Arrange
			const currentOrientation = 100;
			const newOrientation = 270;
			//Act
			const orientation = getUpdatedOrientation(currentOrientation, newOrientation);
			//Assert
			expect(orientation).toBe(10);
			expect(getUpdatedOrientation(180, 200)).toBe(20);
		});
	});

	describe("when difference is a negative number", () => {
		
		it("when current orientation minus difference is within 0 and 360", () => {
			//Arrange
			const currentOrientation = 100;
			const newOrientation = -50;
			//Act
			const orientation = getUpdatedOrientation(currentOrientation, newOrientation);
			//Assert
			expect(orientation).toBe(50);
			expect(getUpdatedOrientation(20, -10)).toBe(10);
		});
		
		it("when current orientation minus difference is below 0 it resets to 360", () => {
			//Arrange
			const currentOrientation = 10;
			const newOrientation = -50;
			//Act
			const orientation = getUpdatedOrientation(currentOrientation, newOrientation);
			//Assert
			expect(orientation).toBe(320);
			expect(getUpdatedOrientation(6, -10)).toBe(356);
		});
	});
});