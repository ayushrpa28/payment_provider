import { validateLuhn } from './luhn';

describe('validateLuhn', () => {
  it('should validate valid card', () => {
    expect(validateLuhn('4242424242424242')).toBe(true);
  });

  it('should reject invalid card', () => {
    expect(validateLuhn('1234567890123456')).toBe(false);
  });
});