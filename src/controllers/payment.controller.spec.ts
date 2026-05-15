import { PaymentController } from './payment.controller';
import { PaymentService } from '../services/payment.service';

describe('PaymentController', () => {

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return payment success response', async () => {

    const mockRequest: any = {
      body: {
        token: 'token123',
        amount: 100,
      },
      userId: 'user123',
    };

    jest.spyOn(PaymentService, 'makePayment')
      .mockResolvedValue({
        message: 'Payment successful',
        payment: {
          status: 'AUTHORIZED',
        },
      } as any);

    await PaymentController.makePayment(
      mockRequest,
      mockResponse
    );

    expect(mockResponse.status)
      .toHaveBeenCalledWith(201);

    expect(mockResponse.json)
      .toHaveBeenCalled();
  });

  it('should handle errors', async () => {

    const mockRequest: any = {
      body: {
        token: 'wrong',
        amount: 100,
      },
      userId: 'user123',
    };

    jest.spyOn(PaymentService, 'makePayment')
      .mockRejectedValue(
        new Error('Card not found')
      );

    await PaymentController.makePayment(
      mockRequest,
      mockResponse
    );

    expect(mockResponse.status)
      .toHaveBeenCalledWith(400);

    expect(mockResponse.json)
      .toHaveBeenCalledWith({
        message: 'Card not found',
      });
  });
});