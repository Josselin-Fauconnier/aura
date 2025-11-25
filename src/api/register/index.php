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


function validate_name(string $name): string
{
    if (!isset($name))
        return "Name is missing.";
    else if (ctype_alpha($name) === false)
        return "Name can only contain letters.";
    else if (strlen($name) <= 2)
        return "Name too short. (min 2 characters)";
    return "";
}

function validate_firstname(string $name): string
{
    if (!isset($name))
        return "Firstname is missing.";
    else if (ctype_alpha($name) === false)
        return "Firstname can only contain letters.";
    else if (strlen($name) <= 2)
        return "Firstname too short. (min 2 characters)";
    return "";
}

function validate_email(string $email): string
{
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
        return "Email is not valid";
    return "";
}

function validate_phone_number(string $phone_number): string
{
    if (!preg_match("/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/", $phone_number))
        return "Invalid phone number";
    return "";
}

function validate_sex(string $sex): string
{
    if ($sex !== "M" && $sex !== "F")
        return "Sex must be M or F";
    return "";
}

function validate_input(array $requestData): array
{
    $errors = array();
    if (!isset($requestData["name"]))
        array_push($errors, "Error: name is not set");
    elseif (($err = validate_name($requestData["name"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["firstname"]))
        array_push($errors, "Error: firstname is not set");
    elseif (($err = validate_firstname($requestData["firstname"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["email"]))
        array_push($errors, "Error: email is not set");
    elseif (($err = validate_email($requestData["email"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["phone_number"]))
        array_push($errors, "Error: phone number is not set");
    elseif (($err = validate_phone_number($requestData["phone_number"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["sex"]))
        array_push($errors, "Error: sex is not set");
    elseif (($err = validate_sex($requestData["sex"])) != "")
        array_push($errors, $err);
    $requestData["errors"] = $errors;
    return $requestData;
}

function customer_register(array $requestData): void
{
    $requestData = validate_input($requestData);

    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"]]);
        http_response_code(400); // BAD REQUEST?
        return;
    }

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
            ":address" => $requestData["address"],
            ":sex" => $requestData["sex"],
            ":additional_info" => $requestData["additional_info"]
        ]);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
    }
    echo json_encode(["message" => "Customer succesfully created"]);
}
