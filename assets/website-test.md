# Website Test

Test different types of markdown elements. 

### Create a custom thread pool

```java
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class FancyThreadPoolDemo {

    // Custom ThreadFactory that names threads nicely
    static class NamedThreadFactory implements ThreadFactory {
        private final AtomicInteger threadNumber = new AtomicInteger(1);
        private final String namePrefix;

        NamedThreadFactory(String prefix) {
            this.namePrefix = prefix + "-worker-";
        }

        public Thread newThread(Runnable r) {
            Thread t = new Thread(r, namePrefix + threadNumber.getAndIncrement());
            t.setDaemon(false);
            t.setPriority(Thread.NORM_PRIORITY);
            return t;
        }
    }

    // Create a custom thread pool
    public static ExecutorService createFancyThreadPool(String poolName, int coreSize, int maxSize, int queueSize) {
        BlockingQueue<Runnable> workQueue = new ArrayBlockingQueue<>(queueSize);
        ThreadFactory threadFactory = new NamedThreadFactory(poolName);

        // Rejection policy: log and discard
        RejectedExecutionHandler rejectionHandler = (r, executor) -> {
            System.err.println("Task " + r.toString() + " rejected from " + executor.toString());
        };

        return new ThreadPoolExecutor(coreSize, maxSize, 30L, TimeUnit.SECONDS, workQueue, threadFactory, rejectionHandler);
    }

    public static void main(String[] args) throws InterruptedException {
        ExecutorService fancyPool = createFancyThreadPool("FancyPool", 4, 8, 16);

        // Submit tasks using CompletableFuture for async + non-blocking style
        for (int i = 1; i <= 20; i++) {
            final int taskId = i;
            CompletableFuture.runAsync(() -> {
                String threadName = Thread.currentThread().getName();
                System.out.println("Task #" + taskId + " started by " + threadName);
                try {
                    Thread.sleep((long) (Math.random() * 2000));
                } catch (InterruptedException ignored) {}
                System.out.println("Task #" + taskId + " completed by " + threadName);
            }, fancyPool);
        }

        // Shutdown the pool gracefully after a delay
        Thread monitor = new Thread(() -> {
            while (!fancyPool.isTerminated()) {
                if (fancyPool instanceof ThreadPoolExecutor tpe) {
                    System.out.println("Monitoring -> Active: " + tpe.getActiveCount() + ", Queue: " + tpe.getQueue().size());
                }
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ignored) {}
            }
        });
        monitor.start();

        fancyPool.shutdown();
        fancyPool.awaitTermination(30, TimeUnit.SECONDS);
        System.out.println("All tasks completed. Thread pool shut down.");
    }
}
```

### Euler’s totient function

$$
\phi(n) = n \prod_{\substack{p \mid n \\ p \text{ prime}}} \left(1 - \frac{1}{p} \right)
$$