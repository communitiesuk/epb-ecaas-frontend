import { defineFormKitConfig } from '@formkit/vue';
import GovButton from './components/GovButton.vue';
import GovRadios from './components/GovRadios.vue';
import type { FormKitInputs, FormKitOptionsProp } from '@formkit/inputs';
import GovDropdown from './components/GovDropdown.vue';
import GovInputInt from './components/GovInputInt.vue';
import GovInputWithSuffix from './components/GovInputWithSuffix.vue';
import type { GovDetailsProps } from './components/GovDetails.vue';


type GovRadioOption = {
	label: string;
	hint?: string;
}

// Enable TypeScript support for custom inputs
declare module '@formkit/inputs' {
    interface FormKitInputProps<Props extends FormKitInputs<Props>> {
        'govRadios': {
            type: 'govRadios',
            options: Record<string, string | GovRadioOption>
			details?: GovDetailsProps
        },
        'govButton': {
            type: 'govButton'
        },
        'govDropdown': {
            type: 'govDropdown',
            options: FormKitOptionsProp
        },
        'govInputInt': {
            type: 'govInputInt'
        },
        'govInputWithSuffix': {
            type: 'govInputWithSuffix'
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
                component: GovButton
            },
            govDropdown: {
                type: 'input',
                component: GovDropdown
            },
            govInputInt: {
                type: 'input',
                component: GovInputInt
            },
            govInputWithSuffix: {
              type: "input",
              component: GovInputWithSuffix
            },
        }
    };
})