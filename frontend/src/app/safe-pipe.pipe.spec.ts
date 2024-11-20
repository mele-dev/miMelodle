import { SafePipePipe } from './pipes/safe.pipe';

describe('SafePipePipe', () => {
  it('create an instance', () => {
    const pipe = new SafePipePipe();
    expect(pipe).toBeTruthy();
  });
});
