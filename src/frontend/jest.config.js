module.exports = {
	preset: "ts-jest",
	testPathIgnorePatterns: [
		'<rootDir>/.next/',
		'<rootDir>/node_modules/',
		'<rootDir>/cypress',
	],
	// tsconfig sets `jsx: preserve` for Next, which would leave JSX in ts-jest's
	// output. Compile it for tests instead.
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
	},
	moduleNameMapper: {
		'^@common/(.*)$': '<rootDir>/../../src/common/$1',
		'\\.(scss|sass|css)$': 'identity-obj-proxy',
	},
	testEnvironment: 'jsdom',
};
