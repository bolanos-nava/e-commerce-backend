# If latest image exists, remove it and tag it again
if [ "$(docker images express-server:latest --format="{{.Tag}}")" ]; then
    echo "Removing express-server:latest"
    docker rmi express-server:latest
fi

NEW_VERSION=0.0.1

# If there are any existing versions, increment the minor version
if [ "$(docker images express-server --format="{{.Tag}}")" ]; then
    echo "Incrementing minor version"
    VERSION=$(docker images express-server --format "{{.Tag}}" | grep -v 'latest' | sort -r | head -n 1)
    MINOR=$(echo $VERSION | cut -d'.' -f3)
    NEW_VERSION="$(echo $VERSION | cut -d'.' -f1).$(echo $VERSION | cut -d'.' -f2).$(($MINOR + 1))"
fi

# Build and push the Docker image
docker build . \
    --tag=express-server:${NEW_VERSION} \
    --tag=express-server:latest \
    --tag=bolanosnava/express-server:${NEW_VERSION} \
    --tag=bolanosnava/express-server:latest

docker push bolanosnava/express-server:${NEW_VERSION}
docker push bolanosnava/express-server:latest

docker rmi bolanosnava/express-server:latest
docker rmi bolanosnava/express-server:${NEW_VERSION}
