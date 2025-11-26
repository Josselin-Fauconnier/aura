<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- POST: RECUPERATION DONNEES PRESTATAIRE
 * PARAMS : id_provider
 * AUTH: token matching id_provider OR admin token
 * RETURN: id_provider, name, firstname, email, phone_number, address, profile_picture, education_experience, subscriber, sexe, SIREN, additional_information, created_at, updated_at, statut
 * 
 * -- PUT: MODIFICATION DONNEES PRESTATAIRE
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
/* require_once "../provider_validation.php"; */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $requestData = $_POST;
        provider_get($requestData);
        break;
    case 'PUT':
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        print_r($input);
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"]; //ICI ON MET LE TOKEN
        }
        customer_delete();
        break;
    case 'DELETE':
        echo "DELETE";
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400); // BAD REQUEST
        break;
}

function provider_get(array $requestData): void
{

    $conn = Connection::getConnection();

    if (!isset($requestData["id_provider"])) {
        echo json_encode(["message" => "id_provider is missing"]);
        http_response_code(400);
        return;
    }

    try {
        $sql = "SELECT * FROM service_providers WHERE id_provider=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_provider"]
        ]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // echo $e->getMessage();
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "Provider not found"]);
        http_response_code(500);
        return;
    }

    echo json_encode($res);
    http_response_code(200);
}

function customer_delete(): void
{
    $url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    echo $url;
}
