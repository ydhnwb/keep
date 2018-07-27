-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2018 at 10:14 AM
-- Server version: 10.1.33-MariaDB
-- PHP Version: 7.2.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `maintenance`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail`
--

CREATE TABLE `detail` (
  `id` int(11) NOT NULL,
  `id_perangkat` int(11) NOT NULL,
  `id_part` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `detail`
--

INSERT INTO `detail` (`id`, `id_perangkat`, `id_part`, `status`, `timestamp`) VALUES
(1, 1, 3, 1, '2018-07-14 04:34:21'),
(2, 1, 5, 0, '2018-07-13 08:29:53'),
(3, 2, 4, 0, '2018-07-13 08:31:14'),
(4, 3, 6, 1, '2018-07-13 08:31:14'),
(5, 1, 1, 1, '2018-07-15 01:38:52'),
(6, 1, 3, 0, '2018-07-15 01:42:12'),
(7, 1, 5, 1, '2018-07-15 01:47:20'),
(16, 40, 16, 1, '2018-07-16 03:07:26'),
(17, 40, 17, 1, '2018-07-16 03:11:33'),
(18, 40, 18, 1, '2018-07-16 03:15:49'),
(19, 2, 3, 1, '2018-07-16 07:12:18'),
(20, 1, 19, 1, '2018-07-17 05:10:51'),
(21, 2, 4, 0, '2018-07-17 05:24:48'),
(22, 2, 3, 0, '2018-07-17 05:24:48'),
(23, 2, 4, 0, '2018-07-17 06:24:38'),
(24, 2, 3, 1, '2018-07-17 06:24:38'),
(25, 2, 4, 1, '2018-07-17 06:25:53'),
(26, 2, 3, 1, '2018-07-17 06:25:53'),
(27, 2, 3, 1, '2018-07-17 06:26:39'),
(28, 2, 4, 0, '2018-07-17 06:26:39'),
(29, 2, 4, 1, '2018-07-17 06:31:18'),
(30, 2, 3, 1, '2018-07-17 06:31:18'),
(31, 1, 1, 1, '2018-07-17 06:50:31'),
(32, 1, 5, 1, '2018-07-17 06:50:31'),
(33, 1, 19, 0, '2018-07-17 06:50:31'),
(34, 1, 19, 0, '2018-07-17 06:52:25'),
(35, 1, 5, 1, '2018-07-17 06:52:25'),
(36, 1, 1, 0, '2018-07-17 06:52:25'),
(37, 198, 20, 1, '2018-07-17 06:53:46'),
(38, 198, 20, 0, '2018-07-17 06:53:50');

-- --------------------------------------------------------

--
-- Table structure for table `part`
--

CREATE TABLE `part` (
  `id` int(11) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `kategori` enum('pc','cctv') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `part`
--

INSERT INTO `part` (`id`, `nama`, `kategori`) VALUES
(1, 'RAM', 'pc'),
(2, 'Harddisk', 'pc'),
(3, 'Camera', 'cctv'),
(4, 'Harddisk Eksternal', 'pc'),
(5, 'Keyboard', 'pc'),
(6, 'Speaker', 'pc'),
(8, 'RAM', 'pc'),
(9, 'RAM', 'pc'),
(10, 'Ram', 'cctv'),
(11, 'Ram', 'pc'),
(12, 'Motherboard', 'pc'),
(13, 'Camera', 'cctv'),
(14, 'Cameraku', 'cctv'),
(15, 'Gt', ''),
(16, 'Windows 7', 'pc'),
(17, 'RAM', 'pc'),
(18, 'Camera', 'cctv'),
(19, 'Ggv', 'pc'),
(20, 'Laptop', 'pc');

-- --------------------------------------------------------

--
-- Table structure for table `perangkat`
--

CREATE TABLE `perangkat` (
  `id` int(11) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `deskripsi` varchar(100) NOT NULL,
  `area` varchar(20) NOT NULL,
  `lokasi` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `perangkat`
--

INSERT INTO `perangkat` (`id`, `nama`, `deskripsi`, `area`, `lokasi`) VALUES
(1, 'PC Yudha 001', 'Lorem ipsum dolor sir amet consectuer', 'COB001', 'Lorem'),
(2, 'PC Hanan 001', 'Lorem ipsum dolor sir amet consectuer', 'COB002', 'Ipsum'),
(3, 'PC Abu 003', 'Lorem ipsum dolor sir amet consectuer', 'CAT008', 'Dolor'),
(4, 'PC Jen 023', 'Lorem ipsum dolor sir amet consectuer', 'OBP', 'Sit amet'),
(10, 'PC Jennifer', 'Lorem ipsum dolor sir amet', 'COB04', 'LKS20'),
(40, 'PC James', 'Lorem ipsum dolor sir met', 'CGB001', 'LKS09'),
(198, 'PC Nidiya', 'Lorem ipsum dolor sit amet', 'CGK09', 'LKS555');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail`
--
ALTER TABLE `detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_perangkat` (`id_perangkat`),
  ADD KEY `fk_part` (`id_part`);

--
-- Indexes for table `part`
--
ALTER TABLE `part`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `perangkat`
--
ALTER TABLE `perangkat`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail`
--
ALTER TABLE `detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `part`
--
ALTER TABLE `part`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `perangkat`
--
ALTER TABLE `perangkat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=199;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail`
--
ALTER TABLE `detail`
  ADD CONSTRAINT `fk_part` FOREIGN KEY (`id_part`) REFERENCES `part` (`id`),
  ADD CONSTRAINT `fk_perangkat` FOREIGN KEY (`id_perangkat`) REFERENCES `perangkat` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
