<?php

/**
 * METHODS: GET, OPTIONS
 * 
 * -- GET: RECUPERATION D'UNE LISTE DES OFFRES CORRESPONDANT AUX FILTRES
 * PARAMS : ?category, ?disponibility, ?perimeter_of_displacement, ?id_provider
 * AUTH: none
 * RETURN: array [... {id_offer, description, duration, category, disponibility, perimeter_of_displacement, price, id_provider, created_at, updated_at}]	
 * 
 */

declare(strict_types=1);

require_once "../connection.php";

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $requestData = $_GET;
        offers_get($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function build_where_clause(array $requestData): array
{
    $res = array();
    $fields = "";
    $execute = array();
    foreach ($requestData as $key => $value) {
        if (in_array($key, ["category", "disponibility", "perimeter_of_displacement", "perimeter_of_displacement"])) {
            $fields .= $key . " = ':" . $key . "', ";
            $execute[":" . $key] = $value;
        } elseif (in_array($key, ["id_provider"])) {
            $fields .= $key . " = :" . $key . ", ";
            $execute[":" . $key] = $value;
        }
    }
    if (strlen($fields) > 0)
        $fields = substr($fields, 0, strlen($fields) - 2);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}


function offers_get($requestData)
{
    $conn = Connection::getConnection();

    $build = build_where_clause($requestData);

    try {
        $sql = "SELECT * FROM offers";
        if (strlen($build['fields']) > 0)
            $sql .= " WHERE " . $build['fields'];
        if (isset($requestData["offset"]))
            $sql .= " OFFSET " . $requestData["offset"];
        if (isset($requestData["limit"]))
            $sql .= " LIMIT " . $requestData["limit"];

        var_dump($sql);
        var_dump($build["execute"]);
        $stmt = $conn->prepare($sql);
        $stmt->execute($build["execute"]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "No offers found"]);
        http_response_code(500);
        return;
    }

    echo json_encode($res);
    http_response_code(200);
}
