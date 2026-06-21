module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'], // Busca na raiz do projeto
    testMatch: [
        '**/tests/**/*.test.ts',  // Pasta tests com arquivos .test.ts
        '**/tests/**/*.spec.ts'   // ou .spec.ts
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8'
};