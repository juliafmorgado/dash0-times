// Fake articles about observability and OpenTelemetry for demo purposes

export const articles = [
  {
    id: "1",
    title: "Getting Started with OpenTelemetry: A Complete Guide",
    excerpt: "Learn the fundamentals of OpenTelemetry and how to implement distributed tracing in your applications for better observability.",
    body: `OpenTelemetry is an open-source observability framework that provides a single set of APIs, libraries, agents, and collector services to capture distributed traces and metrics from your application. It's designed to make observability a built-in feature of cloud-native software.

The framework consists of several key components:
- **APIs and SDKs**: Language-specific implementations for instrumenting applications
- **Collector**: A vendor-agnostic way to receive, process, and export telemetry data
- **Semantic Conventions**: Standard naming schemes for telemetry data

Getting started with OpenTelemetry involves three main steps:
1. Install the appropriate SDK for your programming language
2. Configure instrumentation to capture traces, metrics, and logs
3. Set up exporters to send data to your observability backend

The beauty of OpenTelemetry lies in its vendor neutrality - you can switch between different observability platforms without changing your instrumentation code.`,
    tags: ["opentelemetry", "observability", "tracing", "getting-started"],
    publishedAt: "2026-01-15T10:00:00Z",
    author: "Sarah Chen"
  },
  {
    id: "2",
    title: "Distributed Tracing Best Practices for Microservices",
    excerpt: "Discover essential patterns and practices for implementing effective distributed tracing across complex microservice architectures.",
    body: `Distributed tracing is crucial for understanding request flows in microservice architectures. Here are the key best practices:

**Trace Context Propagation**
Always propagate trace context across service boundaries. Use standard headers like W3C Trace Context to ensure compatibility.

**Sampling Strategies**
Implement intelligent sampling to balance observability with performance:
- Head-based sampling for predictable overhead
- Tail-based sampling for error-focused collection
- Adaptive sampling based on service load

**Span Design Principles**
- Create spans for meaningful operations
- Include relevant attributes and tags
- Use consistent naming conventions
- Avoid overly granular spans that create noise

**Error Handling**
Properly mark spans with error status and include error details in span attributes for effective debugging.`,
    tags: ["distributed-tracing", "microservices", "best-practices", "architecture"],
    publishedAt: "2026-01-12T14:30:00Z",
    author: "Marcus Rodriguez"
  },
  {
    id: "3",
    title: "Metrics vs Logs vs Traces: Understanding the Three Pillars",
    excerpt: "A comprehensive comparison of the three pillars of observability and when to use each type of telemetry data.",
    body: `The three pillars of observability each serve distinct purposes in understanding system behavior:

**Metrics**
Numerical measurements over time intervals. Perfect for:
- Monitoring system health and performance
- Setting up alerts and SLOs
- Capacity planning and trend analysis
- Real-time dashboards

**Logs**
Discrete events with timestamps and context. Ideal for:
- Debugging specific issues
- Audit trails and compliance
- Understanding business logic flow
- Root cause analysis

**Traces**
Request journey across distributed systems. Essential for:
- Understanding request latency
- Identifying bottlenecks in distributed systems
- Debugging cross-service issues
- Performance optimization

The key is using all three together - metrics for monitoring, logs for debugging, and traces for understanding distributed request flows.`,
    tags: ["observability", "metrics", "logs", "traces", "monitoring"],
    publishedAt: "2026-01-10T09:15:00Z",
    author: "Dr. Emily Watson"
  },
  {
    id: "4",
    title: "Building Custom OpenTelemetry Instrumentation",
    excerpt: "Learn how to create custom instrumentation libraries and auto-instrumentation for your specific use cases and frameworks.",
    body: `While OpenTelemetry provides extensive auto-instrumentation, sometimes you need custom solutions:

**Manual Instrumentation**
Create spans manually for business-critical operations:
\`\`\`javascript
const span = tracer.startSpan('user-checkout');
span.setAttributes({
  'user.id': userId,
  'order.total': orderTotal
});
// ... business logic
span.end();
\`\`\`

**Custom Instrumentation Libraries**
Build reusable instrumentation for internal frameworks:
- Extend existing instrumentations
- Follow semantic conventions
- Provide configuration options
- Handle errors gracefully

**Auto-instrumentation Patterns**
Use monkey-patching and hooks to automatically instrument:
- Database queries
- HTTP requests
- Message queue operations
- Custom business operations

Remember to follow OpenTelemetry's semantic conventions and contribute back to the community when possible.`,
    tags: ["opentelemetry", "instrumentation", "custom", "development"],
    publishedAt: "2026-01-08T16:45:00Z",
    author: "Alex Kim"
  },
  {
    id: "5",
    title: "Observability-Driven Development: A New Paradigm",
    excerpt: "Explore how integrating observability from the start of development cycles leads to more reliable and maintainable systems.",
    body: `Observability-Driven Development (ODD) shifts observability from an afterthought to a first-class concern:

**Design Phase**
- Define SLIs and SLOs upfront
- Plan instrumentation alongside features
- Consider observability in architecture decisions

**Development Phase**
- Write instrumentation code alongside business logic
- Use observability data for local debugging
- Test instrumentation in development environments

**Testing Phase**
- Validate telemetry data quality
- Test alert conditions and runbooks
- Ensure observability works under load

**Production Benefits**
- Faster incident resolution
- Proactive issue detection
- Better understanding of user experience
- Data-driven optimization decisions

ODD requires cultural change but pays dividends in system reliability and developer productivity.`,
    tags: ["observability", "development", "methodology", "culture"],
    publishedAt: "2026-01-05T11:20:00Z",
    author: "Jennifer Park"
  }
];

