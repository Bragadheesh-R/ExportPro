-- MySQL dump 10.13  Distrib 8.4.10, for Linux (x86_64)
--
-- Host: localhost    Database: exportpro_db
-- ------------------------------------------------------
-- Server version	8.4.10

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `car_images`
--

DROP TABLE IF EXISTS `car_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `is_main` bit(1) DEFAULT NULL,
  `car_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKet593krc5137jxdk5cxdah2vd` (`car_id`),
  CONSTRAINT `FKet593krc5137jxdk5cxdah2vd` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_images`
--

LOCK TABLES `car_images` WRITE;
/*!40000 ALTER TABLE `car_images` DISABLE KEYS */;
INSERT INTO `car_images` VALUES (3,'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',_binary '',2),(4,'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',_binary '\0',2),(5,'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',_binary '\0',2),(11,'/uploads/cars/cee1b753-0ba1-436c-8920-425530a051f6.webp',_binary '',1),(12,'/uploads/cars/43ea6f40-1ba5-4efc-8bab-85d77b120c36.webp',_binary '\0',1);
/*!40000 ALTER TABLE `car_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `vehicle_condition` varchar(255) DEFAULT NULL,
  `make` varchar(255) NOT NULL,
  `mileage` int DEFAULT NULL,
  `model` varchar(255) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `vin` varchar(255) DEFAULT NULL,
  `year` int NOT NULL,
  `port_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK9iw0yw3wc3fcv3hhjo2gp0hn4` (`vin`),
  KEY `FKn6n9tvgfdxdovw1q52b5ok0fs` (`port_id`),
  CONSTRAINT `FKn6n9tvgfdxdovw1q52b5ok0fs` FOREIGN KEY (`port_id`) REFERENCES `ports` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
INSERT INTO `cars` VALUES (1,'Good','Toyota',42000,'Camry',850000.00,'AVAILABLE','JT2BF22K1W0123456',2019,1),(2,'Execellent','Honda ',30000,'Civic',650000.00,'AVAILABLE','2HGFC2F59LH123456',2020,1);
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiries`
--

DROP TABLE IF EXISTS `inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `car_id` bigint NOT NULL,
  `customer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmsoxvhfiy5yyq8q80ieqdpm82` (`car_id`),
  KEY `FKmbr8hm5xe00omdw1ec5ihb312` (`customer_id`),
  CONSTRAINT `FKmbr8hm5xe00omdw1ec5ihb312` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKmsoxvhfiy5yyq8q80ieqdpm82` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
INSERT INTO `inquiries` VALUES (1,'2026-07-25 12:33:45.302650','intrested\n',1,2),(2,'2026-07-25 12:36:38.399680','Yes, I am Intrested.',2,2),(3,'2026-08-04 18:02:48.207211','Hi',2,2),(4,'2026-08-07 18:29:45.056556','Gg\n',1,2);
/*!40000 ALTER TABLE `inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `completed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `price_at_purchase` decimal(38,2) NOT NULL,
  `status` enum('CANCELLED','COMPLETED','RESERVED') NOT NULL,
  `car_id` bigint NOT NULL,
  `customer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKd2p23ixwrrt395glgi9nnbj23` (`car_id`),
  KEY `FKsjfs85qf6vmcurlx43cnc16gy` (`customer_id`),
  CONSTRAINT `FKd2p23ixwrrt395glgi9nnbj23` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`),
  CONSTRAINT `FKsjfs85qf6vmcurlx43cnc16gy` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2026-07-25 19:33:56.814560','2026-07-25 19:28:30.442006',650000.00,'COMPLETED',2,2),(2,NULL,'2026-07-28 17:19:18.000049',850000.00,'CANCELLED',1,2),(3,NULL,'2026-07-28 17:20:30.223632',650000.00,'CANCELLED',2,2),(4,'2026-08-04 07:37:17.069848','2026-08-04 07:31:38.174681',650000.00,'COMPLETED',2,2),(5,'2026-08-04 18:03:15.311248','2026-08-04 18:02:41.266245',650000.00,'COMPLETED',2,2);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ports`
--

DROP TABLE IF EXISTS `ports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `country` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `region` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ports`
--

LOCK TABLES `ports` WRITE;
/*!40000 ALTER TABLE `ports` DISABLE KEYS */;
INSERT INTO `ports` VALUES (1,'India','Chennai Port','South Asia');
/*!40000 ALTER TABLE `ports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repair_records`
--

DROP TABLE IF EXISTS `repair_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repair_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cost` decimal(38,2) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `performed_by` varchar(255) DEFAULT NULL,
  `repair_date` date DEFAULT NULL,
  `car_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKge9jppqxtngsuhm1093okaciu` (`car_id`),
  CONSTRAINT `FKge9jppqxtngsuhm1093okaciu` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repair_records`
--

LOCK TABLES `repair_records` WRITE;
/*!40000 ALTER TABLE `repair_records` DISABLE KEYS */;
INSERT INTO `repair_records` VALUES (1,5000.00,'Fixed Front Bumper','City Autoshop','2026-07-26',1);
/*!40000 ALTER TABLE `repair_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','CUSTOMER') NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@exportpro.com','$2a$10$Yb6BgEzMb9gbwoH7KDju3e3K98uvzF6cJk4j2HCnXVLWh.NKoSo2u','ADMIN','MadAdmin'),(2,'customer@test.com','$2a$10$yMHTuRUZWHyUDWkyg7Z27eCUGILYbPuadlwbljT93B4eeqsPBxrUa','CUSTOMER','TestCustomer'),(3,'r.bragadheesh834@gmail.com','$2a$10$gLDqhUlZeRMQu1NxkSsQ.u7j4r8Ytl1b87nSICBYj5ZWD0ccYsGby','CUSTOMER','BragadheeshR');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-11 11:59:14
