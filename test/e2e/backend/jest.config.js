module.exports = {
	preset: "ts-jest",
	// tsconfig sets `jsx: preserve` for Next, which would leave JSX in ts-jest's
	// output. Compile it for tests instead.
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
	},
	moduleNameMapper: {
		'^@common/(.*)$': '<rootDir>/../../../src/common/$1',
	},
	setupFilesAfterEnv: ['<rootDir>/util/jest.setup.ts'],
	testEnvironment: 'node',
};