// Add more articles to reach 30-50 total
const additionalArticles = [
  {
    id: "6",
    title: "Prometheus vs OpenTelemetry Metrics: Making the Right Choice",
    excerpt: "Compare Prometheus and OpenTelemetry metrics collection approaches to choose the best fit for your infrastructure.",
    body: `Both Prometheus and OpenTelemetry offer powerful metrics solutions, but they serve different needs:

**Prometheus Strengths**
- Pull-based model with service discovery
- Powerful query language (PromQL)
- Built-in alerting with Alertmanager
- Mature ecosystem and tooling

**OpenTelemetry Metrics Advantages**
- Vendor-neutral approach
- Push and pull model support
- Unified observability stack
- Better for cloud-native environments

**When to Choose Prometheus**
- Kubernetes-native environments
- Need for complex queries and alerting
- Existing Prometheus infrastructure

**When to Choose OpenTelemetry**
- Multi-vendor observability strategy
- Need for traces and metrics correlation
- Cloud-native, distributed architectures

The choice often depends on your existing infrastructure and long-term observability strategy.`,
    tags: ["prometheus", "opentelemetry", "metrics", "comparison"],
    publishedAt: "2026-01-03T13:10:00Z",
    author: "David Thompson"
  },
  {
    id: "7",
    title: "Implementing SLOs with OpenTelemetry Data",
    excerpt: "Learn how to define, measure, and alert on Service Level Objectives using telemetry data from OpenTelemetry.",
    body: `Service Level Objectives (SLOs) are crucial for maintaining reliable services. Here's how to implement them with OpenTelemetry:

**Defining SLIs from Telemetry**
- Latency: Use trace data for request duration
- Availability: Calculate from HTTP status codes
- Throughput: Derive from request metrics
- Error Rate: Track from span error status

**SLO Implementation Strategy**
1. Start with user-facing services
2. Use the 99.9% availability rule as baseline
3. Set error budgets based on business needs
4. Implement gradual rollout of SLOs

**Alerting on SLO Violations**
- Use burn rate alerts for early warning
- Implement multi-window alerting
- Balance sensitivity with noise reduction
- Include runbooks for incident response

**Continuous Improvement**
Regular SLO reviews help refine targets and improve system reliability over time.`,
    tags: ["slo", "sli", "reliability", "alerting", "opentelemetry"],
    publishedAt: "2026-01-01T08:30:00Z",
    author: "Lisa Chang"
  },
  {
    id: "8",
    title: "OpenTelemetry Collector: Configuration and Deployment Patterns",
    excerpt: "Master the OpenTelemetry Collector with advanced configuration patterns and deployment strategies for production environments.",
    body: `The OpenTelemetry Collector is the heart of your observability pipeline. Here are proven deployment patterns:

**Deployment Modes**
- **Agent Mode**: Deploy alongside applications for local collection
- **Gateway Mode**: Centralized collection and processing
- **Hybrid Mode**: Combine both for optimal performance

**Configuration Best Practices**
\`\`\`yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
processors:
  batch:
    timeout: 1s
    send_batch_size: 1024
  memory_limiter:
    limit_mib: 512
exporters:
  jaeger:
    endpoint: jaeger:14250
\`\`\`

**Performance Optimization**
- Use batch processors to reduce network overhead
- Implement memory limiters to prevent OOM
- Configure appropriate buffer sizes
- Monitor collector metrics

**High Availability Setup**
Deploy multiple collector instances with load balancing for production resilience.`,
    tags: ["collector", "configuration", "deployment", "performance"],
    publishedAt: "2025-12-28T15:45:00Z",
    author: "Robert Chen"
  },
  {
    id: "9",
    title: "Debugging Production Issues with Distributed Tracing",
    excerpt: "Real-world techniques for using distributed traces to quickly identify and resolve production incidents.",
    body: `Distributed tracing transforms production debugging from guesswork to data-driven investigation:

**Incident Response Workflow**
1. Start with high-level service maps
2. Identify slow or failing services
3. Drill down into specific traces
4. Analyze span attributes and timing

**Common Debugging Patterns**
- **Latency Spikes**: Look for outlier spans and their attributes
- **Error Cascades**: Follow trace propagation to find root causes
- **Resource Bottlenecks**: Identify spans with high duration
- **Dependency Issues**: Check external service call patterns

**Advanced Techniques**
- Use trace sampling to focus on problematic requests
- Correlate traces with logs using trace IDs
- Analyze trace topology for architectural insights
- Set up automated trace analysis for common issues

**Tools and Queries**
Most observability platforms provide powerful trace search and analysis capabilities to speed up debugging.`,
    tags: ["debugging", "production", "incidents", "tracing"],
    publishedAt: "2025-12-25T12:00:00Z",
    author: "Maria Gonzalez"
  },
  {
    id: "10",
    title: "Cost Optimization Strategies for Observability Data",
    excerpt: "Practical approaches to manage observability costs while maintaining visibility into system performance and reliability.",
    body: `Observability costs can quickly spiral out of control. Here are proven strategies to optimize spending:

**Data Volume Management**
- Implement intelligent sampling strategies
- Use head-based sampling for predictable costs
- Apply tail-based sampling for error-focused collection
- Set up data retention policies

**Storage Optimization**
- Compress telemetry data before storage
- Use tiered storage for different data ages
- Implement data lifecycle management
- Archive old data to cheaper storage

**Query Optimization**
- Cache frequently accessed data
- Use pre-aggregated metrics where possible
- Optimize query patterns and indexes
- Implement query result caching

**Vendor Management**
- Negotiate volume discounts
- Use multiple vendors for different data types
- Consider open-source alternatives
- Monitor and alert on cost thresholds

The key is balancing cost with observability needs through strategic data management.`,
    tags: ["cost-optimization", "observability", "data-management", "strategy"],
    publishedAt: "2025-12-22T10:15:00Z",
    author: "Kevin Wu"
  }
];

