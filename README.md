# Puzzle Adventure TypeScript

Projeto de estudo de lógica para puzzles em grade, busca de caminhos e representação de labirintos em **TypeScript**. É uma biblioteca de lógica com um **mapa textual no terminal**, ainda não um jogo visual completo no navegador.

## Funcionalidades

- `new GridBoard(largura, altura)`: cria grade de até 1.000.000 de células, validando dimensões.
- `setObstacle(x, y)` e `clearObstacle(x, y)`: posiciona e remove paredes da grade.
- `findPath(inicio, destino)`: encontra um caminho mais curto em quatro direções por busca em largura (BFS), ou `null` se não houver caminho.
- `renderAscii(inicio, destino)`: produz uma visualização de até **10.000 células** no formato de texto. Identifica obstáculos, início, destino e caminho mais curto calculado.

## Visualização em texto

Símbolos: `S` (início), `G` (destino), `B` (início e destino iguais), `#` (parede), `*` (caminho) e `.` (célula livre).

```ts
import { GridBoard } from './src/index';

const board = new GridBoard(3, 3);
board.setObstacle(1, 1);
console.log(board.renderAscii({ x: 0, y: 0 }, { x: 2, y: 2 }));
```

Saída:

```text
S**
.#*
..G
```

Quando o destino está inacessível, o mapa ainda mostra `S`, `G` e os obstáculos, mas não desenha um caminho inexistente. Células fora da grade, início/destino bloqueados ou mapas de texto maiores que 10.000 células geram `RangeError`.

## Instalação e testes

```bash
npm ci
npm test
npm run build
```

O GitHub Actions testa algoritmo BFS, limites da grade, mapas sem saída, desenho, limpeza de obstáculos e erros de entrada.

## Limites e próximos passos

Não há motor gráfico, animação, movimentação em tempo real, controle de teclado, armazenamento ou interface de navegador. O recurso atual é um **renderizador de caracteres**, útil para depurar labirintos e demonstrar algoritmos de grafos; o objetivo seguinte é uma interface web interativa.

Projeto de portfólio em desenvolvimento.
