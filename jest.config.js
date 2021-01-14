module.exports = {
	setupFilesAfterEnv: ['<rootDir>/src/testutil/jest.setup.ts'],
	testPathIgnorePatterns: [
		'<rootDir>/.next/',
		'<rootDir>/node_modules/',
		'<rootDir>/cypress',
	],
	moduleNameMapper: {
		'\\.(scss|sass|css)$': 'identity-obj-proxy',
	},
};
