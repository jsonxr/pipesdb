const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const module = isNode ? await import('./rng.node.js') : await import('./rng.browser.js');

export const rng = module.default;
