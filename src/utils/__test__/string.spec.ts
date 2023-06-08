import { capitalize, assertMatch } from '../string';

describe('capitalize', () => {
  it.each([
    'charles',
    'CHARLES',
    'CharLEs',
    'cHArles',
    'Charles'
  ])('capitalizes the first character - from %s to Charles', (value) => {
    const result = capitalize(value);

    expect(result).toEqual('Charles');
  });
});

describe('assertMatch', () => {
  it('does not throw when 2 strings match', () => {
    const value1 = 'vjnaskjnalkjfnljnlfjba';
    const value2 = 'vjnaskjnalkjfnljnlfjba';

    expect(() => { assertMatch(value1, value2); }).not.toThrow();
  });

  it('does not throw when 2 strings match', () => {
    const value1 = 'vjnaskjnalkjfnljnlfjba';
    const value2 = 'vjnaskjnalkjfmljnlfjba';

    expect(() => { assertMatch(value1, value2); }).toThrow('Strings do not match');
  });
});
