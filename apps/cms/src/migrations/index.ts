import * as migration_20260815_153039_initial from './20260815_153039_initial'
import * as migration_20260815_172657_changelog from './20260815_172657_changelog'
import * as migration_20260908_131049_add_distro_verified from './20260908_131049_add_distro_verified'

export const migrations = [
  {
    up: migration_20260815_153039_initial.up,
    down: migration_20260815_153039_initial.down,
    name: '20260815_153039_initial',
  },
  {
    up: migration_20260815_172657_changelog.up,
    down: migration_20260815_172657_changelog.down,
    name: '20260815_172657_changelog',
  },
  {
    up: migration_20260908_131049_add_distro_verified.up,
    down: migration_20260908_131049_add_distro_verified.down,
    name: '20260908_131049_add_distro_verified',
  },
]
