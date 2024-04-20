#!/bin/bash
function build {
    local should_cache=$1

    if [[ $should_cache == true ]]; then
        docker build -t server .
    else
        docker build -t server . --no-cache
    fi
}

ARGS=$1
COMMAND=$2

{
    docker rmi server
    build true
} || {
    build true
}

docker run \
    $ARGS \
    --rm \
    --init \
    --name=server server $COMMAND
