---
title: Scheduling Tasks
---

# Scheduling Tasks

The scheduler runs code for you — once after a delay, repeatedly on an interval,
or off the main thread. WaterdogPE provides this through `WaterdogScheduler`
(`dev.waterdog.waterdogpe.scheduler.WaterdogScheduler`).

## Accessing the scheduler

```java
WaterdogScheduler scheduler = this.getProxy().getScheduler();
// or, from anywhere:
WaterdogScheduler scheduler = WaterdogScheduler.getInstance();
```

## Time is measured in ticks

All `delay` and `period` values are in **ticks**, not milliseconds. The proxy
ticks **20 times per second**, so:

- `20` ticks = 1 second
- `1200` ticks = 1 minute

## Scheduling methods

Every method takes a `Runnable` (the work to do) and returns a
`TaskHandler` you can use to cancel it later.

```java
// Run once, on the main scheduler thread
scheduler.scheduleTask(() -> doWork(), false);

// Run once, on a background (async) thread
scheduler.scheduleAsync(() -> doWork());

// Run once after a delay (here: 5 seconds)
scheduler.scheduleDelayed(() -> doWork(), 100);
scheduler.scheduleDelayed(() -> doWork(), 100, true);   // async variant

// Run repeatedly every `period` ticks (here: every 30 seconds)
scheduler.scheduleRepeating(() -> doWork(), 600);
scheduler.scheduleRepeating(() -> doWork(), 600, true); // async variant

// Wait `delay`, then repeat every `period` (here: wait 5s, then every 1s)
scheduler.scheduleDelayedRepeating(() -> doWork(), 100, 20);
scheduler.scheduleDelayedRepeating(() -> doWork(), 100, 20, true);
```

| Method | What it does |
| --- | --- |
| `scheduleTask(task, async)` | Run once. Async if `async` is `true`. |
| `scheduleAsync(task)` | Run once on the async thread pool. |
| `scheduleDelayed(task, delay[, async])` | Run once after `delay` ticks. |
| `scheduleRepeating(task, period[, async])` | Run every `period` ticks. |
| `scheduleDelayedRepeating(task, delay, period[, async])` | Wait `delay`, then run every `period`. |

When `async` is omitted it defaults to `false`.

## Cancelling a task

Keep the `TaskHandler` and call `cancel()`:

```java
TaskHandler<?> handler = scheduler.scheduleRepeating(() -> announce(), 1200);

// later, e.g. in onDisable():
handler.cancel();
```

The handler also exposes status helpers like `isCancelled()`, `isRepeating()`,
`isAsync()`, `getNextRunTick()` and `getLastRunTick()`.

> **Clean up on disable.** Cancel your repeating tasks in your plugin's
> `onDisable()` so they don't keep running after the plugin is unloaded.

## The `Task` class (richer control)

For tasks that need to know the current tick or react to being cancelled, extend
`dev.waterdog.waterdogpe.scheduler.Task` instead of passing a plain `Runnable`.
It is itself a `Runnable`, so you schedule it the same way:

```java
import dev.waterdog.waterdogpe.scheduler.Task;

public class AnnounceTask extends Task {
    @Override
    public void onRun(int currentTick) {
        ProxyServer.getInstance().getPlayers().values()
            .forEach(p -> p.sendMessage("§eScheduled announcement!"));
    }

    @Override
    public void onCancel() {
        // called when the task is cancelled or finishes
    }
}

// schedule it:
scheduler.scheduleRepeating(new AnnounceTask(), 1200);
```

## When should I use an async task?

Use an **async** task when the work does **not** need to run in order with other
scheduled tasks and does not touch state that must only be changed on one thread.
Async tasks run on a `ThreadPoolExecutor`, so they don't block the proxy — ideal
for I/O like database queries or HTTP requests.

A few things to keep in mind:

- Even a **non-async** task does **not** run on the proxy's main networking
  thread — WaterdogPE uses a dedicated single thread that ticks and runs
  non-async tasks in order.
- An async task may run on **any** thread from the pool, and consecutive runs of
  a repeating async task are not guaranteed to be on the same thread. Don't rely
  on thread-local state, and synchronise access to shared data.
- A common pattern: do slow work (e.g. a DB query) in an **async** task, store
  the result in memory, and read that cached result from the fast paths
  (handlers, events).
