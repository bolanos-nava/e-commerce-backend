check_status() {
    echo "Checking status of Nginx resources..."
    pending_resources=$(
        kubectl get all -n=ingress-nginx --no-headers |
            grep -e "Pending" \
                -e "ContainerCreating" \
                -e "CrashLoopBackOff" \
                -e "ImagePullBackOff" |
            wc -l
    )
    if [ "$pending_resources" -gt 0 ]; then
        echo "Not yet ready"
        return 1
    fi
    echo "Nginx resources ready!"
    return 0
}

# "if [ -n $1 ]" checks if the variable $1 (which refers to the first argument passed to the script) is defined
# then checks if it has the value of "recreate"
if [ -n $1 ] && [ "$1" = "recreate" ]; then
    # if it exits a Kind cluster named "multinode", delete it
    if [ $(kind get clusters | grep "multinode" | wc -l) -gt 0 ]; then
        kind delete cluster --name=multinode
    fi
    # create a Kind cluster named "multinode" using the provided kind-config.yaml file
    kind create cluster --config=kind-config.yaml
fi

echo "Creating secret for environment variables of Express API"
kubectl create secret generic ecommerce-env --from-env-file=../.env.k8s

echo "Applying database and server resources"
kubectl apply \
    -f database/mongo-configmap.yaml \
    -f database/db-statefulset.yaml \
    -f database/db-headless-svc.yaml \
    -f server/server-depl.yaml \
    -f server/server-lb.yaml

echo "Applying websocket service resources"
kubectl apply \
    -f ../socketService/websocket-svc.yaml \
    -f ../socketService/websocket-pod.yaml

echo "Applying Nginx resources"
kubectl apply \
    -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# We do a while loop inside of which we call the check_status function, which checks if all resources created so far are ready yet. The "$?" variable refers to the result of the last executed command. In this case, the last executed command is the check_status function call. When that command returns a 1 it means that the resources aren't ready.
# The result of check_status is inputted in a test condition "[ cond ]", in this case the test condition checks if the result was 1. If the result was 1, it sleeps for 10 seconds.
while {
    check_status
    [ $? -eq 1 ]
}; do sleep 10; done

retry=true
while $retry; do
    echo "Applying Nginx ingress controllers for Ecommerce API and websocket service"
    # This command will execute correctly once the Nginx resources are all ready
    kubectl apply \
        -f ingress/nginx-ingress.yaml \
        -f ../socketService/nginx-ingress.yaml

    # If the result of the apply command equals 0, it means that it executed correctly without errors, applying the ingress controllers
    if [ $? -eq 0 ]; then
        retry=false
        echo "Applied ingress controllers"
    # If the result is anything other than 0, there was an error, so the code sleeps for 20 seconds before attempting to apply the Nginx ingress controllers again
    else
        echo "Couldn't apply ingress controllers"
        sleep 20
    fi
done
