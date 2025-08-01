---
description: How to customize your self-hosted deployment of Phoenix
---

# Configuration

## Ports

Phoenix is an all-in-one solution that has a tracing UI as well as a trace collector over both HTTP and gRPC.\
\
By default, the container exposes the following ports:

<table><thead><tr><th width="93">Port</th><th width="100">Protocol</th><th width="137">Endpoint</th><th width="193">Function</th><th>Env Var</th></tr></thead><tbody><tr><td>6006</td><td>HTTP</td><td><code>/</code></td><td>User interface (UI) of the web application.</td><td><code>PHOENIX_PORT</code></td></tr><tr><td>6006</td><td>HTTP</td><td><code>/v1/traces</code></td><td>Accepts traces in <a href="https://github.com/open-telemetry/opentelemetry-proto/blob/main/docs/specification.md">OpenTelemetry OTLP format </a> (Protobuf).</td><td><code>PHOENIX_PORT</code></td></tr><tr><td>4317</td><td>gRPC</td><td>n/a</td><td>Accepts traces in <a href="https://github.com/open-telemetry/opentelemetry-proto/blob/main/docs/specification.md">OpenTelemetry OTLP format </a> (Protobuf).</td><td><code>PHOENIX_GRPC_PORT</code></td></tr></tbody></table>

If the above ports need to be modified, consult the  section below.

## Environment Variables

Phoenix uses environment variables to control how data is sent, received, and stored. Here is the comprehensive list:

### Server Configuration

The following environment variables will control how your phoenix server runs.

* **PHOENIX\_PORT:** The port to run the phoenix web server. Defaults to 6006.
* **PHOENIX\_GRPC\_PORT:** The port to run the gRPC OTLP trace collector. Defaults to 4317.
* **PHOENIX\_HOST:** The host to run the phoenix server. Defaults to 0.0.0.0
* **PHOENIX\_HOST\_ROOT\_PATH:** The root path prefix for your application. If provided, allows Phoenix to run behind a reverse proxy at the specified subpath. See an example [here](https://github.com/Arize-ai/phoenix/tree/main/examples/reverse-proxy).
* **PHOENIX\_WORKING\_DIR:** The directory in which to save, load, and export data. This directory must be accessible by both the Phoenix server and the notebook environment. Defaults to `~/.phoenix/`
* **PHOENIX\_ALLOW\_EXTERNAL\_RESOURCES:** Controls whether external resources (such as Google Fonts) are loaded in the web interface. Defaults to `true`. Set to `false` in air-gapped environments to prevent external requests that can cause UI loading delays. Available since version 11.15.0.
* **PHOENIX\_SQL\_DATABASE\_URL:** The SQL database URL to use when logging traces and evals. if you plan on using SQLite, it's advised to to use a persistent volume and simply point the `PHOENIX_WORKING_DIR` to that volume. If URL is not specified, by default Phoenix starts with a file-based SQLite database in a temporary folder, the location of which will be shown at startup. Phoenix also supports PostgresSQL as shown below:
  * PostgreSQL, e.g. `postgresql://@host/dbname?user=user&password=password` or `postgresql://user:password@host/dbname`
  * SQLite, e.g. `sqlite:///path/to/database.db`
* **PHOENIX\_POSTGRES\_HOST:** As an alternative to setting **PHOENIX\_SQL\_DATABASE\_URL**, you can set the following environment variables to connect to a PostgreSQL database:
  * PHOENIX\_POSTGRES\_HOST
  * PHOENIX\_POSTGRES\_PORT
  * PHOENIX\_POSTGRES\_USER
  * PHOENIX\_POSTGRES\_PASSWORD
  * PHOENIX\_POSTGRES\_DB
* **PHOENIX\_POSTGRES\_PORT:** Used with **PHOENIX\_POSTGRES\_HOST** to specify the port to use for the PostgreSQL database.
* **PHOENIX\_POSTGRES\_USER:** Used with **PHOENIX\_POSTGRES\_HOST** to specify the user to use for the PostgreSQL database.
* **PHOENIX\_POSTGRES\_PASSWORD:** Used with **PHOENIX\_POSTGRES\_HOST** to specify the password to use for the PostgreSQL database.
* **PHOENIX\_POSTGRES\_DB:** Used with **PHOENIX\_POSTGRES\_HOST** to specify the database to use for the PostgreSQL database.
* **PHOENIX\_SQL\_DATABASE\_SCHEMA:** An optional string specifying the PostgreSQL [schema](https://www.postgresql.org/docs/current/ddl-schemas.html) for the database tables. Similar to folders, schemas help organize tables outside the default `public` schema. If the specified schema does not exist, it will be created. This option is ignored when using SQLite.
* **PHOENIX\_ENABLE\_PROMETHEUS:** Whether to enable Prometheus metrics at port 9090. Defaults to false.
* **PHOENIX\_SERVER\_INSTRUMENTATION\_OTLP\_TRACE\_COLLECTOR\_HTTP\_ENDPOINT:** Specifies an HTTP endpoint for the OTLP trace collector. Specifying this variable enables the OpenTelemetry tracer and exporter for the Phoenix server.
* **PHOENIX\_SERVER\_INSTRUMENTATION\_OTLP\_TRACE\_COLLECTOR\_GRPC\_ENDPOINT:** Specifies an gRPC endpoint for the OTLP trace collector. Specifying this variable enables the OpenTelemetry tracer and exporter for the Phoenix server.
* **PHOENIX\_CSRF\_TRUSTED\_ORIGINS:** A comma-separated list of origins allowed to bypass Cross-Site Request Forgery (CSRF) protection. This setting is recommended when configuring OAuth2 clients or sending password reset emails. If this variable is left unspecified or contains no origins, CSRF protection will not be enabled. In such cases, when a request includes `origin` or `referer` headers, those values will not be validated.
