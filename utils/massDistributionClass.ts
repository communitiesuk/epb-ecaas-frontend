import type { MassDistributionClass } from "~/schema/aliases";

const classMap: Record<ConciseMassDistributionClass, MassDistributionClass> = {
	D: "D: Mass equally distributed",
	E: "E: Mass concentrated at external side",
	I: "I: Mass concentrated at internal side",
	IE: "IE: Mass divided over internal and external side",
	M: "M: Mass concentrated inside",
};

export function fullMassDistributionClass(massDistributionClass: ConciseMassDistributionClass): MassDistributionClass {
	return classMap[massDistributionClass];
}
