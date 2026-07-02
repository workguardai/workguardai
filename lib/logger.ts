/**
 * Structured logger with correlation IDs.
 *
 * Responsibility: Emit single-line JSON logs to stdout/stderr so they are
 * machine-parseable in production. Never use `console.log` in application paths.
 *
 * Inputs:  a log level, message, and optional structured context.
 * Outputs: a JSON line per log record.
 *
 * Extension point: `createLogger(bindings)` returns a child logger whose
 * bindings (e.g. `{ correlationId, userId }`) are merged into every record.
 * Swap the transport (`write`) to ship logs elsewhere without touching callers.
 */
import { env } from '@/lib/env';

export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export type LogContext = Record<string, unknown>;

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  /** Returns a new logger that merges `bindings` into every record. */
  child(bindings: LogContext): Logger;
}

const minWeight = LEVEL_WEIGHT[env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO];

function write(level: LogLevel, message: string, bindings: LogContext, context?: LogContext): void {
  if (LEVEL_WEIGHT[level] < minWeight) return;

  const record = {
    level,
    time: new Date().toISOString(),
    message,
    ...bindings,
    ...context,
  };

  const line = `${JSON.stringify(record)}\n`;
  if (level === LogLevel.ERROR) {
    process.stderr.write(line);
  } else {
    process.stdout.write(line);
  }
}

export function createLogger(bindings: LogContext = {}): Logger {
  return {
    debug: (message, context) => write(LogLevel.DEBUG, message, bindings, context),
    info: (message, context) => write(LogLevel.INFO, message, bindings, context),
    warn: (message, context) => write(LogLevel.WARN, message, bindings, context),
    error: (message, context) => write(LogLevel.ERROR, message, bindings, context),
    child: (childBindings) => createLogger({ ...bindings, ...childBindings }),
  };
}

/** Root logger. Prefer request-scoped child loggers with a correlation ID. */
export const logger = createLogger({ service: 'workguard-api' });
