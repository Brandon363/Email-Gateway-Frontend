import { NullDisplayPipe } from './null-display.pipe';

describe('NullDisplayPipe', () => {
  it('create an instance', () => {
    const pipe = new NullDisplayPipe();
    expect(pipe).toBeTruthy();
  });
});
