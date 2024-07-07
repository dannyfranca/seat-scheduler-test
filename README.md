# seat-scheduler-test

# Concepts

This uses a Domain Driven Design approach, which naturally leads to more complex code, but rich and validated entities everywhere.

I would not use the approach for every single feature of a system, but I do believe it is valuable to keep the integrity of the core subdomains.

Business requirements are written in isolation as use case classes, in a Clean Arch style, it is not opinionated by frameworks and only executes business logic with given plain object inputs and outputs.

Nearly every piece of software is meant to be a lego brick, having it's own responsibility, easily tested in isolation and replaceable by another driver, this also make easier to evolve the software over time with unpredictable business changes.

Lib choice prioritized a flexible and simple lib (Hono in this case), that can be easily bundled and uses ESM in its core. Bundling applications with performative tools that relies on engines like esbuild decreases build time for big applications, also reduces container size by stripping the node_modules completely. Typescript is executed locally with tsx to make it way faster than ts-node, big typescript projects relying on ts-node have huge development experience impact, I wanted to keep the refresh very quick and leave the type-check for the build process, and the IDE during development, of course.

Because of the choice of a simple framework, it leads to a decision we don't have to think about when we pick a framework like Nest, for example.

For dependency Injection, a simple factory approach is usually enough and less complex than a full featured dependency injection mechanism, and generates no bindings to a specific framework with low overhead.

For graceful shutdown, a simple lifecycle manager class takes care of making sure requests are not lost in between container changes.

Minimal impact of dependencies, except for the framework layer, the application core itself relies on the own application implementations. With not much libraries spread over the files, it decreases change chances of this software to become legacy, relying mostly on the language and simple abstractions where a library is suitable.

When engineering team is mature enough to know what they are doing, it is often more suitable to have more control over than environment than having the help/bottleneck of adapting to a opinionated framework.

A lot of non-functional pieces of software are part of a toolbox I have developed myself over years and using in production to make dev experience, troubleshooting and testing easier.

# Improvements

- Tests are missing everywhere. Day to day I would for many features write the tests first and then implement, but I had a short time available and the validations were simple enough so I did not have to spend much time testing manually.
- Database setup for integration tests with `tmpfs`, allowing data to be mapped to memory in the container speeding up test execution.
- A better migrations management, the current one is idempotent, simple and enough for the task.
- Pagination on the list endpoint.
