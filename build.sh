#!/bin/sh

docker build -t blakeasmith/tabpuppet .
docker build -t blakeasmith/tabpuppet-signalling ./signalling
