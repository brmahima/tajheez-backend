-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: 06 سبتمبر 2024 الساعة 21:23
-- إصدار الخادم: 10.11.7-MariaDB-cll-lve
-- PHP Version: 8.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tajheez`
--
CREATE DATABASE IF NOT EXISTS `tajheez` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci;
USE `tajheez`;

-- --------------------------------------------------------

--
-- بنية الجدول `Ads`
--

CREATE TABLE IF NOT EXISTS `Ads` (
  `ad_id` int(255) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `product_status` varchar(50) DEFAULT NULL,
  `offer_type` varchar(50) DEFAULT NULL,
  `shipping_delivery_options` varchar(255) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `post_type` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT current_timestamp(),
  `expiration_date` timestamp NULL DEFAULT current_timestamp(),
  `country` varchar(255) DEFAULT NULL,
  `contact_options` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`ad_id`),
  KEY `Ads_useridfk` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `Ads`
--

INSERT INTO `Ads` (`ad_id`, `user_id`, `category_id`, `title`, `description`, `price`, `product_status`, `offer_type`, `shipping_delivery_options`, `images`, `post_type`, `status`, `creation_date`, `expiration_date`, `country`, `contact_options`) VALUES
(16, '3', '1', 'title1', 'jakhckjashkjdsa', 50.00, 'new', 'sale', 'International Delivery', '[\"uploads/1722692539449.png\",\"uploads/1722692539449.png\"]', 'Standard', 'active', '2024-08-03 13:42:19', '2024-09-02 13:42:19', 'egypt', '[\"phone\",\"email\"]'),
(19, '6', '2', 'New Wedding Dresses', 'Never used wedding  dresses with unique designs', 44.00, 'Used', 'Sale', 'Local Delivery', '[\"uploads/1722781143755.jpg\",\"uploads/1722781143790.png\",\"uploads/1722781143800.png\"]', 'Standard', 'active', '2024-08-04 14:19:03', '2024-09-03 14:19:03', 'egypt', '[\"phone\",\"email\"]'),
(21, '2', '2', 'test1', 'hgjg', 244.00, 'Used', 'Sale', 'International Delivery', '[\"uploads/1724072177999.jpg\",\"uploads/1724072178030.jpg\"]', 'Standard', 'active', '2024-08-19 12:56:18', '2024-09-18 12:56:18', 'egypt', '[\"phone\",\"email\"]'),
(22, '2', '1', 'test2', 'sdcds', 20.00, 'Used', 'Rent', 'International Delivery', '[\"uploads/1724072822739.jpg\",\"uploads/1724072822824.jpg\"]', 'Standard', 'active', '2024-08-19 13:07:02', '2024-09-18 13:07:02', 'egypt', '[\"phone\",\"email\"]'),
(23, '2', '1', 'test2', 'sdcds', 20.00, 'Used', 'Rent', 'International Delivery', '[\"uploads/1724073073435.jpg\",\"uploads/1724073073507.jpg\"]', 'Standard', 'active', '2024-08-19 13:11:13', '2024-09-18 13:11:13', 'egypt', '[\"phone\",\"email\"]'),
(37, '2', '2', 'last test', 'jfdjk', 100.00, 'Used', 'Sale', 'Local Delivery', '[\"uploads/1724076230857.jpg\",\"uploads/1724076230878.jpg\"]', 'Standard', 'active', '2024-08-19 14:03:50', '2024-09-18 14:03:50', 'egypt', '[\"phone\",\"email\"]'),
(40, '3\r\n', '2', 'title 1', 'hghjghj', 100.00, 'New', 'Sale', 'Local Delivery', '[\"uploads/1724145953794.jpg\",\"uploads/1724145953806.jpg\"]', 'Standard', 'active', '2024-08-20 09:25:53', '2024-09-19 09:25:53', 'egypt', '[\"phone\",\"email\"]'),
(41, '2', '1', 'new from ibrahim2', 'asdsa', 259.00, 'New', 'Sale', 'Local Delivery', '[\"uploads/1725354184380.jpg\",\"uploads/1725354184399.jpg\"]', 'Standard', 'active', '2024-09-03 09:03:04', '2024-10-03 09:03:04', 'Egypt', '\"{\\\"email\\\":\\\"inabeel76@gmail.com\\\",\\\"whatsapp\\\":\\\"201148784074\\\",\\\"phone_number\\\":\\\"+201148784074\\\"}\"'),
(42, '23', '1', 'new from ibrahim2', 'asdsa', 259.00, 'New', 'Sale', 'Local Delivery', '[\"uploads/1725354267366.jpg\",\"uploads/1725354267378.jpg\"]', 'Standard', 'active', '2024-09-03 09:04:27', '2024-10-03 09:04:27', 'Egypt', '\"{\\\"email\\\":\\\"inabeel76@gmail.com\\\",\\\"whatsapp\\\":\\\"201148784074\\\",\\\"phone_number\\\":\\\"+201148784074\\\"}\"');

-- --------------------------------------------------------

--
-- بنية الجدول `AdTranslations`
--

CREATE TABLE IF NOT EXISTS `AdTranslations` (
  `translation_id` int(11) NOT NULL AUTO_INCREMENT,
  `ad_id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `product_status` varchar(50) DEFAULT NULL,
  `offer_type` varchar(50) DEFAULT NULL,
  `shipping_delivery_options` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`translation_id`),
  UNIQUE KEY `ad_id` (`ad_id`,`language_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `AdTranslations`
--

INSERT INTO `AdTranslations` (`translation_id`, `ad_id`, `language_code`, `title`, `description`, `product_status`, `offer_type`, `shipping_delivery_options`) VALUES
(1, 19, 'ar', 'عنوان الإعلان بالعربية', 'وصف الإعلان باللغة العربية', 'بيع', 'مستخدم', 'شحن متوفر');

-- --------------------------------------------------------

--
-- بنية الجدول `Attributes`
--

CREATE TABLE IF NOT EXISTS `Attributes` (
  `attribute_id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `validation_rules` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`validation_rules`)),
  `categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`categories`)),
  PRIMARY KEY (`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `Attributes`
