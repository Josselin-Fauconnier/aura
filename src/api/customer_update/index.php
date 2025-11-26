<?php

/**
 * METHODS: POST, OPTIONS
 * 
 * -- POST: MODIFICATION DONNEES CLIENT
 * PARAMS: id_customer, ?email, ?password, ?firstname, ?name, ?address, ?phone_number, ?sex, ?additional_information
 * AUTH: token matching id_customer OR admin token
 * RETURN: message
 * 
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
        customer_update($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400); // BAD REQUEST
        break;
}

function build_update_query(array $requestData): array
{
    $res = array();
    $fields = "";
    $execute = array();
    foreach ($requestData as $key => $value) {
        if (in_array($key, ["name", "firstname", "email", "phone_number", "address", "sex", "password", "additional_information"])) {
            $fields .= $key . " = :" . $key . ", ";
            $execute[":" . $key] = $value;
        }
    }
    if (strlen($fields) > 0)
        $fields = substr($fields, 0, strlen($fields) - 2);
    $execute[":id"] = intval($requestData["id_customer"]);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}

function customer_update(array $requestData): void
{
    //print_r($requestData);
    $requestData = validate_input_update($requestData);
    $requestData = sanitize_input($requestData);

    if (!isset($requestData["id_customer"])) {
        echo json_encode(["message" => "No id_customer provided"]);
        http_response_code(400); // BAD REQUEST?
        return;
    }

    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"][0]]);
        http_response_code(400); // BAD REQUEST?
        return;
    }

    if (isset($requestData["password"]))
        $requestData["password"] = password_hash($requestData["password"], PASSWORD_DEFAULT);

    $conn = Connection::getConnection();

    try {
        /*  print_r($requestData); */
        $build = build_update_query($requestData);
        if (strlen($build["fields"]) === 0) {
            echo json_encode(["message" => "No updates made"]);
            http_response_code(400);
            return;
        }

        $sql = "UPDATE customers SET " . $build["fields"] . " WHERE id_customer=:id;";
        /* echo ($sql);
        print_r($build["execute"]); */
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute($build["execute"]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }
    echo json_encode(["message" => "Customer succesfully updated"]);
}
