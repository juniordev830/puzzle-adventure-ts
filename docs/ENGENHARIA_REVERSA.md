# Engenharia reversa e estudo — Puzzle Adventure TypeScript

## Objetivo e fluxo

Caminhos e regiões alcançáveis em um tabuleiro. src/index.ts reúne Point e GridBoard. Siga a validação de coordenadas, a obstrução e a visita de células até o cálculo de alcance.

**Tecnologias identificadas** · TypeScript, Node.js.

**Revisão de referência** · `63378be7647b`.

## Mapa do código

| Caminho | Papel de leitura | Símbolos selecionados |
| --- | --- | --- |
| [src/index.ts](../src/index.ts) | Ponto de leitura para entrada ou composição | `Point`, `GridBoard`, `main`, `width`, `height`, `setObstacle`, `clearObstacle`, `isObstacle`, `isValid` |

## Configuração e referências

Ambiente e dependências: [package.json](../package.json).

Referências existentes: [docs/GUIA_DE_VALIDACAO.md](GUIA_DE_VALIDACAO.md).

## Roteiro de estudo e desenvolvimento

1. Comece pelo fluxo descrito acima e localize seus pontos de entrada no mapa. Acompanhe uma entrada válida até a transformação ou a resposta.
2. Abra um teste relacionado ao fluxo e descreva qual regra ele protege. Compare o tratamento esperado para entradas válidas, inválidas e nos limites.
3. Ao adicionar uma regra, determine qual módulo controla o dado e cubra o caso nesse nível. Em seguida, confira o efeito no comando, na API ou na interface de entrada.

**Pergunta de entrevista**

Como evitar repetir uma posição durante a busca e o que isso muda na complexidade?

## Testes versionados

Arquivos para começar a leitura dos cenários de teste: [src/index.test.ts](../src/index.test.ts).

Os comandos e versões de runtime usados no CI ficam em [.github/workflows/ci.yml](../.github/workflows/ci.yml), [.github/workflows/portfolio-checks.yml](../.github/workflows/portfolio-checks.yml).

[Voltar ao README](../README.md).
