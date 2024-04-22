#!/bin/bash

out=""
for i in $(cat .env); do
    out+="--build-arg $i "
done
echo $out
