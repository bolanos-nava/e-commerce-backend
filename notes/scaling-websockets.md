# Scaling websockets

To scale a websocket server there are things to consider:

- **Sticky sessions:** since websocket is a stateful protocol, it needs to save some information in the memory of the server. So, a websocket session between a server and a client needs to be sticky and long-lived. So, a client should connect to only one websocket server.
- **Load balancing:** the websocket server cluster should be fronted by a load balancer so the clients randomly initiate their connection to one of the instances.
- **Communication between server instances:** since the connection to the servers will be load balanced, every client may be connected to a different server at a time. Then, if one of the instances emits an event, only the connected clients will receive it. Samely, if a client emits an event only the connected server will receive it and if it emits, for example, a broadcast that should arrive to all clients, only the clients connected to that server will receive the event. So, you need to implement some way to "share" connections between the websocket server instances, or intercommunicate them.

## Implementation

## Websocket server replicas and load balancer

In the K8s cluster I built for deploying the ecommerce API I have a pod that is a websocket service. All clients connect to this pod.

A new architecture and infrastructure proposal is this one:

- Generate a deployment for the websocket service to have replicas.
- Put a load balancer in front of the websocket deployment.
- Add an Nginx ingress controller to enable sticky sessions so each client connects to only one replica of the websocket service.
- Implement a pub/sub service with a topic to which every websocket pod subscribes.
- Add logic to the source code of the websocket service to manage the subscription to the topic. When one of the replicas wants to emit an event, it first emits a message to the topic it is subscribed. Every other replica will receive it and after receiving it should then emit the event to all of its clients.

More information:

- [How to scale websockets](https://hackernoon.com/scaling-websockets-9a31497af051): in this link the pub-sub architecture is explored.
- [Socket.io: Using multiple nodes](https://socket.io/docs/v4/using-multiple-nodes/)
- [Challenges of scaling websockets](https://dev.to/ably/challenges-of-scaling-websockets-3493)
- [Alternative to websockets: server-sent events (SSE)](https://ably.com/topic/server-sent-events): article explaining SSE, another communication strategy to send information to the client without having the client request it first.