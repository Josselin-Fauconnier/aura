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
require_once "../provider_validation.php";

header("Content-Type: application/json; charset=UTF-8");


switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $requestData = $_POST;
        provider_register($requestData);
        break;
    case 'OPTIONS':
        echo json_encode(["message" => "OPTIONS"]);
        http_response_code(200);
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400); // BAD REQUEST
        break;
}


function provider_register(array $requestData): void
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
        $sql = "INSERT INTO service_providers (name, firstname, email, password, phone_number, address, profile_picture, education_experience, subscriber, sex, SIREN, additional_information, statut) VALUES (:name, :firstname, :email, :password, :phone_number, :address, :profile_picture, :education_experience, :subscriber, :sex, :SIREN, :additional_info, :statut);";
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute([
            ":name" => $requestData["name"],
            ":firstname" => $requestData["firstname"],
            ":email" => $requestData["email"],
            ":password" => $requestData["password"],
            ":phone_number" => $requestData["phone_number"],
            ":address" => $requestData["address"] ?? "",
            ":profile_picture" => $requestData["profile_picture"] ?? "",
            ":education_experience" => $requestData["education_experience"] ?? "",
            ":subscriber" => "none",
            ":sex" => $requestData["sex"] ?? "Autre",
            ":SIREN" => $requestData["SIREN"],
            ":additional_info" => $requestData["additional_information"] ?? "",
            ":statut" => $requestData["statut"]
        ]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }
    echo json_encode(["message" => "Service provider succesfully created"]);
}
