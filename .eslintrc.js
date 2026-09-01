// Inlined from @amaurym/eslintrc, which was dropped: it nests its own
// TypeScript 4.9 alongside this project's 5.9, and npm hoists that subtree
// differently on macOS and Linux, so `./node_modules/@amaurym/tsconfig` was
// resolvable on a laptop but not in CI.
module.exports = {
	env: {
		browser: true,
		es6: true,
		jest: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:react/recommended',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
	},
	plugins: [
		'react',
		'react-hooks',
		'@typescript-eslint',
		'prettier',
		'simple-import-sort',
	],
	rules: {
		// Sort imports
		'simple-import-sort/imports': 'error',
		// Rules about react hooks
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
