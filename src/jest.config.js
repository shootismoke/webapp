module.exports = {
	setupFilesAfterEnv: ['<rootDir>/../test/jest.setup.ts'],
	testPathIgnorePatterns: [
		'<rootDir>/.next/',
		'<rootDir>/node_modules/',
		'<rootDir>/cypress',
	],
	moduleNameMapper: {
		'\\.(scss|sass|css)$': 'identity-obj-proxy',
	},
	testEnvironment: 'jsdom',
};
