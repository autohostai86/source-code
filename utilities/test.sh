#!/bin/bash

echo "passed variable is $1"


foo=${N_ENV:-default}
branchName=${BRANCH:-default}
branchCommit=${COMMIT:-default}

echo  env variable foo   is  $foo
echo  env variable branch Name   is  $branchName
echo  env variable branch commit   is  $branchCommit

