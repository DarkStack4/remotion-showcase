# WallFrames

Quadro de evidencias animado para Remotion. Cada quadro, fio, pino e texto vem de props; o componente nao tem caso fixo.

## Arquivos

- `WallFrames.tsx` — composicao e camera.
- `parts.tsx` — polaroid, pino e fio.
- `photos.tsx` — fotos desenhadas em CSS/SVG e suporte a imagem externa.
- `defaults.ts` — preset de crime e preset financeiro.
- `types.ts` — contrato das props.

## Props

| Prop | Tipo | Uso |
|---|---|---|
| `caseLabel` | string | Linha pequena acima do titulo |
| `title` | string | Titulo; use `\n` para quebrar linha |
| `stamp` | string | Carimbo no canto inferior direito |
| `footer` | string | Legenda embaixo do quadro |
| `frames` | EvidenceFrame[] | Quadros e posicoes |
| `links` | EvidenceLink[] | Fios entre ids |
| `titleSize` | number | Tamanho do titulo, padrao 84 |

## EvidenceFrame

```ts
{
  id: 'suspect',
  x: 90,
  y: 170,
  rotation: -4,
  delay: 8,
  code: 'EVIDENCE 01 · PROFILE',
  title: 'THE SPENDER',
  photo: {kind: 'variant', variant: 'suspect'}
}
```

Coordenadas usam o quadro interno de 1000 x 1400. A polaroid tem 260 x 326.

Variantes de foto: `suspect`, `scene`, `weapon`, `witness`, `alibi`, `phone`, `card`.

Para usar imagem propria:

```ts
photo: {kind: 'image', src: staticFile('caso/foto.jpg'), fit: 'cover', position: 'center'}
```

## Fios

```ts
{from: 'suspect', to: 'scene', bend: 163, delay: 116}
```

`bend` desloca o ponto de controle da curva. Positivo desce, negativo sobe.

## Render

```powershell
npx remotion render src/wall-entry.ts WallFrames out/wallframes.mp4 --codec=h264
npx remotion render src/wall-entry.ts WallFramesMoney out/wallframes-money.mp4 --codec=h264
```

No GitHub Actions, o workflow `.github/workflows/wallframes.yml` renderiza os dois e sobe os MP4 como artefato.
