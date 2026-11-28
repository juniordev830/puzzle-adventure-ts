# Puzzle Adventure TypeScript

**Navegação** · [Tecnologias](#tecnologias) · [Requisitos](#requisitos) · [Instalação](#instalação) · [Código e estudo](docs/ENGENHARIA_REVERSA.md)

Projeto de estudo de lógica para puzzles em grade, algoritmos de caminho e validação de mapas usando TypeScript. O estado atual é uma biblioteca de lógica e não um jogo visual completo para navegador.

## Tecnologias

- TypeScript
- Executor de testes nativo do Node.js
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

## Edição e análise de mapas

O `GridBoard` agora permite `clearObstacle(x, y)` para remover uma parede e `reachableArea({x, y})` para contar as células livres conectadas a uma posição inicial. Essas operações ajudam a validar níveis e a identificar regiões isoladas antes de publicar um puzzle. Posições inválidas ou bloqueadas retornam 0 em `reachableArea`; limpar uma coordenada inválida não altera o mapa. A busca é iterativa e usa no máximo a quantidade de células do tabuleiro.

## Validação e manutenção

Consulte o [guia técnico de validação](docs/GUIA_DE_VALIDACAO.md) antes de alterar o código: ele reúne os comandos, casos de regressão e limites atuais do projeto.

## Código e roteiro de estudo

Como evitar repetir uma posição durante a busca e o que isso muda na complexidade? O [guia de engenharia reversa](docs/ENGENHARIA_REVERSA.md) reúne o mapa dos módulos e uma pergunta técnica baseada no projeto.

Mantido por [João Junior](https://github.com/juniordev830).
