import { NodeSDK, NodeSDKConfiguration } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
	resourceFromAttributes,
	defaultResource
} from '@opentelemetry/resources';
import {
	BatchSpanProcessor,
	SpanExporter
} from '@opentelemetry/sdk-trace-node';
import {
	BatchLogRecordProcessor,
	LogRecordExporter
} from '@opentelemetry/sdk-logs';
import {
	PeriodicExportingMetricReader,
	PushMetricExporter
} from '@opentelemetry/sdk-metrics';
import logger, { LogLevels, LogMethods, logs } from './logger';

interface Configuration extends NodeSDKConfiguration {
	exporters: Exporters;
}

interface Exporters {
	metrics?: PushMetricExporter[];
	traces?: SpanExporter[];
	logs?: LogRecordExporter[];
}

function sdk<T extends Configuration>(
	service: string,
	options: Partial<T> = {}
): { start(): void } {
	if (sdk._instance) return sdk._instance;

	const [name, version] = service.split(':');
	const { exporters, ...config } = options;

	const metricProcessors = exporters?.metrics?.map(
		(exporter) => new PeriodicExportingMetricReader({ exporter })
	);
	const spanProcessors = exporters?.traces?.map(
		(exporter) => new BatchSpanProcessor(exporter)
	);
	const logProcessors = exporters?.logs?.map(
		(exporter) => new BatchLogRecordProcessor(exporter)
	);

	const logProvider = logger(service, { processors: logProcessors });

	logs.setGlobalLoggerProvider(logProvider);

	const log = logs.getLogger(name, version, {
		includeTraceContext: true
	});

	for (const level of Object.values(LogMethods)) {
		const original = console?.[level];

		Object.defineProperty(console, level, {
			configurable: true,
			enumerable: true,
			writable: false,
			value: (...args: any[]) => {
				log.emit({ ...LogLevels[level], body: args.join(' ') });
				return original?.apply(console, args);
			}
		});
	}

	const instance = new NodeSDK({
		resource: defaultResource().merge(
			resourceFromAttributes({
				'service.name': name,
				'service.version': version
			})
		),
		instrumentations: [getNodeAutoInstrumentations()],
		metricReaders: metricProcessors,
		spanProcessors: spanProcessors,
		logRecordProcessors: logProcessors,
		...config
	});

	return (sdk._instance = instance);
}

namespace sdk {
	export let _instance: NodeSDK | undefined;
}

export default sdk;
