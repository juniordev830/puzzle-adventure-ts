# Puzzle Adventure TypeScript

Projeto de estudo de lógica para puzzles em grade, algoritmos de caminho e validação de mapas usando TypeScript. O estado atual é uma biblioteca de lógica e não um jogo visual completo para navegador.

## Tecnologias

- TypeScript
- Jest
- Node.js e npm
- GitHub Actions para build e testes automatizados

## Requisitos

- Node.js e npm
- Dependências instaladas com npm

## Instalação

```bash
npm ci
```

## Comandos

```bash
# Executar testes
npm test

# Compilar TypeScript
npm run build
```

## Estrutura

```text
.
├── src/
│   ├── index.ts
│   └── index.test.ts
├── jest.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Áreas de estudo

- Representação de grade e células.
- Busca de caminhos e validação de conectividade.
- Testes automatizados para casos válidos e inválidos.

Consulte os módulos em `src/index.ts` para identificar as funções e os tipos exportados atualmente.

## Próximas melhorias

- Documentar a API pública de cada módulo com exemplos de entrada e saída.
- Adicionar cenários de teste para mapas maiores e casos-limite.
- Evoluir a lógica para uma interface visual somente quando essa camada for implementada.

Projeto de portfólio em desenvolvimento.
