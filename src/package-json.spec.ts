import { PackageJson } from './package-json';

describe('PackageJson', () => {
  it('should be defined', () => {
    expect(new PackageJson()).toBeDefined();
  });
});
