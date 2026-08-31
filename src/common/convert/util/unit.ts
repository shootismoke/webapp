/**
 * Parts per billion.
 */
export const ppb = 'ppb';
/**
 * Parts per million.
 */
export const ppm = 'ppm';
/**
 * Microgram per cubic meter.
 */
export const ugm3 = 'µg/m³';
/**
 * Particles per cubic centermeter.
 */
export const ppcm3 = 'particles/cm³';

/**
 * Array of pollutant concentration units.
 */
export const AllUnits = [ppb, ppm, ugm3, ppcm3];

/**
 * Pollutant concentration units.
 */
export type Unit = typeof ppb | typeof ppm | typeof ugm3 | typeof ppcm3;
