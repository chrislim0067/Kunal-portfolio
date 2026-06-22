/**
 * Stub for the original ColorManipulator. The source was not present in the
 * production source map; only `LightenDarkenColor` was referenced (in commented
 * lensflare code). This reimplementation matches the well-known utility so any
 * future re-enabling of that code path behaves sensibly.
 */
export class ColorManipulator {
  static LightenDarkenColor(hexColor: string, amount: number): string {
    let usePound = false;
    let col = hexColor;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }

    const num = parseInt(col, 16);

    let r = (num >> 16) + amount;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00ff) + amount;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000ff) + amount;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    const result = (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
    return (usePound ? "#" : "") + result;
  }
}
