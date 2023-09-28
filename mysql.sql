CREATE SCHEMA `carpark` ;

CREATE TABLE `carpark`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  `balance` INT NOT NULL DEFAULT 100,
  `passwordToken` VARCHAR(200) NULL DEFAULT NULL,
  `passwordTokenExpirationDate` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);


CREATE TABLE `carpark`.`cars` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL,
  `carName` VARCHAR(45) NOT NULL,
  `carNumber` VARCHAR(45) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `carUserId_idx` (`userId` ASC) VISIBLE,
  CONSTRAINT `carUserId`
    FOREIGN KEY (`userId`)
    REFERENCES `carpark`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE TABLE `carpark`.`parkingspaces` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `price` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE);

CREATE TABLE `carpark`.`bookparking` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parkingId` INT UNSIGNED NOT NULL,
  `userId` INT UNSIGNED NOT NULL,
  `carId` INT UNSIGNED NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `finishingAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `bookCarId_idx` (`carId` ASC) VISIBLE,
  INDEX `bookParkingId_idx` (`parkingId` ASC) VISIBLE,
  INDEX `bookUserId_idx` (`userId` ASC) VISIBLE,
  CONSTRAINT `bookCarId`
    FOREIGN KEY (`carId`)
    REFERENCES `carpark`.`cars` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `bookParkingId`
    FOREIGN KEY (`parkingId`)
    REFERENCES `carpark`.`parkingspaces` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `bookUserId`
    FOREIGN KEY (`userId`)
    REFERENCES `carpark`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);