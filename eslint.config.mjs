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
			'@stylistic/object-curly-spacing': ["error", "always"],
			'@stylistic/quotes': ['error', 'double', { avoidEscape: true, allowTemplateLiterals: 'always' }],
			'vue/html-indent': ['error', 'tab'],
			'vue/no-multiple-template-root': 'off',
			'object-shorthand': 'error',
			'no-useless-rename': 'error',
			'no-unused-vars': 'off',
    		'@typescript-eslint/no-unused-vars': ['error'],
			'@typescript-eslint/no-unnecessary-type-assertion': 'error'
		}
	}
).append({
	// adds support for lints that need typechecking (i.e. ability to load TypeScript types)
	languageOptions: {
		parserOptions: {
			projectService: true,
			tsConfigRootDir: import.meta.dirname
		}
	}
});