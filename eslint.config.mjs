import withNuxt from './.nuxt/eslint.config.mjs';
import stylistic from '@stylistic/eslint-plugin';

export default withNuxt(
	{
		files: ['**/*.ts', '**/*.vue'],
		ignores: ['schema/api-schema.types.ts'],
		plugins: {
			'@stylistic': stylistic
		},
		rules: {
			'@stylistic/semi': 'error',
			'@stylistic/indent': ['error', 'tab'],
			'vue/html-indent': ['error', 'tab'],
			'vue/no-multiple-template-root': 'off'
		}
	}
)