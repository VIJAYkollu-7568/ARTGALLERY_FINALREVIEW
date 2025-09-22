# Stage 1: Build Spring Boot app
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

COPY mvnw .
COPY .mvn/ .mvn
COPY pom.xml .
COPY src ./src

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

RUN cp target/*.jar app.jar

# Stage 2: Run Spring Boot app
FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY --from=builder /app/app.jar app.jar

EXPOSE 2000
ENTRYPOINT ["java", "-jar", "app.jar"]
