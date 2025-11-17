#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/backend"

# Prefer existing JAVA_HOME, otherwise try common locations or derive from `java`
if [ -z "${JAVA_HOME:-}" ]; then
    if [ -d /usr/lib/jvm/java-17-openjdk-amd64 ]; then
        export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
    else
        JAVA_BIN=$(command -v java || true)
        if [ -n "$JAVA_BIN" ]; then
            JAVA_HOME=$(dirname "$(dirname "$JAVA_BIN")")
            export JAVA_HOME
        fi
    fi
fi

if [ -z "${JAVA_HOME:-}" ] || [ ! -d "$JAVA_HOME" ]; then
    printf 'JAVA_HOME is not set and could not be detected automatically. Please install JDK 17 and set JAVA_HOME.\n' >&2
    exit 1
fi

export MAVEN_USER_HOME="${MAVEN_USER_HOME:-$HOME/.m2}"

exec ./mvnw -DskipTests spring-boot:run
