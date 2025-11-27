<?php

declare(strict_types=1);

/**
 * Fichier avec les fonctions necessaires pour manipuler les tokens de connexion à l'API
 */

require_once "connection.php";

function generate_token(): string
{
    $token = str_replace("=", "", base64_encode(random_bytes(160 / 8)));
    return $token;
}

function check_token(string $token, int $id = -1, bool $isAdmin = false): bool
{
    try {
        $conn = Connection::getConnection();
        
        $sql = "SELECT id_customer, admin FROM tokens WHERE token = :token";
        $stmt = $conn->prepare($sql);
        $stmt->execute([":token" => $token]);
        $tokenData = $stmt->fetch(PDO::FETCH_ASSOC);

        
        if (!$tokenData) {
            return false;
        }

        
        if ($isAdmin === true) {
            return (int)$tokenData["admin"] === 1;
        }

       
        if ($id !== -1) {
            return (int)$tokenData["id_customer"] === $id;
        }

        
        return true;

    } catch (PDOException $e) {
        
        return false;
    }
}

function add_token(string $token, int $id, bool $isAdmin = false): void
{
    try {
        $conn = Connection::getConnection();
        
        
        $sql = "INSERT IGNORE INTO tokens (token, id_customer, admin, created_at) 
                VALUES (:token, :id_customer, :admin, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":token" => $token,
            ":id_customer" => $id,
            ":admin" => $isAdmin ? 1 : 0
        ]);

    } catch (PDOException $e) {
        
    }
}