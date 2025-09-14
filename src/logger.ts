import { LoggerProvider, LoggerProviderConfig } from '@opentelemetry/sdk-logs';
import { LogRecord } from '@opentelemetry/api-logs';
import {
	resourceFromAttributes,
	defaultResource
} from '@opentelemetry/resources';

export { logs } from '@opentelemetry/api-logs';

export enum LogMethods {
	LOG = 'log',
	DEBUG = 'debug',
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error'
}

export const LogLevels: Record<LogMethods, LogRecord> = Object.freeze({
	[LogMethods.LOG]: {
		severityNumber: 5,
		severityText: 'DEBUG'
	},
	[LogMethods.DEBUG]: {
		severityNumber: 5,
		severityText: 'DEBUG'
	},
	[LogMethods.INFO]: {
		severityNumber: 9,
		severityText: 'INFO'
	},
	[LogMethods.WARN]: {
		severityNumber: 13,
		severityText: 'WARNING'
	},
	[LogMethods.ERROR]: {
		severityNumber: 17,
		severityText: 'ERROR'
	}
});

function logger<T extends LoggerProviderConfig>(
	service: string,
	config?: Partial<T>
) {
	if (logger._provider) return logger._provider;

	const [name, version] = service.split(':');

	const provider = new LoggerProvider({
		resource: defaultResource().merge(
			resourceFromAttributes({
				'service.name': name,
				'service.version': version
			})
		),
		...config
	});

	return (logger._provider = provider);
}

namespace logger {
	export let _provider: LoggerProvider | undefined;
}

export default logger;
