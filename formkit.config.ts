import GovStoredList, { type GovStoredListOption } from './components/GovStoredList.vue';
import { defineFormKitConfig } from '@formkit/vue';
import GovFormButton from './components/GovFormButton.vue';
import GovRadios, { type GovRadioOption } from './components/GovRadios.vue';
import type { FormKitInputs, FormKitOptionsProp } from '@formkit/inputs';
import GovDropdown from './components/GovDropdown.vue';
import GovInputFloat from './components/GovInputFloat.vue';
import GovInputInt from './components/GovInputInt.vue';
import GovInputWithSuffix from './components/GovInputWithSuffix.vue';
import GovCheckboxes from './components/GovCheckboxes.vue';
import GovInputText from './components/GovInputText.vue';

// Enable TypeScript support for custom inputs
declare module '@formkit/inputs' {
	interface FormKitInputProps<Props extends FormKitInputs<Props>> {
		'govRadios': {
			type: 'govRadios',
			options: Record<string, string | GovRadioOption>,
			valueType?: 'string' | 'number'
		},
		'govButton': {
			type: 'govButton'
		},
		'govDropdown': {
			type: 'govDropdown',
			options: FormKitOptionsProp | FormKitOptionsProp[]
		},
		'govInputFloat': {
			type: 'GovInputFloat'
		},
		'govInputInt': {
			type: 'govInputInt'
		},
		'govInputWithSuffix': {
			type: 'govInputWithSuffix',
			suffixText: string
		},
		'govCheckboxes': {
			type: 'govCheckboxes',
			options: FormKitOptionsProp,
			help?: string
		},
		'govInputText': {
			type: 'govInputText'
		}, 
		'govStoredList': {
			type: 'govStoredList',
			options: GovStoredListOption[]
		}
	}
}

// Register custom inputs with FormKit
export default defineFormKitConfig(() => {
	return {
		inputs: {
			govRadios: {
				type: 'input',
				component: GovRadios
			},
			govButton: {
				type: 'input',
				component: GovFormButton
			},
			govDropdown: {
				type: 'input',
				component: GovDropdown
			},
			govInputFloat: {
				type: 'input',
				component: GovInputFloat
			},
			govInputInt: {
				type: 'input',
				component: GovInputInt
			},
			govInputWithSuffix: {
				type: "input",
				component: GovInputWithSuffix
			},
			govCheckboxes: {
				type: "input",
				component: GovCheckboxes
			},
			govInputText: {
				type: "input",
				component: GovInputText
			},
			govStoredList: {
				type: "input",
				component: GovStoredList
			}

		}
	};
});