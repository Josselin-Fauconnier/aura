<?php

declare(strict_types=1);

class Connection
{
    private static ?pdo $conn = null;

    public static function getConnection(): pdo | null
    {
        if (self::$conn === null) {
            try {
                self::$conn = new PDO("mysql:host=localhost;dbname=aura;port=3306;charset=UTF8", "root", "");
                return self::$conn;
            } catch (PDOException $e) {
                echo $e->getMessage();
                return null;
            }
        } else
            return self::$conn;
    }
}
