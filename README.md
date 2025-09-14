# opentelemetry-lgtm
OpenTelemetry instrumentation and LGTM observability stack.
----

## Getting started:

The first step is to get your application code instrumented with [opentelemetry](https://opentelemetry.io) and sending its metrics, traces and logs to the opentelemetry [collector](https://opentelemetry.io/docs/collector).

```javascript
// ./instrumentation.js
const OpenTelemetry = require('opentelemetry-lgtm');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');

OpenTelemetry(
	'my-app:1.0.0',
	{
		exporters: {
			metrics: [
				new OTLPMetricExporter({ url: `http://localhost:4318/v1/metrics` })
			],
			traces: [
				new OTLPTraceExporter({ url: `http://localhost:4318/v1/traces` })
			],
			logs: [
				new OTLPLogExporter({ url: `http://localhost:4318/v1/logs` })
			]
		}
	}
).start();
```

Then you can run your node application preloading the instrumentation file like bellow:

```bash
node -r ./instrumentation.js my-app.js
```

You can use other available [exporters](https://opentelemetry.io/docs/languages/js/exporters), just remember to `npm install` them to your project first.

## Infrastructure setup:

After your code is instrumented, the next step is to spin up the opentelemetry [collector](https://opentelemetry.io/docs/collector) and the LGTM ([Loki](https://grafana.com/oss/loki), [Grafana](https://grafana.com/oss/grafana), [Tempo](https://grafana.com/oss/tempo) and [Mimir](https://grafana.com/oss/mimir)) stack.

This setup is already configured for you for local development, so you can quickly get started just running:

```bash
docker compose up -d
```

All configuration files are available in the `lgtm/configs` folder. Feel free to change them as needed to match your deployment needs.

All LGTM data is stored in the `lgtm/data` folder and it can be changed in the `docker-compose.yml` file.

If you need further instructions for configuring your deployment, refer to the examples provided in the grafana's [intro-to-mltp](https://github.com/grafana/intro-to-mltp) repository or the official documentations from [grafana labs](https://grafana.com).
