import { beforeEach, describe, expect, it, vi } from 'vitest';
const { generate } = vi.hoisted(() => ({generate: vi.fn()}));
vi.mock('@google/genai', () => ({GoogleGenAI: class { models = {generateContent: generate}; }, Type: {OBJECT:'OBJECT',STRING:'STRING',ARRAY:'ARRAY'}}));
import { analyzeEmail, generateReply } from './geminiService';
beforeEach(() => { generate.mockReset(); });
describe('model failures remain failures', () => {
  for (const failure of ['401','403','429','timeout']) it(failure, async () => {
    generate.mockRejectedValue(new Error(failure));
    await expect(analyzeEmail('fake email','fake-key','fake-model')).rejects.toThrow();
    await expect(generateReply('fake email','','','fake-key','fake-model')).rejects.toThrow();
  });
  for (const text of ['', '{broken', '{"status":"READY"}', '{"status":"NEEDS_INFO","questions":[]}']) it(`rejects invalid analysis ${text}`, async () => {
    generate.mockResolvedValue({text});
    await expect(analyzeEmail('fake email','fake-key','fake-model')).rejects.toThrow();
  });
  it('rejects empty draft', async () => {
    generate.mockResolvedValue({text:' '});
    await expect(generateReply('fake email','','','fake-key','fake-model')).rejects.toThrow();
  });
  it('accepts valid analysis and draft', async () => {
    generate.mockResolvedValueOnce({text:'{"status":"READY","questions":[]}'}).mockResolvedValueOnce({text:'A draft'});
    expect((await analyzeEmail('fake','fake','fake')).status).toBe('READY');
    expect(await generateReply('fake','','','fake','fake')).toBe('A draft');
  });
  it('does not call the model without a personal key', async () => {
    await expect(analyzeEmail('fake','','fake')).rejects.toThrow();
    expect(generate).not.toHaveBeenCalled();
  });
});
