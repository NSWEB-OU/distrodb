import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    // Payload's default unlock access is `Boolean(user)`, letting any authenticated
    // user reset any other account's lockout (GHSA-jg8r-5jh2-v2xj / CVE-2026-11779,
    // unpatched upstream as of payload@3.89.0). Disable it; locked accounts just
    // wait out the default lockout window instead.
    unlock: () => false,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
