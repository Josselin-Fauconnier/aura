<?php

/**
 * METHODS: POST, DELETE, OPTIONS
 * 
 * -- POST: RECUPERATION DONNEES CLIENT
 * PARAMS : email OR id_customer
 * AUTH: token matching id_customer OR admin token
 * RETURN: id_customer, email, firstname, name, address, phone_number, sex, additional_information, crated_at, updated_at
 * 
 * 
 * -- DELETE: SUPPRIMER CLIENT
 * PARAMS: id_customer OR email
 * AUTH: token matching id_customer OR admin token
 * RETURN: message
 */


declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";
require_once "../customer_validation.php";

header("Content-Type: application/json; charset=UTF-8");

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $requestData = $_POST;
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"]; //ICI ON MET LE TOKEN
        }
        customer_get($requestData);
        break;
    case 'DELETE':
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"]; //ICI ON MET LE TOKEN
        }
        customer_delete();
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400); // BAD REQUEST
        break;
}

function customer_get(array $requestData): void
{

    if (!(isset($requestData["id_customer"]) || isset($requestData["email"]))) {
        echo json_encode(["message" => "ID or email not provided"]);
        http_response_code(400);
        return;
    }

    $conn = Connection::getConnection();

    try {
        if (isset($requestData["id_customer"])) {
            $sql = "SELECT * FROM customers WHERE id_customer=:id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":id" => $requestData["id_customer"]
            ]);
        } else {
            $sql = "SELECT * FROM customers WHERE email=:email";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":email" => $requestData["email"]
            ]);
        }
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // echo $e->getMessage();
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "User not found"]);
        http_response_code(500);
        return;
    }

    if ($res["id_customer"] === $requestData["id"] || $res["email"] === $requestData["email"])
        $access = check_token($requestData["token"], $res["id_customer"]);
    if ($access) {
        echo json_encode($res);
        http_response_code(200);
    } else {
        echo json_encode(["message" => "Access forbidden"]);
        http_response_code(403);
    }
}

function customer_delete(): void
{
    $url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    echo $url;
}
