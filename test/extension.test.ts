import { describe, expect, it, vi, afterEach } from 'vitest';
import extension from '../index.ts';

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
	afterEach(() => {
		delete process.env.XIAOMI_MIMO_CONTEXT_WINDOW;
	});

	it('registers the xiaomi-mimo provider', () => {
		const pi = createMockPi();
		extension(pi);

		expect(pi.registerProvider).toHaveBeenCalled();
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

	it('defaults context window to 128K (131072)', () => {
		const pi = createMockPi();
		extension(pi);

		const config = pi.registerProvider.mock.calls[0][1] as any;
		for (const model of config.models) {
			expect(model.contextWindow).toBe(131072);
		}
	});

	it('reads context window from XIAOMI_MIMO_CONTEXT_WINDOW env var', () => {
		process.env.XIAOMI_MIMO_CONTEXT_WINDOW = '256k';
		const pi = createMockPi();
		extension(pi);

		const config = pi.registerProvider.mock.calls[0][1] as any;
		for (const model of config.models) {
			expect(model.contextWindow).toBe(262144); // 256 * 1024
		}
	});

	it('supports 1m context window from env var', () => {
		process.env.XIAOMI_MIMO_CONTEXT_WINDOW = '1m';
		const pi = createMockPi();
		extension(pi);

		const config = pi.registerProvider.mock.calls[0][1] as any;
		for (const model of config.models) {
			expect(model.contextWindow).toBe(1048576);
		}
	});

	it('supports numeric context window from env var', () => {
		process.env.XIAOMI_MIMO_CONTEXT_WINDOW = '524288';
		const pi = createMockPi();
		extension(pi);

		const config = pi.registerProvider.mock.calls[0][1] as any;
		for (const model of config.models) {
			expect(model.contextWindow).toBe(524288);
		}
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

	describe('/mimo-context command', () => {
		it('registers the mimo-context command', () => {
			const pi = createMockPi();
			extension(pi);

			expect(pi.registerCommand).toHaveBeenCalledWith('mimo-context', expect.any(Object));
		});

		it('shows current context window when called without args', async () => {
			const pi = createMockPi();
			extension(pi);

			const cmd = pi.registerCommand.mock.calls.find(
				(c: any) => c[0] === 'mimo-context'
			)?.[1] as any;

			const notify = vi.fn();
			await cmd.handler('', { ui: { notify } });

			expect(notify).toHaveBeenCalledWith(
				expect.stringContaining('131072'),
				'info',
			);
		});

		it('updates context window with valid size', async () => {
			const pi = createMockPi();
			extension(pi);

			const cmd = pi.registerCommand.mock.calls.find(
				(c: any) => c[0] === 'mimo-context'
			)?.[1] as any;

			const notify = vi.fn();
			await cmd.handler('256k', { ui: { notify } });

			// Provider should be re-registered with new context window
			const lastCall = pi.registerProvider.mock.calls[pi.registerProvider.mock.calls.length - 1];
			const config = lastCall[1] as any;
			for (const model of config.models) {
				expect(model.contextWindow).toBe(262144); // 256 * 1024
			}
			expect(notify).toHaveBeenCalledWith(
				expect.stringContaining('262144'),
				'info',
			);
		});

		it('rejects invalid size', async () => {
			const pi = createMockPi();
			extension(pi);

			const cmd = pi.registerCommand.mock.calls.find(
				(c: any) => c[0] === 'mimo-context'
			)?.[1] as any;

			const notify = vi.fn();
			await cmd.handler('abc', { ui: { notify } });

			expect(notify).toHaveBeenCalledWith(
				expect.stringContaining('Invalid'),
				'error',
			);
		});

		it('rejects size exceeding max (1M)', async () => {
			const pi = createMockPi();
			extension(pi);

			const cmd = pi.registerCommand.mock.calls.find(
				(c: any) => c[0] === 'mimo-context'
			)?.[1] as any;

			const notify = vi.fn();
			await cmd.handler('2m', { ui: { notify } });

			expect(notify).toHaveBeenCalledWith(
				expect.stringContaining('Invalid'),
				'error',
			);
		});
	});
});
