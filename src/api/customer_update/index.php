<?php

/**
 * METHODS: POST, PUT, DELETE, OPTIONS
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
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}

function customer_update(array $requestData): void
{
    var_dump($requestData);
    $requestData = validate_input_update($requestData);
    $requestData = sanitize_input($requestData);

    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"][0]]);
        http_response_code(400); // BAD REQUEST?
        return;
    }

    if (isset($requestData["password"]))
        $requestData["password"] = password_hash($requestData["password"], PASSWORD_DEFAULT);

    $conn = Connection::getConnection();

    try {
        print_r($requestData);
        $build = build_update_query($requestData);
        $sql = "UPDATE customers SET " . $build["fields"] . " WHERE id_customer=:id;";
        var_dump($sql);
        $stmt = $conn->prepare($sql);
        /*  $res = $stmt->execute([
            ":name" => $requestData["name"],
            ":firstname" => $requestData["firstname"],
            ":email" => $requestData["email"],
            ":password" => $requestData["password"],
            ":phone_number" => $requestData["phone_number"],
            ":address" => $requestData["address"] ?? "",
            ":sex" => $requestData["sex"] ?? "M",
            ":additional_info" => $requestData["additional_info"] ?? ""
        ]); */
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }
    echo json_encode(["message" => "Customer succesfully created"]);
}
