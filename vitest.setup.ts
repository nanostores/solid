import { expect } from 'vitest';

// @ts-expect-error: Fix this later
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
