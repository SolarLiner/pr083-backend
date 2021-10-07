import { AccessLogInterceptor } from './access-log.interceptor';

describe('AccessLogInterceptor', () => {
  it('should be defined', () => {
    expect(new AccessLogInterceptor()).toBeDefined();
  });
});
