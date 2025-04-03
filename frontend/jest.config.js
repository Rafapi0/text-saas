const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Fornece o caminho para o seu aplicativo Next.js
  dir: './',
})

// Configuração personalizada do Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  collectCoverageFrom: [
    'pages/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

// createJestConfig é exportado desta forma para garantir que next/jest pode carregar a configuração do Next.js
module.exports = createJestConfig(customJestConfig) 