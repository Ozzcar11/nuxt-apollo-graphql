#!/bin/sh

sudo touch /etc/docker/daemon.json
sudo sh -c 'echo "{\"registry-mirrors\": [\"https://mirror.gcr.io\", \"https://daocloud.io\", \"https://c.163.com/\", \"https://huecker.io/\", \"https://registry.docker-cn.com\"]}" > /etc/docker/daemon.json'
sudo cat /etc/docker/daemon.json
