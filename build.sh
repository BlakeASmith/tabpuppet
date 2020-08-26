#!/bin/sh

docker build -t blakeasmith/tabpuppet-express ./express
docker build -t blakeasmith/tabpuppet-signalling ./signalling
