<?php

/**
 * METHODS: POST, OPTIONS
 * 
 * 
 * -- POST: INSCRIPTION CLIENT
 * PARAMS: email, password, firstname, name, address, phone_number, sex, additional_information
 * AUTH: none
 * RETURN: message
 * 
 */

declare(strict_types=1);

require_once "../connection.php";
require_once "../customer_validation.php";

header("Content-Type: application/json; charset=UTF-8");


switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $requestData = $_POST;
        customer_register($requestData);
        break;
    case 'OPTIONS':
        echo json_encode(["message" => "OPTIONS"]);
        http_response_code(200);
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400); // BAD REQUEST
        break;
}


function customer_register(array $requestData): void
{
    $requestData = validate_input_register($requestData);
    $requestData = sanitize_input($requestData);

    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"][0]]);
        http_response_code(400); // BAD REQUEST?
        return;
    }

    $requestData["password"] = password_hash($requestData["password"], PASSWORD_DEFAULT);

    $conn = Connection::getConnection();

    try {
        $sql = "INSERT INTO customers (name, firstname, email, password, phone_number, address, sexe, additional_information) VALUES (:name, :firstname, :email, :password, :phone_number, :address, :sex, :additional_info);";
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute([
            ":name" => $requestData["name"],
            ":firstname" => $requestData["firstname"],
            ":email" => $requestData["email"],
            ":password" => $requestData["password"],
            ":phone_number" => $requestData["phone_number"],
            ":address" => $requestData["address"] ?? "",
            ":sex" => $requestData["sex"] ?? "M",
            ":additional_info" => $requestData["additional_info"] ?? ""
        ]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }
    echo json_encode(["message" => "Customer succesfully created"]);
}
