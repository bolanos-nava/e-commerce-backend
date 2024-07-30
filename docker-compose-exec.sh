docker compose down

# remove server:local image if it exists
if [ "$(docker images server:local | grep "server\s\+local")" ]; then
    docker rmi server:local
fi

docker compose --env-file=.env.docker up
