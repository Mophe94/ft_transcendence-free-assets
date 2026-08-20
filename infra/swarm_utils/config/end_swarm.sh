#!/bin/bash
docker service ls
docker stack rm $(docker stack ls -q);
docker service ls
