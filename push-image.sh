# If latest image exists, remove it and tag it again
if [ "$(docker images ecommerce-api:latest --format="{{.Tag}}")" ]; then
    echo "Removing ecommerce-api:latest"
    docker rmi ecommerce-api:latest
fi

NEW_VERSION=0.0.1

# If there are any existing versions, increment the minor version
if [ "$(docker images ecommerce-api --format="{{.Tag}}")" ]; then
    echo "Incrementing minor version"
    VERSION=$(docker images ecommerce-api --format "{{.Tag}}" | grep -v 'latest' | sort -r | head -n 1)
    MINOR=$(echo $VERSION | cut -d'.' -f3)
    NEW_VERSION="$(echo $VERSION | cut -d'.' -f1).$(echo $VERSION | cut -d'.' -f2).$(($MINOR + 1))"
fi

# Build and push the Docker image
docker build . \
    --tag=ecommerce-api:${NEW_VERSION} \
    --tag=ecommerce-api:latest \
    --tag=bolanosnava/ecommerce-api:${NEW_VERSION} \
    --tag=bolanosnava/ecommerce-api:latest

docker push bolanosnava/ecommerce-api:${NEW_VERSION}
docker push bolanosnava/ecommerce-api:latest

docker rmi bolanosnava/ecommerce-api:latest
docker rmi bolanosnava/ecommerce-api:${NEW_VERSION}
