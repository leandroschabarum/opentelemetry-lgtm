import { Config } from 'jest';

export default async (): Promise<Config> => {
	return {
		preset: 'ts-jest',
		testEnvironment: 'node',
		verbose: true,
		testTimeout: 10000,
		collectCoverage: true,
		detectOpenHandles: true,
		modulePathIgnorePatterns: ['node_modules', '<rootDir>/dist/'],
		coveragePathIgnorePatterns: ['node_modules', '<rootDir>/dist']
	};
};
