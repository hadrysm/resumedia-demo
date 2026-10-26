import * as migration_20261026_180417_initial from './20261026_180417_initial';

export const migrations = [
  {
    up: migration_20261026_180417_initial.up,
    down: migration_20261026_180417_initial.down,
    name: '20261026_180417_initial'
  },
];
