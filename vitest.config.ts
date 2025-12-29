import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true, // describe, it, expect 등을 import 없이 사용
    environment: 'node', // Use Case는 브라우저 환경이 필요 없으므로 node로 설정
  },
});
