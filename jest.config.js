module.exports = {
    preset: "ts-jest", // Usar ts-jest para compilar arquivos TypeScript
    testEnvironment: "node", // Definir o ambiente de teste como Node.js
    roots: ["<rootDir>/src/tests"], // Definir o diretório raiz dos testes
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // Extensões de arquivos reconhecidos
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|js)$", // Regex para identificar os arquivos de teste
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest", // Usar ts-jest para transformar arquivos TypeScript
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1", // Mapeamento para suportar imports com alias
    },
    collectCoverage: true, // Habilitar a coleta de cobertura de código
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}", // Definir os arquivos dos quais será coletada a cobertura
        "!src/**/*.d.ts", // Ignorar arquivos de definição de tipo
    ],
    coverageDirectory: "coverage", // Diretório para armazenar os relatórios de cobertura
    testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Ignorar esses caminhos durante os testes
};
