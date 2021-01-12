module.exports = {
	transform: {
		'^.+\\.[jt]sx?$': '<rootDir>/src/testutil/jest-preprocess.ts',
	},
	moduleNameMapper: {
		'.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
		'.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
	},
	testPathIgnorePatterns: [
		`node_modules`,
		`\\.cache`,
		`<rootDir>.*/public`,
		'cypress',
	],
	transformIgnorePatterns: [
		`node_modules/(?!(react-native|expo-constants|@unimodules|@expo|expo-font)/)`,
	],
	globals: {
		__PATH_PREFIX__: ``,
		__DEV__: true,
	},
	testURL: `http://localhost`,
	setupFiles: [`<rootDir>/src/testutil/loadershim.js`],
	setupFilesAfterEnv: ['<rootDir>/src/testutil/setupTests.ts'],
};
