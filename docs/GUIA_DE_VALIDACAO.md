# Verificação e evolução — Puzzle Adventure TypeScript

## Escopo confirmado

Biblioteca TypeScript de lógica para puzzles em grade, não jogo visual final.

## Localização do código

`src/index.ts`, `src/index.test.ts`, `jest.config.js`, `package.json`.

## Verificar localmente

`npm ci`, `npm test` e `npm run build`.

Use dados fictícios e registre no PR o comando, ambiente e resultado observado. Para projetos sem runtime instalado, marque a verificação como pendente em vez de afirmar que passou.

## Casos de regressão a cobrir

Validar mapas sem saída, grids vazios, coordenadas negativas, caminho mínimo, mapas desconectados e estado imutável entre chamadas.

## Limitações e próximo incremento

Próxima etapa: documentar a representação de mapas e fixar exemplos pequenos que provem cada regra.

## Critérios de revisão

- [ ] O comportamento alterado está descrito com exemplo reproduzível.
- [ ] Há teste ou procedimento de validação compatível com o código real.
- [ ] Nenhuma chave, dado pessoal ou arquivo gerado foi incluído sem necessidade.
- [ ] A documentação distingue o implementado do planejado.
