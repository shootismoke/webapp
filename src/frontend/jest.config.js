module.exports = {
	testPathIgnorePatterns: [
		'<rootDir>/.next/',
		'<rootDir>/node_modules/',
		'<rootDir>/cypress',
	],
	moduleNameMapper: {
		'\\.(scss|sass|css)$': 'identity-obj-proxy',
	},
	setupFilesAfterEnv: ['<rootDir>/../../test/jest.setup.ts'],
	testEnvironment: 'jsdom',
};
