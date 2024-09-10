# If latest image exists, remove it and tag it again
if [ "$(docker images websocket:latest --format="{{.Tag}}")" ]; then
    echo "Removing websocket:latest"
    docker rmi websocket:latest
fi

NEW_VERSION=0.0.1

# If there are any existing versions, increment the minor version
if [ "$(docker images websocket --format="{{.Tag}}")" ]; then
    echo "Incrementing minor version"
    VERSION=$(docker images websocket --format "{{.Tag}}" | grep -v 'latest' | sort -r | head -n 1)
    MINOR=$(echo $VERSION | cut -d'.' -f3)
    NEW_VERSION="$(echo $VERSION | cut -d'.' -f1).$(echo $VERSION | cut -d'.' -f2).$(($MINOR + 1))"
fi

# Build and push the Docker image
docker build . \
    --tag=websocket:${NEW_VERSION} \
    --tag=websocket:latest \
    --tag=bolanosnava/websocket:${NEW_VERSION} \
    --tag=bolanosnava/websocket:latest

docker push bolanosnava/websocket:${NEW_VERSION}
docker push bolanosnava/websocket:latest

docker rmi bolanosnava/websocket:latest
docker rmi bolanosnava/websocket:${NEW_VERSION}
