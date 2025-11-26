<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DONNEES PRESTATAIRE
 * PARAMS : email OR id_provider
 * AUTH: token matching id_provider OR admin token
 * RETURN: id_provider, name, firstname, email, phone_number, address, profile_picture, education_experience, subscriber, sexe, SIREN, additional_information, created_at, updated_at, statut
 * 
 * -- POST: MODIFICATION DONNEES PRESTATAIRE
 * PARAMS: ?name, ?firstname, ?email, ?password, ?phone_number, ?address, ?profile_picture, ?education_experience, ?subscriber, ?sexe, ?SIREN, ?additional_information, ?statut
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER PRESTATARIE
 * PARAMS: id_provider OR email
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 */

declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";
require_once "../provider_validation.php";

header("Content-Type: application/json; charset=UTF-8");

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $requestData = $_POST;
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"]; //ICI ON MET LE TOKEN
        }
        provider_update($requestData);
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
        if (in_array($key, ["name", "firstname", "email", "password", "phone_number", "address", "profile_picture", "education_experience", "subscriber", "sex", "SIREN", "additional_information", "statut"])) {
            $fields .= $key . " = :" . $key . ", ";
            $execute[":" . $key] = $value;
        }
    }
    if (strlen($fields) > 0)
        $fields = substr($fields, 0, strlen($fields) - 2);
    $execute[":id"] = intval($requestData["id_provider"]);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}

function provider_update(array $requestData): void
{
    //print_r($requestData);
    $requestData = validate_input_update($requestData);
    $requestData = sanitize_input($requestData);

    if (!isset($requestData["id_provider"])) {
        echo json_encode(["message" => "No id_provider in query"]);
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

    $access = check_token($requestData["token"], intval($requestData["id_provider"]));
    if (!$access) {
        echo json_encode(["message" => "Unauthorized"]);
        http_response_code(403);
        return;
    }

    $conn = Connection::getConnection();

    try {
        /*  print_r($requestData); */
        $build = build_update_query($requestData);
        if (strlen($build["fields"]) === 0) {
            echo json_encode(["message" => "No updates made"]);
            http_response_code(400);
            return;
        }

        $sql = "UPDATE service_providers SET " . $build["fields"] . " WHERE id_provider=:id;";
        /* echo ($sql);
        print_r($build["execute"]); */
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute($build["execute"]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }
    echo json_encode(["message" => "Provider succesfully updated"]);
}
