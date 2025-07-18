import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import userEvent from "@testing-library/user-event";
import Outputs from './outputs.vue';
import type { SchemaFhsComplianceResponse } from "~/schema/api-schema.types";

const response: SchemaFhsComplianceResponse = {
	"dwelling_emission_rate": 1.8400410852634337,
	"target_emission_rate": 0.872446010777378,
	"emission_rate_compliant": false,
	"dwelling_primary_energy_rate": 51.122303536668724,
	"target_primary_energy_rate": 29.74396391182418,
	"primary_energy_rate_compliant": false,
	"dwelling_fabric_energy_efficiency": 38.33706714527181,
	"target_fabric_energy_efficiency": 24.06312142537763,
	"fabric_energy_efficiency_compliant": false,
	"energy_demand": {
		"space_heating": {
			"actual": 21.545418711857963,
			"notional": 27.655403116069365
		},
		"space_cooling": {
			"actual": -0.8672527008665998,
			"notional": -0.604182757837868
		}
	},
	"delivered_energy_use": {
		"total": {
			"actual": 66.82234849664779,
			"notional": 86.90402332303697
		},
		"by_system": {
			"mechvent1": {
				"actual": 0.0021738164635221333,
				"notional": 0.0
			},
			"total": {
				"actual": 66.82234849664779,
				"notional": 86.90402332303697
			},
			"topup": {
				"actual": 1.1864616645959027,
				"notional": 1.1864616645959027
			},
			"Microwave": {
				"actual": 0.021470588235292194,
				"notional": 0.021470588235292194
			},
			"Kettle": {
				"actual": 0.021470588235292194,
				"notional": 0.021470588235292194
			},
			"Fridge": {
				"actual": 0.37598039215697415,
				"notional": 0.37598039215697415
			},
			"Clothes_washing": {
				"actual": 0.34007717596649306,
				"notional": 0.34007717596649306
			},
			"Oven": {
				"actual": 0.04627750620680959,
				"notional": 0.04627750620680959
			},
			"Fridge-Freezer": {
				"actual": 0.6735294117647721,
				"notional": 0.6735294117647721
			},
			"Otherdevices": {
				"actual": 4.159288191049666,
				"notional": 4.159288191049666
			},
			"lighting": {
				"actual": 1.3248655610462836,
				"notional": 1.3248655610462836
			},
			"immersion": {
				"actual": 18.151406859389198,
				"notional": 0.0
			},
			"main 1": {
				"actual": 36.37241650360668,
				"notional": 0.0
			},
			"main 2": {
				"actual": 3.845069356944748,
				"notional": 0.0
			},
			"cooling system 1": {
				"actual": 0.05314508342515957,
				"notional": 0.05060423433949979
			},
			"cooling system 2": {
				"actual": 0.22724520932570036,
				"notional": 0.13534340344728563
			},
			"Hobs": {
				"actual": 0.021470588235292194,
				"notional": 0.021470588235292194
			}
		}
	},
	"energy_use_by_fuel": {
		"total": {
			"actual": 27263.5181866323,
			"notional": 35456.841515799075
		},
		"_energy_from_environment": {
			"actual": 0.0,
			"notional": 20613.187522596498
		},
		"mains elec": {
			"actual": 27254.7581866323,
			"notional": 14834.893993202577
		},
		"mains gas": {
			"actual": 8.759999999999215,
			"notional": 8.759999999999215
		}
	}
};

const errors: CorrectedJsonApiError[] = [
	{
		detail: 'Something very specific happened, incorrectly.'
	}
];

describe('show good response in result tabs', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	beforeEach(() => {
		store.$patch({ lastResult: {
			response,
			resultType: 'ok',
		} });
	});

	afterEach(() => {
		store.$reset();
	});

	it('should display some tabs', async () => {
		const { container: dom } = await renderSuspended(Outputs);

		expect(dom.querySelector('.govuk-tabs')).not.toBeNull();
	});

	it('should display primary output data', async () => {
		await renderSuspended(Outputs);

		await user.click(screen.getByRole('link', { name: 'Primary outputs' }));

		const tableTextContent = screen.getByRole('table').textContent;

		const expectedTextsPresent = [
			'1.84', // actual emission rate, rounded
			'Fabric energy efficiency', // FEE header
			'+71.87%', // difference for primary energy rate
		];

		expectedTextsPresent.forEach(text => expect(tableTextContent).toContain(text));
	});

	it('should display energy demand data', async () => {
		await renderSuspended(Outputs);

		await user.click(screen.getByRole('link', { name: 'Energy demand' }));

		const tableTextContent = screen.getByRole('table').textContent;

		const expectedFigures = [
			'21.55',
			'27.66',
			'-0.87',
			'-0.60'
		];

		expectedFigures.forEach(text => expect(tableTextContent).toContain(text));
	});

	it('should display delivered energy use tab', async () => {
		await renderSuspended(Outputs);

		await user.click(screen.getByRole('link', { name: 'Delivered energy use' }));

		const tableTextContent = screen.getByRole('table').textContent;

		const expectedTextsPresent = [
			'0.38',
			'4.16',
			'Washing machine', // display value for clothes washing
			'86.90',
		];

		expectedTextsPresent.forEach(text => expect(tableTextContent).toContain(text));
	});

	it('should display energy use by fuel tab', async () => {
		await renderSuspended(Outputs);

		await user.click(screen.getByRole('link', { name: 'Energy use by fuel' }));

		const tableTextContent = screen.getByRole('table').textContent;

		const expectedTextsPresent = [
			'27254.76',
			'20613.19',
			'Energy from environment', // display value for energy from environment
		];

		expectedTextsPresent.forEach(text => expect(tableTextContent).toContain(text));
	});
});

describe('show error in result tabs', () => {
	const store = useEcaasStore();

	beforeEach(() => {
		store.$patch({ lastResult: {
			errors,
			resultType: 'err',
		} });
	});

	afterEach(() => {
		store.$reset();
	});

	it('does not show any tabs', async () => {
		const { container: dom } = await renderSuspended(Outputs);

		expect(dom.querySelector('.govuk-tabs')).toBeNull();
	});

	it('shows the error from the API', async () => {
		await renderSuspended(Outputs);

		const errorSummary = await screen.findByTestId('resultsErrorSummary');

		expect(errorSummary).toBeDefined();
		const errorText = errorSummary.querySelector('li')?.textContent;

		expect(errorText).toContain('Something very specific happened, incorrectly.');
	});
});

describe('shows a message if there is no result but a user has ended up here', () => {
	const store = useEcaasStore();

	beforeEach(() => {
		store.$patch({ lastResult: undefined });
	});

	afterEach(() => {
		store.$reset();
	});

	it('shows the expected message to say there is no result to show', async () => {
		const { container: dom } = await renderSuspended(Outputs);

		const paraContent = dom.querySelector('p.govuk-body')!.textContent;
		expect(paraContent).toContain('There are no results yet to show.');
	});
});