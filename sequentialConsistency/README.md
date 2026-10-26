# Sequential Consistency (Sequencer-Based Model)

My students have difficulty understanding sequential consistency, so I scaffold them with this globally sequenced version first. 
I created this visualisation to help them understand what sequential consistency feels like. The code is genAI.

This model of sequential consistency uses a **sequencer** to make it easier to see the global total order. Most implementations of sequential consistency work peer-to-peer (P2P), meaning they operate without a sequencer.

Run the model and observe the following:

- There are multiple withdrawals occurring concurrently. A new **red, negative** message (for example, `-$54`) is sent before the response from the previous message is received. This means the nodes are **non-blocking** and do not wait for an acknowledgement (ACK) before sending another message.

- The nodes send messages to the sequencer, which then broadcasts those messages to all nodes. The sequencer provides a **total (global) order**, assuming all communication links preserve message ordering.

- The graphs match, although the withdrawal graph may appear to be "behind" the others because it experiences higher lag. The matching graphs visualise that, despite there being multiple replicas, the system behaves as though there is only a single state. The **global (total) order** guarantees this behaviour.

- Although the global sequencer has a graph shown in the simulation, in reality the sequencer does **not** maintain state. The state exists only as replicas within the nodes.

## Experiment

Once you understand the points above:

1. Right-click and refresh the simulator.
2. Increase **Ops/sec per node** to **0.3**.

Notice:

- There are multiple simultaneous **red withdrawal requests**, highlighting the fact that the system operates without waiting for acknowledgements (no-ACK behaviour).
