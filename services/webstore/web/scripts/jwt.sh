#!/bin/bash

openssl genrsa -out ./jwt/private.pem 2048

openssl rsa -in ./jwt/private.pem -pubout -out ./jwt/public.pem
