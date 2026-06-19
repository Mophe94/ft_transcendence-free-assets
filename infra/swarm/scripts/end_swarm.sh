#!/bin/bash
docker service ls
docker service rm $(docker service ls --format "{{.ID}}");
docker service ls
docker swarm leave --force;
