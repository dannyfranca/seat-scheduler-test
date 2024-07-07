# seat-scheduler-test

## Running the Application

For container execution, you need to have Docker and Docker Compose installed.

```bash
docker-compose up
```

For developing locally, you need to have Node.js and pnpm installed.

Install packages 

```bash
pnpm install
```

Run development server.

```bash
pnpm run dev
```

## Concepts

This uses a Domain Driven Design approach, which naturally leads to more complex code, but rich and validated entities everywhere.

I would not use the approach for every single feature of a system, but I do believe it is valuable to keep the integrity of the core subdomains.

Business requirements are written in isolation as use case classes, in a Clean Arch style, it is not opinionated by frameworks and only executes business logic with given plain object inputs and outputs.

Nearly every piece of software is meant to be a lego brick, having it's own responsibility, easily tested in isolation and replaceable by another driver, this also make easier to evolve the software over time with unpredictable business changes.

The database layer is abstracted by a repository pattern, which is a simple interface to the database, it is not meant to be a full featured ORM, but a simple abstraction to make the database layer replaceable. Since some features could potentially have problems with race conditions, the repository layer implement atomic updates to avoid data corruption. I did not find a strong reason for using transactions.

Lib choice prioritized a flexible and simple lib (Hono in this case), that can be easily bundled and uses ESM in its core. Bundling applications with performative tools that relies on engines like esbuild decreases build time for big applications, also reduces container size by stripping the node_modules completely. Typescript is executed locally with tsx to make it way faster than ts-node, big typescript projects relying on ts-node have huge development experience impact, I wanted to keep the refresh very quick and leave the type-check for the build process, and the IDE during development, of course.

Because of the choice of a simple framework, it leads to a decision we don't have to think about when we pick a framework like Nest, for example.

For dependency Injection, a simple factory approach is usually enough and less complex than a full featured dependency injection mechanism, and generates no bindings to a specific framework with low overhead.

For graceful shutdown, a simple lifecycle manager class takes care of making sure requests are not lost in between container changes.

Minimal impact of dependencies, except for the framework layer, the application core itself relies on the own application implementations. With not much libraries spread over the files, it decreases change chances of this software to become legacy, relying mostly on the language and simple abstractions where a library is suitable.

When engineering team is mature enough to know what they are doing, it is often more suitable to have more control over than environment than having the help/bottleneck of adapting to a opinionated framework.

A lot of non-functional pieces of software are part of a toolbox I have developed myself over years and using in production to make dev experience, troubleshooting and testing easier.

## Improvements

- Tests are missing everywhere. Day to day I would for many features write the tests first and then implement, but I had a short time available and the validations were simple enough so I did not have to spend much time testing manually.
- Database setup for integration tests with `tmpfs`, allowing data to be mapped to memory in the container speeding up test execution.
- A better migrations management, the current one is idempotent, simple and enough for the task.
- Pagination on the list endpoint.
- API design was very minimal, but could be richer with more requirements about its usage. A.K.A. frontend requirements.
- Implement heath-checks endpoint.
- For simplicity, an expiration was set as a routine every 5 seconds in the application. A more production like version would be an external system handling the expiration. Also, the 5 seconds might not be acceptable if we want more precision for expirations. Some alternatives are:
  - Implement a cron job to run every second.
  - Implement a queue system to schedule expiration events.
  - Create a Postgres function and use with an extension like pg_cron to schedule expiration events.

## Considerations

- The current API design would not allow smooth future potential transition to an optimized storage like DynamoDB where seats would be in the event partition, since it would require eventId as well to query for the data. The API would have to be redesigned to add seat under event endpoints. A.K.A. `/events/:eventId/seats/:seatId/hold`
