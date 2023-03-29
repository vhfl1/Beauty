-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        8.0.30 - MySQL Community Server - GPL
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- beauty 데이터베이스 구조 내보내기
DROP DATABASE IF EXISTS `beauty`;
CREATE DATABASE IF NOT EXISTS `beauty` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `beauty`;

-- 테이블 beauty.board 구조 내보내기
DROP TABLE IF EXISTS `board`;
CREATE TABLE IF NOT EXISTS `board` (
  `no` int NOT NULL AUTO_INCREMENT,
  `group` varchar(45) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `rdate` datetime DEFAULT NULL,
  `hit` int DEFAULT NULL,
  `parent` int DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `comment` int DEFAULT NULL,
  PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 테이블 데이터 beauty.board:~0 rows (대략적) 내보내기

-- 테이블 beauty.cart 구조 내보내기
DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cartNo` int NOT NULL AUTO_INCREMENT,
  `prodNo` int NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `count` int DEFAULT NULL,
  `rdate` datetime DEFAULT NULL,
  PRIMARY KEY (`cartNo`),
  KEY `fk_Cart_Product1_idx` (`prodNo`),
  CONSTRAINT `fk_Cart_Product1` FOREIGN KEY (`prodNo`) REFERENCES `product` (`prodNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 테이블 데이터 beauty.cart:~0 rows (대략적) 내보내기

-- 테이블 beauty.member 구조 내보내기
DROP TABLE IF EXISTS `member`;
CREATE TABLE IF NOT EXISTS `member` (
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(5) NOT NULL,
  `level` char(1) NOT NULL DEFAULT '1',
  `point` int NOT NULL DEFAULT '0',
  `phone` varchar(20) DEFAULT NULL,
  `zip` varchar(45) DEFAULT NULL,
  `addr1` varchar(45) DEFAULT NULL,
  `addr2` varchar(45) DEFAULT NULL,
  `regip` varchar(45) NOT NULL,
  `rdate` varchar(45) NOT NULL,
  `height` varchar(45) DEFAULT NULL,
  `weight` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 테이블 데이터 beauty.member:~0 rows (대략적) 내보내기

-- 테이블 beauty.order 구조 내보내기
DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `ordNo` int NOT NULL,
  `prodNo` int NOT NULL,
  `count` int NOT NULL,
  `price` int NOT NULL,
  `discount` int DEFAULT NULL,
  `disPrice` int DEFAULT NULL,
  `point` int DEFAULT '0',
  `delivery` int DEFAULT '0',
  `total` int NOT NULL,
  PRIMARY KEY (`ordNo`),
  KEY `fk_Order_Product1_idx` (`prodNo`),
  KEY `fk_Order_OrderComplete1_idx` (`ordNo`),
  CONSTRAINT `fk_Order_OrderComplete1` FOREIGN KEY (`ordNo`) REFERENCES `ordercomplete` (`ordNo`),
  CONSTRAINT `fk_Order_Product1` FOREIGN KEY (`prodNo`) REFERENCES `product` (`prodNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 테이블 데이터 beauty.order:~0 rows (대략적) 내보내기

-- 테이블 beauty.ordercomplete 구조 내보내기
DROP TABLE IF EXISTS `ordercomplete`;
CREATE TABLE IF NOT EXISTS `ordercomplete` (
  `ordNo` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `ordCount` int NOT NULL,
  `ordPrice` int NOT NULL,
  `ordDisprice` int DEFAULT NULL,
  `ordDelivery` int DEFAULT NULL,
  `savePoint` int DEFAULT '0',
  `usedPoint` int DEFAULT '0',
  `total` int NOT NULL,
  `recipName` char(5) DEFAULT NULL,
  `recipZip` varchar(45) DEFAULT NULL,
  `recipAddr1` varchar(255) DEFAULT NULL,
  `recipAddr2` varchar(255) DEFAULT NULL,
  `payment` char(1) DEFAULT NULL,
  `ordComplete` char(10) DEFAULT NULL,
  `ordDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ordNo`),
  KEY `fk_OrderComplete_Member1_idx` (`email`),
  CONSTRAINT `fk_OrderComplete_Member1` FOREIGN KEY (`email`) REFERENCES `member` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 테이블 데이터 beauty.ordercomplete:~0 rows (대략적) 내보내기

-- 테이블 beauty.product 구조 내보내기
DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `prodNo` int NOT NULL AUTO_INCREMENT,
  `prodName` varchar(255) NOT NULL,
  `descript` varchar(255) NOT NULL,
  `prodCate1` varchar(45) NOT NULL,
  `prodCate2` varchar(45) NOT NULL,
  `price` int NOT NULL,
  `discount` int DEFAULT NULL,
  `disPrice` int DEFAULT NULL,
  `point` int DEFAULT '0',
  `stock` int DEFAULT '0',
  `sold` int DEFAULT '0',
  `delivery` int DEFAULT '0',
  `hit` int DEFAULT '0',
  `score` int DEFAULT '0',
  `review` int DEFAULT '0',
  `thumb1` varchar(255) DEFAULT NULL,
  `thumb2` varchar(255) DEFAULT NULL,
  `thumb3` varchar(255) DEFAULT NULL,
  `thumb4` varchar(255) DEFAULT NULL,
  `thumb5` varchar(255) DEFAULT NULL,
  `thumb6` varchar(255) DEFAULT NULL,
  `detail1` varchar(255) DEFAULT NULL,
  `detail2` varchar(255) DEFAULT NULL,
  `detail3` varchar(255) DEFAULT NULL,
  `company` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `origin` varchar(45) DEFAULT NULL,
  `thick` varchar(45) DEFAULT NULL,
  `flex` varchar(45) DEFAULT NULL,
  `through` varchar(45) DEFAULT NULL,
  `lining` varchar(45) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `size` varchar(45) DEFAULT NULL,
  `rdate` datetime DEFAULT NULL,
  PRIMARY KEY (`prodNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 테이블 데이터 beauty.product:~0 rows (대략적) 내보내기

-- 테이블 beauty.reply 구조 내보내기
DROP TABLE IF EXISTS `reply`;
CREATE TABLE IF NOT EXISTS `reply` (
  `no` int NOT NULL AUTO_INCREMENT,
  `prodNo` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `weight` int DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `size` varchar(45) DEFAULT NULL,
  `thumb1` varchar(255) DEFAULT NULL,
  `rdate` datetime DEFAULT NULL,
  PRIMARY KEY (`no`),
  KEY `fk_Reply_Product1_idx` (`prodNo`),
  CONSTRAINT `fk_Reply_Product1` FOREIGN KEY (`prodNo`) REFERENCES `product` (`prodNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 테이블 데이터 beauty.reply:~0 rows (대략적) 내보내기

-- 테이블 beauty.wish 구조 내보내기
DROP TABLE IF EXISTS `wish`;
CREATE TABLE IF NOT EXISTS `wish` (
  `wishNo` int NOT NULL AUTO_INCREMENT,
  `prodNo` int NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `count` int DEFAULT NULL,
  `rdate` datetime DEFAULT NULL,
  PRIMARY KEY (`wishNo`),
  KEY `fk_Wish_Product_idx` (`prodNo`),
  CONSTRAINT `fk_Wish_Product` FOREIGN KEY (`prodNo`) REFERENCES `product` (`prodNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 테이블 데이터 beauty.wish:~0 rows (대략적) 내보내기

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
