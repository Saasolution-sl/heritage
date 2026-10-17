import next from 'eslint-config-next';

const config = [
  ...next,
  { ignores: ['out/**', '.next/**', 'public/**', 'docs/brand/reference-kit-v1/**', 'test-results/**', 'playwright-report/**'] },
];

export default config;