// Generate more articles to reach the target of 30-50
const generateMoreArticles = () => {
  const topics = [
    "Kubernetes Observability with OpenTelemetry",
    "Securing Telemetry Data in Production",
    "OpenTelemetry for Serverless Applications",
    "Monitoring Database Performance with Traces",
    "Observability for Machine Learning Pipelines",
    "Real User Monitoring with OpenTelemetry",
    "Chaos Engineering and Observability",
    "Multi-Cloud Observability Strategies",
    "OpenTelemetry Auto-Instrumentation Deep Dive",
    "Building Observability Dashboards That Matter",
    "Incident Response with Observability Data",
    "OpenTelemetry for Mobile Applications",
    "Observability in CI/CD Pipelines",
    "Performance Testing with Distributed Tracing",
    "OpenTelemetry Semantic Conventions Guide",
    "Observability for Edge Computing",
    "Log Correlation with Distributed Traces",
    "OpenTelemetry Operator for Kubernetes",
    "Observability Data Privacy and Compliance",
    "Building Custom Observability Exporters",
    "Synthetic Monitoring with OpenTelemetry",
    "Observability for Event-Driven Architectures",
    "OpenTelemetry Baggage and Context Propagation",
    "Capacity Planning with Observability Data",
    "Observability Testing Strategies",
    "OpenTelemetry for Legacy System Migration",
    "Real-time Alerting with Streaming Telemetry",
    "Observability for GraphQL APIs",
    "OpenTelemetry Sampling Algorithms Explained",
    "Building Observability Culture in Teams",
    "Observability for Blockchain Applications",
    "OpenTelemetry Protocol (OTLP) Deep Dive",
    "Observability Data Lake Architecture",
    "Performance Profiling with OpenTelemetry",
    "Observability for IoT Systems",
    "OpenTelemetry Contrib Instrumentation Libraries",
    "Observability Maturity Model Assessment",
    "Distributed Tracing for Batch Processing",
    "OpenTelemetry Resource Detection",
    "Observability ROI Measurement"
  ];

  const authors = [
    "Dr. Sarah Mitchell", "James Rodriguez", "Anna Kowalski", "Michael Zhang",
    "Rachel Green", "Thomas Anderson", "Priya Patel", "Carlos Mendez",
    "Sophie Laurent", "Ahmed Hassan", "Elena Petrov", "Daniel Kim",
    "Isabella Romano", "Lucas Silva", "Fatima Al-Zahra", "Oliver Johnson"
  ];

  const tagSets = [
    ["kubernetes", "observability", "deployment"],
    ["security", "telemetry", "privacy"],
    ["serverless", "lambda", "monitoring"],
    ["database", "performance", "optimization"],
    ["machine-learning", "mlops", "monitoring"],
    ["rum", "frontend", "user-experience"],
    ["chaos-engineering", "reliability", "testing"],
    ["multi-cloud", "strategy", "architecture"],
    ["auto-instrumentation", "automation"],
    ["dashboards", "visualization", "ux"],
    ["incident-response", "sre", "operations"],
    ["mobile", "ios", "android"],
    ["cicd", "devops", "automation"],
    ["performance-testing", "load-testing"],
    ["semantic-conventions", "standards"],
    ["edge-computing", "iot", "distributed"],
    ["logs", "correlation", "debugging"],
    ["kubernetes", "operator", "automation"],
    ["privacy", "compliance", "gdpr"],
    ["exporters", "custom", "development"],
    ["synthetic-monitoring", "uptime"],
    ["event-driven", "messaging", "async"],
    ["baggage", "context", "propagation"],
    ["capacity-planning", "forecasting"],
    ["testing", "quality-assurance"],
    ["legacy", "migration", "modernization"],
    ["real-time", "streaming", "alerting"],
    ["graphql", "api", "monitoring"],
    ["sampling", "algorithms", "performance"],
    ["culture", "teams", "adoption"],
    ["blockchain", "web3", "monitoring"],
    ["otlp", "protocol", "networking"],
    ["data-lake", "analytics", "storage"],
    ["profiling", "performance", "optimization"],
    ["iot", "sensors", "telemetry"],
    ["contrib", "libraries", "community"],
    ["maturity", "assessment", "strategy"],
    ["batch-processing", "etl", "monitoring"],
    ["resources", "detection", "metadata"],
    ["roi", "business-value", "metrics"]
  ];

  return topics.map((title, index) => ({
    id: (11 + index).toString(),
    title,
    excerpt: `Comprehensive guide to ${title.toLowerCase()} covering implementation strategies, best practices, and real-world examples.`,
    body: `This article provides an in-depth exploration of ${title.toLowerCase()}.

## Overview
Understanding the fundamentals and practical applications in modern observability stacks.

## Key Concepts
- Implementation strategies and patterns
- Best practices from industry experience  
- Common pitfalls and how to avoid them
- Performance considerations and optimization

## Practical Examples
Real-world scenarios and code examples demonstrating effective implementation approaches.

## Conclusion
Summary of key takeaways and next steps for implementation in your environment.`,
    tags: tagSets[index] || ["observability", "opentelemetry"],
    publishedAt: new Date(new Date('2026-01-01').getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    author: authors[index % authors.length]
  }));
};

export const allArticles = [...articles, ...additionalArticles, ...generateMoreArticles()];

// Helper function to get viewer context from request headers
export const getViewerContext = (req) => {
  const demoUser = req.headers['x-demo-user'];
  if (!demoUser) return null;
  
  // Parse demo user header (could be JSON or simple string)
  try {
    return typeof demoUser === 'string' && demoUser.startsWith('{') 
      ? JSON.parse(demoUser)
      : { id: demoUser, plan: 'free' };
  } catch {
    return { id: demoUser, plan: 'free' };
  }
};

// Helper function to add artificial delay
export const addDelay = (min, max) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};