--

INSERT INTO `Attributes` (`attribute_id`, `name`, `type`, `validation_rules`, `categories`) VALUES
(1, 'Color', 'DropDown', '{\"required\": true, \"options\": [\"White\", \"Grey\", \"Black\"]}', '[\"1\", 2, 3]'),
(2, 'Size', 'DropDown', '{\"required\": true, \"options\": [\"Small\", \"Medium\", \"Large\"]}', '[\"1\", 4]'),
(3, 'Release Date', 'Date', '{\"required\": true, \"format\": \"YYYY-MM-DD\"}', '[2, 3, 5]');

-- --------------------------------------------------------

--
-- بنية الجدول `AttributeTranslations`
--

CREATE TABLE IF NOT EXISTS `AttributeTranslations` (
  `translation_id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `translated_name` varchar(255) NOT NULL,
  PRIMARY KEY (`translation_id`),
  UNIQUE KEY `attribute_id` (`attribute_id`,`language_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `AttributeTranslations`
--

INSERT INTO `AttributeTranslations` (`translation_id`, `attribute_id`, `language_code`, `translated_name`) VALUES
(1, 1, 'ar', 'لون'),
(2, 2, 'ar', 'حجم'),
(3, 3, 'ar', 'تاريخ الإصدار');

-- --------------------------------------------------------

--
-- بنية الجدول `AttributeValues`
--

CREATE TABLE IF NOT EXISTS `AttributeValues` (
  `value_id` int(255) NOT NULL AUTO_INCREMENT,
  `ad_id` int(255) DEFAULT NULL,
  `attribute_id` int(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`value_id`),
  KEY `fk1` (`ad_id`),
  KEY `fk2` (`attribute_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `AttributeValues`
--

INSERT INTO `AttributeValues` (`value_id`, `ad_id`, `attribute_id`, `value`) VALUES
(7, 40, 1, 'White'),
(8, 40, 3, '2024-08-20 00:00:00.000'),
(9, 41, 1, 'Grey'),
(10, 41, 2, 'Medium'),
(11, 42, 1, 'Grey'),
(12, 42, 2, 'Medium');

-- --------------------------------------------------------

--
-- بنية الجدول `Categories`
--

CREATE TABLE IF NOT EXISTS `Categories` (
  `category_id` int(255) NOT NULL AUTO_INCREMENT,
  `parent_category_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `homepage` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`category_id`),
  KEY `cat_peridfk` (`parent_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `Categories`
--

INSERT INTO `Categories` (`category_id`, `parent_category_id`, `name`, `description`, `image`, `homepage`) VALUES
(1, NULL, 'Dress', 'Description for category one', '/uploads/dress.png', 1),
(2, '1', 'Wedding Halls', 'Description for category two', '/uploads/hall.png', 1),
(3, NULL, 'Giveaways', 'Description for category three', '/uploads/gift-box.png', 0),
(10, NULL, 'Hosiptality Sevices', 'Description for category one', '/uploads/employee.png', 0),
(11, NULL, 'Photography Services ', 'Description for category two', '/uploads/camera.png', 0),
(12, NULL, 'Beauty Salons', 'Description for category three', '/uploads/hair-salon.png', 0),
(13, NULL, 'DJ & Bands', 'Description for category three', '/uploads/singing.png', 0);

-- --------------------------------------------------------

--
-- بنية الجدول `CategoryTranslations`
--

CREATE TABLE IF NOT EXISTS `CategoryTranslations` (
  `translation_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(255) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `translated_name` varchar(255) NOT NULL,
  PRIMARY KEY (`translation_id`),
  UNIQUE KEY `category_id` (`category_id`,`language_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `CategoryTranslations`
--

INSERT INTO `CategoryTranslations` (`translation_id`, `category_id`, `language_code`, `translated_name`) VALUES
(1, 1, 'ar', 'فستان'),
(2, 2, 'ar', 'قاعات الزفاف'),
(3, 3, 'ar', 'هدايا'),
(4, 10, 'ar', 'خدمات الضيافة'),
(5, 11, 'ar', 'خدمات التصوير'),
(6, 12, 'ar', 'صالونات التجميل'),
(7, 13, 'ar', 'الدي جي والفرق الموسيقية');

-- --------------------------------------------------------

--
-- بنية الجدول `Interactions`
--

CREATE TABLE IF NOT EXISTS `Interactions` (
  `interaction_id` int(255) NOT NULL AUTO_INCREMENT,
  `ad_id` int(255) DEFAULT NULL,
  `user_id` int(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`interaction_id`),
  KEY `ant_user_fk` (`user_id`),
  KEY `ant_ad_fk` (`ad_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `Interactions`
--

INSERT INTO `Interactions` (`interaction_id`, `ad_id`, `user_id`, `type`, `timestamp`) VALUES
(12, 19, 3, 'favorite', '2024-09-01 15:14:53'),
(13, 19, 3, 'like', '2024-09-01 15:14:56'),
(14, 21, 3, 'favorite', '2024-09-01 15:57:07'),
(15, 21, 3, 'like', '2024-09-01 15:57:22'),
(16, 42, 20, 'like', '2024-09-03 12:12:33'),
(17, 42, 20, 'favorite', '2024-09-03 12:12:37'),
(18, 19, 20, 'favorite', '2024-09-03 13:01:42'),
(19, 42, 24, 'like', '2024-09-04 13:25:18'),
(20, 42, 24, 'favorite', '2024-09-04 13:25:27');

-- --------------------------------------------------------

--
-- بنية الجدول `Messages`
--

CREATE TABLE IF NOT EXISTS `Messages` (
  `message_id` int(255) NOT NULL AUTO_INCREMENT,
  `ad_id` int(255) DEFAULT NULL,
  `sender_id` int(255) DEFAULT NULL,
  `receiver_id` int(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`message_id`),
  KEY `Mes_userRec` (`receiver_id`),
  KEY `Mes_userSen` (`sender_id`),
  KEY `Mes_adsId` (`ad_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `Messages`
--

INSERT INTO `Messages` (`message_id`, `ad_id`, `sender_id`, `receiver_id`, `content`, `timestamp`) VALUES
(3, 16, 6, 3, 'Can I see more pictures?', '2024-08-17 08:32:36'),
(4, 40, 3, 6, 'I am interested in buying this.', '2024-08-17 08:33:36'),
(5, 16, 3, 6, 'What is your best price?', '2024-08-17 08:34:36'),
(6, 19, 3, 6, 'test1', '2024-08-20 13:05:39'),
(7, 16, 6, 3, 'test2', '2024-08-20 13:05:39'),
(25, 16, 3, 6, '1', '2024-08-21 12:15:54'),
(26, 19, 6, 3, 'hi', '2024-08-21 15:05:14'),
(29, 19, 3, 6, 'hello', '2024-08-24 13:50:21'),
(31, 40, 3, 6, 'sds', '2024-08-28 23:10:57'),
(32, 19, 3, 6, 'ss', '2024-08-28 23:11:22'),
(33, 19, 3, 6, 'sd', '2024-08-28 23:11:36'),
(34, 40, 3, 6, 's', '2024-08-28 23:13:01'),
(35, 19, 3, 6, 's', '2024-08-28 23:13:15'),
(36, 19, 3, 6, 'dfd', '2024-08-28 23:19:20'),
(37, 40, 3, 6, 'd', '2024-08-28 23:19:34'),
(38, 16, 3, 6, 'd', '2024-08-28 23:19:48'),
(39, 16, 3, 6, 'd', '2024-08-28 23:20:09'),
(40, 16, 3, 6, 's', '2024-08-28 23:21:37'),
(41, 16, 3, 6, 'd', '2024-08-28 23:21:43'),
(42, 19, 3, 6, 'd', '2024-08-28 23:21:55'),
(43, 40, 3, 6, 'e', '2024-08-28 23:22:12'),
(44, 19, 3, 6, 'dscs', '2024-08-28 23:22:29'),
(45, 40, 3, 6, 'gh', '2024-09-01 15:57:45'),
(46, 42, 20, 23, 'hi brma', '2024-09-03 12:14:15'),
(47, 42, 24, 23, 'Hello', '2024-09-04 13:27:23'),
(48, 42, 24, 23, 'I need some details', '2024-09-04 13:28:39');

-- --------------------------------------------------------

--
-- بنية الجدول `Notifications`
--

CREATE TABLE IF NOT EXISTS `Notifications` (
  `notification_id` varchar(255) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `open` tinyint(1) DEFAULT 0,
  `timestamp` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `TokenPackage`
--

CREATE TABLE IF NOT EXISTS `TokenPackage` (
  `package_id` int(11) NOT NULL AUTO_INCREMENT,
  `token_type` varchar(255) NOT NULL,
  `package_name` varchar(255) NOT NULL,
  `price` varchar(25) NOT NULL,
  PRIMARY KEY (`package_id`),
  KEY `pt_fk` (`token_type`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `TokenPackage`
--

INSERT INTO `TokenPackage` (`package_id`, `token_type`, `package_name`, `price`) VALUES
(1, 'standard', 'single', '10.00'),
(2, 'standard', '2 tokens', '18.00'),
(3, 'standard', '4 tokens', '32.00'),
(4, 'featured', 'single', '15.00'),
(5, 'featured', '2 tokens', '28.00'),
(6, 'featured', '4 tokens', '50.00');

-- --------------------------------------------------------

--
-- بنية الجدول `Tokens`
--

CREATE TABLE IF NOT EXISTS `Tokens` (
  `token_id` int(255) NOT NULL AUTO_INCREMENT,
  `user_id` int(255) DEFAULT NULL,
  `token_type` varchar(50) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `transaction_date` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`token_id`),
  KEY `tu_fk` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `Transactions`
--

CREATE TABLE IF NOT EXISTS `Transactions` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `total_price` varchar(255) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`transaction_id`),
  KEY `ut_fk` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `Users`
--

CREATE TABLE IF NOT EXISTS `Users` (
  `user_id` int(255) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `registration_date` timestamp NULL DEFAULT current_timestamp(),
  `tokens_standard` int(11) DEFAULT 0,
  `tokens_featured` int(11) DEFAULT 0,
  `role` varchar(50) DEFAULT 'user',
  `firebase_UID` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `Users`
--

INSERT INTO `Users` (`user_id`, `email`, `phone_number`, `password`, `name`, `profile_picture`, `country`, `registration_date`, `tokens_standard`, `tokens_featured`, `role`, `firebase_UID`) VALUES
(3, 'ibrahim@elaaf.net', '123456', '$2b$10$q02DERkcYwmOIGdEqEC5Q.xduKdlQpb6axgFm6quH/txNceUmeb7i', 'ibrahim nabeel', NULL, '', '2024-07-29 23:11:37', 0, 0, 'user', ''),
(6, 'aziz@elaaf.net', '+9 (733) 363-31-33', '$2b$10$vwCdr5rBZOcPrBXR.BqWUeuXg9wUVGPlY90ApKBXEkGKE3sd9Dq5e', 'Abdulaziz', NULL, 'egypt', '2024-07-30 13:25:52', 0, 0, 'user', ''),
(15, 'ibrahim.nabeel.sd@gmail.com', '+20114878407', '$2b$10$.TMIyCTwsqnZN6lSh4NNreOVNiiNnR3Ri2Rr0M9/64FBfOUan1VUm', 'ibrahim', NULL, 'egypt', '2024-08-29 14:18:32', 0, 0, 'user', ''),
(17, 'ksdlkjda', '12345672890', '$2b$10$gMrZuG3/4qBfdWTlNWSK6exSiVWww5h.LLQDT6MQSfXtqQg.q6DyO', 'ibrahim', NULL, 'CountryName', '2024-08-31 00:48:27', 0, 0, 'user', 'dskjlsvljksjdl'),
(20, 'inabeel76@gmail.com', '+201148784074', '$2b$10$dU4BQp8d2DHmwuaZkt4alugGN25izPg66LHaExGY4bPTP7oQw3ERO', 'ibrahim', NULL, 'Egypt', '2024-08-31 00:56:23', 0, 0, 'user', 'KCSs6dMFJwPNiV3n06Q7x1TXyk63'),
(22, 'ksdlkjdea', '1234s5672890', '$2b$10$.91xtqObb4VKf1ltFBtF6uNz24HJzi1dxs6y6DOIWoM5aZ9K23fGW', 'ibrahim', NULL, 'CountryName', '2024-09-01 09:44:27', 0, 0, 'user', 'dskjlsvljksjdl'),
(23, 'true', ' ', '$2b$10$tDGX2Yf4G5a6A6DoMujUEexZ736rtFq7wGK/ZdldWXXhKZ6ehas.K', 'ibrahim nabeel', NULL, ' ', '2024-09-01 09:52:42', 0, 0, 'user', 'EvEqK4svQHg82cFTqr4TM4srWet2'),
(24, 'aziz.almahmeed@gmail.com', ' ', '$2b$10$/IW1WaDz9EYCkmF3VpwhAO380o04R117COmYS0CTEJQHz511W9GUq', 'A.Aziz Al-Mahmeed', NULL, ' ', '2024-09-04 13:14:06', 0, 0, 'user', '5B0h5kkzMtcNp3MDBK5WDPFyfBt1');

--
-- قيود الجداول المُلقاة.
--

--
-- قيود الجداول `AdTranslations`
--
ALTER TABLE `AdTranslations`
  ADD CONSTRAINT `AdTranslations_ibfk_1` FOREIGN KEY (`ad_id`) REFERENCES `Ads` (`ad_id`);

--
-- قيود الجداول `AttributeTranslations`
--
ALTER TABLE `AttributeTranslations`
  ADD CONSTRAINT `AttributeTranslations_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `Attributes` (`attribute_id`);

--
-- قيود الجداول `AttributeValues`
--
ALTER TABLE `AttributeValues`
  ADD CONSTRAINT `fk1` FOREIGN KEY (`ad_id`) REFERENCES `Ads` (`ad_id`),
  ADD CONSTRAINT `fk2` FOREIGN KEY (`attribute_id`) REFERENCES `Attributes` (`attribute_id`);

--
-- قيود الجداول `CategoryTranslations`
--
ALTER TABLE `CategoryTranslations`
  ADD CONSTRAINT `CategoryTranslations_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`);

--
-- قيود الجداول `Interactions`
--
ALTER TABLE `Interactions`
  ADD CONSTRAINT `ant_ad_fk` FOREIGN KEY (`ad_id`) REFERENCES `Ads` (`ad_id`),
  ADD CONSTRAINT `ant_user_fk` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

--
-- قيود الجداول `Messages`
--
ALTER TABLE `Messages`
  ADD CONSTRAINT `Mes_adsId` FOREIGN KEY (`ad_id`) REFERENCES `Ads` (`ad_id`),
  ADD CONSTRAINT `Mes_userRec` FOREIGN KEY (`receiver_id`) REFERENCES `Users` (`user_id`),
  ADD CONSTRAINT `Mes_userSen` FOREIGN KEY (`sender_id`) REFERENCES `Users` (`user_id`);

--
-- قيود الجداول `Tokens`
--
ALTER TABLE `Tokens`
  ADD CONSTRAINT `tu_fk` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

--
-- قيود الجداول `Transactions`
--
ALTER TABLE `Transactions`
  ADD CONSTRAINT `ut_fk` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
