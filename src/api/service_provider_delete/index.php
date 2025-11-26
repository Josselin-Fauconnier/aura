<?php

/**
 * METHODS: POST,  OPTIONS
 * 
 * -- POST: SUPPRIMER CLIENT
 * PARAMS: id_provider
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
        } else {
            $requestData["token"] = "";
        }
        provider_delete($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400); // BAD REQUEST
        break;
}

function provider_delete(array $requestData): void
{

    if (!isset($requestData["id_provider"])) {
        echo json_encode(["message" => "No id_provider"]);
        http_response_code(400);
        return;
    }

    $conn = Connection::getConnection();

    $access = check_token($requestData["token"], intval($requestData["id_provider"]));
    if ($access) {
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
            return;
        }

        if ($res === false) {
            echo json_encode(["message" => "Provider not found"]);
            http_response_code(500);
            return;
        }

        try {
            $sql = "DELETE FROM service_providers WHERE id_provider=:id";
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

        echo json_encode(["message" => "Provider deleted"]);
        http_response_code(200);
    } else {
        echo json_encode(["message" => "Access Forbidden"]);
        http_response_code(403);
        return;
    }
}
