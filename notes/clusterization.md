# Clusterization and websockets

There is a problem when using container clusters with websockets. Normally, we would want our different processing nodes to randomly handle the requests that come from the clients: one request can go to one node and the next one to any other available node. However, for websockets to function you need a stable and long-lived connection between the client and the socket. Websocket is a stateful protocol.

In the first architecture of the Express server we had a built-in websocket server, derived from the main HTTP server. When running the app locally with just one instance of the server every client connected to the websocket server of a single instance. However, when using tools like Kubernetes where several instances of the application run concurrently, that constraint of websockets becomes an issue. 

Here, I will explain the clusterized new architecture of my app, things I attempted to solve the websocket problem and finally, my final architecture redesign.

## Kubernetes cluster architecture

My cluster goes like this:

1. StatefulSet with 3 replicas that deploys a MongoDB replica set.
   - It is fronted by a headless service that generates a predictable DNS A record for every one of the pods of the StatefulSet.
   - It is not exposed to the host computer by any means. Only the Express application connects to the StatefulSet through the headless service.
2. Deployment for the Express application with 3 replicas. 
   - This is fronted by an internal load balancer service that routes incoming requests randomly amongst the pods of the application. It is internal because it is not exposed to the outside world.
   - For receiving external requests, there is an Nginx ingress controller that routes requests from localhost/ to the load balancer, which in turn distributes the requests in the deployment.
3. A pod for a websocket service. This is a simple Express server which receives HTTP requests and emits websocket events. It acts as an intermediary between the Express application and the clients.
   - This one is fronted by a ClusterIP service that allows the Express application to connect to it.
   - It also has another Nginx ingress controller to expose the service to the host computer so clients can connect to it through the localhost/websocket-service path.

## Things I attempted

Before implementing the websocket server as a separate container, when a client tried to connect to the websocket server of the Express application a warning showed up in the browser console saying that the connection terminated early. To solve this, I tried to implement an Nginx ingress controller for the localhost/socket.io path with the annotation `nginx.ingress.kubernetes.io/upstream-hash-by: "$client_ip"` which enables session stickiness. Basically, that annotation instructs the ingress controller to route every request of the same IP to a single pod.

This didn't however solve the problem. What happened now was that the clients connected to the websocket server of one of the pods, while sending HTTP requests randomly to any one of the other pods. So, only one pod was able to emit events to the clients. There is one event called "new_product", triggered after a new product is added to the database. Only when the pod with the sticky session randomly received a request for the create product endpoint the websocket would emit the event to the clients.

Another thing I tried was to add the annotation for session stickiness through the client IP to the Nginx ingress controller. This made both websocket and HTTP requests be sent to the same client, which made the websocket work but prevented the HTTP requests to be randomly distributed in the deployment.

Finally, what worked was to separate the websocket server into a standalone pod. This new pod is a simple Express server that receives HTTP request sent from the main Express application and emits websocket events to the clients. With proper configuration of the Nginx ingress controller, now the clients connect to this single websocket server while their HTTP requests are distributed randomly amongst the pods of the deployment.

With this architecture, then, every client that connects to the websocket server connects to one single pod, maintaining a long-lived session, and the Express application, in those parts where it originally emitted websocket events, now sends a HTTP request to the websocket application containing the event and the payload the websocket must send. Then, the websocket app receives this request and sends the appropriate event with the payload it received.