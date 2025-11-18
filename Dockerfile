# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

# Cache dependencies first
COPY backend/pom.xml backend/pom.xml
RUN mvn -f backend/pom.xml -B dependency:go-offline

# Copy the full backend source and build
COPY backend backend
RUN mvn -f backend/pom.xml -B clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app

ENV PORT=8081
ARG JAR_FILE=backend-0.0.1-SNAPSHOT.jar
COPY --from=build /workspace/backend/target/${JAR_FILE} app.jar

EXPOSE 8081
CMD ["sh","-c","java -Dserver.port=${PORT} -jar /app/app.jar"]
