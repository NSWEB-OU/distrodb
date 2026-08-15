import * as migration_20260815_153039_initial from './20260815_153039_initial'

export const migrations = [
  {
    up: migration_20260815_153039_initial.up,
    down: migration_20260815_153039_initial.down,
    name: '20260815_153039_initial',
  },
]
