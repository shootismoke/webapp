module.exports = {
	setupFilesAfterEnv: ['<rootDir>/../test/e2e/frontend/jest.setup.ts'],
	testPathIgnorePatterns: [
		'<rootDir>/.next/',
		'<rootDir>/node_modules/',
		'<rootDir>/cypress',
	],
	moduleNameMapper: {
		'\\.(scss|sass|css)$': 'identity-obj-proxy',
	},
};
