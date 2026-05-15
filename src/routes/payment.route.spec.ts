import request from 'supertest';
import express from 'express';
import paymentRoutes from './payment.route';

const app = express();

app.use(express.json());
app.use('/payments', paymentRoutes);

describe('POST /payments', () => {

  it('should return 401 without auth', async () => {

    const response = await request(app)
      .post('/payments')
      .send({
        token: 'token123',
        amount: 100,
      });

    expect(response.status)
      .toBe(401);
  });
});