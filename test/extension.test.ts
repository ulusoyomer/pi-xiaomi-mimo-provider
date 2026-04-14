import { describe, expect, it, vi } from 'vitest';
import extension from '../index.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */

function createMockPi() {
	return {
		registerProvider: vi.fn(),
		unregisterProvider: vi.fn(),
		registerTool: vi.fn(),
		exec: vi.fn(),
		on: vi.fn(),
		registerCommand: vi.fn(),
	} as any;
}

describe('xiaomi-mimo provider extension', () => {
	it('registers the xiaomi-mimo provider', () => {
		const pi = createMockPi();
		extension(pi);

		expect(pi.registerProvider).toHaveBeenCalledTimes(1);
		expect(pi.registerProvider).toHaveBeenCalledWith('xiaomi-mimo', expect.any(Object));
	});

	it('uses the correct base URL and API type', () => {
		const pi = createMockPi();
		extension(pi);

		const config = pi.registerProvider.mock.calls[0][1] as any;
		expect(config.baseUrl).toBe('https://token-plan-sgp.xiaomimimo.com/v1');
		expect(config.api).toBe('openai-completions');
	});

	it('registers exactly 3 models', () => {
		const pi = createMockPi();
		extension(pi);

		const config = pi.registerProvider.mock.calls[0][1] as any;
		expect(config.models).toHaveLength(3);
	});

	it('registers mimo-v2-pro with correct properties', () => {
		const pi = createMockPi();
		extension(pi);

		const config = pi.registerProvider.mock.calls[0][1] as any;
		const pro = config.models.find((m: any) => m.id === 'mimo-v2-pro');

		expect(pro).toBeDefined();
		expect(pro.name).toBe('MiMo V2 Pro');
		expect(pro.reasoning).toBe(true);
		expect(pro.input).toEqual(['text', 'image']);
		expect(pro.contextWindow).toBe(1_048_576);
		expect(pro.cost).toEqual({ input: 1.0, output: 3.0, cacheRead: 0.2, cacheWrite: 0 });
	});

	it('registers mimo-v2-omni with correct properties', () => {
		const pi = createMockPi();
		extension(pi);

		const config = pi.registerProvider.mock.calls[0][1] as any;
		const omni = config.models.find((m: any) => m.id === 'mimo-v2-omni');

		expect(omni).toBeDefined();
		expect(omni.name).toBe('MiMo V2 Omni');
		expect(omni.reasoning).toBe(true);
		expect(omni.input).toEqual(['text', 'image']);
		expect(omni.contextWindow).toBe(1_048_576);
		expect(omni.cost).toEqual({ input: 1.0, output: 3.0, cacheRead: 0.2, cacheWrite: 0 });
	});

	it('registers mimo-v2-tts with correct properties', () => {
		const pi = createMockPi();
		extension(pi);

		const config = pi.registerProvider.mock.calls[0][1] as any;
		const tts = config.models.find((m: any) => m.id === 'mimo-v2-tts');

		expect(tts).toBeDefined();
		expect(tts.name).toBe('MiMo V2 TTS');
		expect(tts.reasoning).toBe(false);
		expect(tts.input).toEqual(['text']);
		expect(tts.contextWindow).toBe(1_048_576);
		expect(tts.cost).toEqual({ input: 0, output: 0, cacheRead: 0, cacheWrite: 0 });
	});

	it('all model IDs are unique', () => {
		const pi = createMockPi();
		extension(pi);

		const config = pi.registerProvider.mock.calls[0][1] as any;
		const ids = config.models.map((m: any) => m.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	describe('reasoning compat', () => {
		it('mimo-v2-pro has reasoning effort compat enabled', () => {
			const pi = createMockPi();
			extension(pi);

			const config = pi.registerProvider.mock.calls[0][1] as any;
			const pro = config.models.find((m: any) => m.id === 'mimo-v2-pro');

			expect(pro.compat.supportsReasoningEffort).toBe(true);
			expect(pro.compat.reasoningEffortMap).toEqual({
				off: 'none',
				minimal: 'none',
				low: 'low',
				medium: 'medium',
				high: 'high',
			});
		});

		it('mimo-v2-omni has reasoning effort compat enabled', () => {
			const pi = createMockPi();
			extension(pi);

			const config = pi.registerProvider.mock.calls[0][1] as any;
			const omni = config.models.find((m: any) => m.id === 'mimo-v2-omni');

			expect(omni.compat.supportsReasoningEffort).toBe(true);
			expect(omni.compat.reasoningEffortMap).toEqual({
				off: 'none',
				minimal: 'none',
				low: 'low',
				medium: 'medium',
				high: 'high',
			});
		});

		it('mimo-v2-tts has no compat settings', () => {
			const pi = createMockPi();
			extension(pi);

			const config = pi.registerProvider.mock.calls[0][1] as any;
			const tts = config.models.find((m: any) => m.id === 'mimo-v2-tts');

			expect(tts.compat).toBeUndefined();
		});
	});

	describe('OAuth', () => {
		it('has oauth config with correct name', () => {
			const pi = createMockPi();
			extension(pi);

			const config = pi.registerProvider.mock.calls[0][1] as any;
			expect(config.oauth).toBeDefined();
			expect(config.oauth.name).toBe('Xiaomi Mimo');
		});

		it('login prompts for API key and returns credentials', async () => {
			const pi = createMockPi();
			extension(pi);

			const config = pi.registerProvider.mock.calls[0][1] as any;
			const onPrompt = vi.fn().mockResolvedValue('  test-api-key  ');
			const callbacks = { onPrompt, onAuth: vi.fn(), onDeviceCode: vi.fn() };

			const credentials = await config.oauth.login(callbacks);

			expect(onPrompt).toHaveBeenCalledWith({
				message: 'Enter your Xiaomi Mimo API key:',
			});
			expect(credentials).toEqual({
				access: 'test-api-key',
				refresh: '',
				expires: expect.any(Number),
			});
			// Expires ~1 year from now
			const oneYear = 365 * 24 * 60 * 60 * 1000;
			expect(credentials.expires).toBeGreaterThan(Date.now() + oneYear - 5000);
			expect(credentials.expires).toBeLessThan(Date.now() + oneYear + 5000);
		});

		it('refreshToken returns the same credentials', async () => {
			const pi = createMockPi();
			extension(pi);

			const config = pi.registerProvider.mock.calls[0][1] as any;
			const creds = { access: 'key', refresh: '', expires: Date.now() };

			const result = await config.oauth.refreshToken(creds);
			expect(result).toBe(creds);
		});

		it('getApiKey returns the access token', () => {
			const pi = createMockPi();
			extension(pi);

			const config = pi.registerProvider.mock.calls[0][1] as any;
			const creds = { access: 'my-key', refresh: '', expires: Date.now() };

			expect(config.oauth.getApiKey(creds)).toBe('my-key');
		});
	});
});
