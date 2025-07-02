import { createLogger } from '../src/core/create-logger.js';
import { LogLevel } from '../src/index.js';
import { definePlugin } from '../src/plugin/define-plugin.js';
import { sleep } from './test-utils.js';

describe('Logger Context Setup', () => {
  it('should merge context with setup function result', async () => {
    const executeMock = vi.fn(({ _ctx, _priority, _message }) => {});

    const consolePlugin = definePlugin({
      pluginName: 'consolePlugin',
      execute: executeMock,
    });

    type NewLoggerContext = {
      env: 'node' | 'browser';
    };

    const logger = createLogger<NewLoggerContext>({
      thresholdLevel: LogLevel.Verbose,
      name: 'sampleLogger',
      env: 'node',
      setup: () => {
        return {
          platform: 'android',
          agent: 'chrome 123',
          env: 'node',
        };
      },
    })
      .use(consolePlugin)
      .build();

    logger.info('info message');
    await sleep(100);

    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(executeMock.mock.calls[0][0].ctx).toMatchObject({
      platform: 'android',
      agent: 'chrome 123',
      env: 'node',
    });
  });

  it('should merge context with async setup function result', async () => {
    const executeMock = vi.fn(({ _ctx, _priority, _message }) => {});

    type NewLoggerContext = {
      env: 'node' | 'browser';
      platform?: 'android' | 'ios';
      agent?: string;
    };

    const consolePlugin = definePlugin<NewLoggerContext>({
      pluginName: 'consolePlugin',
      execute: ({ ctx, level, message }) => {
        executeMock({ ctx, level, message });
      },
    });

    const logger = createLogger<NewLoggerContext>({
      thresholdLevel: LogLevel.Verbose,
      name: 'sampleLogger',
      env: 'node',
      setup: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              platform: 'ios',
              agent: 'chrome 456',
              env: 'browser',
            });
          }, 100);
        });
      },
    })
      .use(consolePlugin)
      .build();

    logger.info('info message');

    await sleep(100);

    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(executeMock.mock.calls[0][0].ctx).toMatchObject({
      platform: 'ios',
      agent: 'chrome 456',
      env: 'browser',
    });
  });
});
