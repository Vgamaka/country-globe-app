//  Enable helpful matchers from React Testing Library
import '@testing-library/jest-dom';

//  Suppress React Router v7 future deprecation warnings during test runs
process.env.REACT_ROUTER_FUTURE_V7_START_TRANSITION = 'true';
process.env.REACT_ROUTER_FUTURE_V7_RELATIVE_SPLAT_PATH = 'true';

// Optional: Silence console.warn messages in test output (optional, clean output)
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      message.includes('React Router Future Flag Warning')
    ) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
