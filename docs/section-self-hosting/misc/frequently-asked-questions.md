## FAQs

### Permission denied writing to disc

Some phoenix containers run as nonroot and therefore must be granted explicit write permissions to the mounted disc (see [https://kubernetes.io/docs/tasks/configure-pod-container/security-context/](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)). Phoenix 4.1.3 and above run as root by default to avoid this. However there are `debug` and `nonroot` variants of the image as well.

### How do I configure Phoenix for air-gapped deployments?

For air-gapped environments where external network access is restricted, you should disable external resource loading to improve UI performance. This prevents Phoenix from attempting to load external resources like Google Fonts, which can cause UI loading delays (10-20 seconds) in environments without internet access.

Set the `PHOENIX_ALLOW_EXTERNAL_RESOURCES` environment variable to `false`:

**Docker Example:**
```yaml
services:
  phoenix:
    image: arizephoenix/phoenix:latest # Must be version 11.15.0 or later
    ports:
      - 6006:6006
      - 4317:4317
    environment:
      - PHOENIX_ALLOW_EXTERNAL_RESOURCES=false
```

**Environment Variable:**
```bash
export PHOENIX_ALLOW_EXTERNAL_RESOURCES=false
```

{% hint style="info" %}
The `PHOENIX_ALLOW_EXTERNAL_RESOURCES` environment variable was added in Phoenix version 11.15.0. It defaults to `true` and only needs to be set to `false` in air-gapped deployments where external network access is not available.
{% endhint %}