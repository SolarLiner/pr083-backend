import { registerAs } from '@nestjs/config';
import { ensure } from '@pr083/rest-utils';

export default registerAs('jwt', () => ({
  secret: ensure(process.env.SECRET_KEY),
  signOptions: { expiresIn: '5m' },
}));
