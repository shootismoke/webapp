module.exports = {
	preset: "ts-jest",
	testPathIgnorePatterns: [
		'<rootDir>/.next/',
		'<rootDir>/node_modules/',
		'<rootDir>/cypress',
	],
	moduleNameMapper: {
		'\\.(scss|sass|css)$': 'identity-obj-proxy',
	},
	setupFiles: ['../../test/setup.jest.ts'],
	testEnvironment: 'jsdom',
};
