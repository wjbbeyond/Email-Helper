// @vitest-environment jsdom
import React from 'react';
import { expect, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
const { analyze } = vi.hoisted(() => ({analyze:vi.fn()}));
vi.mock('./services/geminiService', () => ({analyzeEmail:analyze,generateReply:vi.fn()}));
import App from './App';
it('keeps input and original step after a failed analysis', async () => {
 localStorage.setItem('sr_api_key','fake-legacy-key');
 analyze.mockRejectedValue(new Error('fake rate limit'));
 const {getByRole}=render(<App/>);
 fireEvent.change(getByRole('textbox'),{target:{value:'Fake customer email'}});
 const next=getByRole('button',{name:'下一步'});
 fireEvent.click(next);fireEvent.click(next);
 await waitFor(() => expect(getByRole('alert').textContent).toContain('分析失败'));
 expect(analyze).toHaveBeenCalledTimes(1);
 expect((getByRole('textbox') as HTMLTextAreaElement).value).toBe('Fake customer email');
 expect(localStorage.getItem('sr_api_key')).toBeNull();
});
