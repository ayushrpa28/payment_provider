import { PaymentService } from './payment.service';
import { prisma } from '../prisma/client';

jest.mock('../prisma/client', () => ({
  prisma: {
    card: {
      findFirst: jest.fn(),
    },
    payment: {
      create: jest.fn(),
    },
  },
}));

describe('PaymentService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make successful payment', async () => {

    (prisma.card.findFirst as jest.Mock)
      .mockResolvedValue({
        id: 'card123',
      });

    (prisma.payment.create as jest.Mock)
      .mockResolvedValue({
        id: 'payment123',
        status: 'AUTHORIZED',
      });

    jest.spyOn(Math, 'random')
      .mockReturnValue(0.5);

    const result =
      await PaymentService.makePayment(
        'user123',
        'token123',
        100
      );

    expect(result.message)
      .toBe('Payment successful');

    expect(result.payment.status)
      .toBe('AUTHORIZED');
  });

  it('should fail if card not found', async () => {

    (prisma.card.findFirst as jest.Mock)
      .mockResolvedValue(null);

    await expect(
      PaymentService.makePayment(
        'user123',
        'wrong-token',
        100
      )
    ).rejects.toThrow('Card not found');
  });

  it('should fail payment when bank fails', async () => {

    (prisma.card.findFirst as jest.Mock)
      .mockResolvedValue({
        id: 'card123',
      });

    (prisma.payment.create as jest.Mock)
      .mockResolvedValue({
        id: 'payment123',
        status: 'FAILED',
      });

    jest.spyOn(Math, 'random')
      .mockReturnValue(0.95);

    const result =
      await PaymentService.makePayment(
        'user123',
        'token123',
        100
      );

    expect(result.message)
      .toBe('Payment failed');

    expect(result.payment.status)
      .toBe('FAILED');
  });
});