export enum AreaUnitName {
	METRES_SQUARE = "metres square",
	CENTIMETRE_SQUARE = "centimetres square",
	MILLIMETRES_SQUARE_PER_METRE = "millimetres square per metre",
}

enum AreaSuffix {
	METRES_SQUARE = "m²",
	CENTIMETRE_SQUARE = "cm²",
	MILLIMETRES_SQUARE_PER_METRE = "mm²/m",
}

export class AreaUnit {
	name: AreaUnitName;
	suffix: AreaSuffix;

	constructor(name: AreaUnitName) {
		this.name = name;
		this.suffix = this.getSuffix();
	}

	private getSuffix() {
		switch (this.name) {
			case AreaUnitName.METRES_SQUARE: return AreaSuffix.METRES_SQUARE;
			case AreaUnitName.CENTIMETRE_SQUARE: return AreaSuffix.CENTIMETRE_SQUARE;
			case AreaUnitName.MILLIMETRES_SQUARE_PER_METRE: return AreaSuffix.MILLIMETRES_SQUARE_PER_METRE;
		}
	}
}

export const metresSquare = new AreaUnit(AreaUnitName.METRES_SQUARE);
export const centimetresSquare = new AreaUnit(AreaUnitName.CENTIMETRE_SQUARE);
export const millimetresSquarePerMetre = new AreaUnit(AreaUnitName.MILLIMETRES_SQUARE_PER_METRE);