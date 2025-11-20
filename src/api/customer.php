<?php

declare(strict_types=1);

require_once __DIR__ . "/connection.php";

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

function customer_create(
    string $name = "",
    string $firstname = "",
    string $email = "",
    string $phone_number = "",
    string $address = "",
    string $sex = "",
    string $additional_info = ""
): void {
    $conn = Connection::getConnection();

    try {
        $sql = "INSERT INTO customers (name, firstname, email, phone_number, address, sexe  , additional_information    ) VALUES (:name, :firstname, :email, :phone_number, :address, :sex, :additional_info);";
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute([
            ":name" => $name,
            ":firstname" => $firstname,
            ":email" => $email,
            ":phone_number" => $phone_number,
            ":address" => $address,
            ":sex" => $sex,
            ":additional_info" => $additional_info
        ]);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
    }
    echo json_encode(["message" => ""]);
}

function customer_get_by_id(int $id_customer): void
{
    header('Content-Type: application/json');
    $conn = Connection::getConnection();
    $sql = "SELECT * from customers WHERE id_customer=:id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":id", $id_customer);
    $stmt->execute();
    $res = $stmt->fetch(PDO::FETCH_ASSOC);
    //print_r($res);
    echo json_encode($res);
}



/* class Customer
{
    private int $id_customer;
    private string $name;
    private string $firstname;
    private string $email;
    private string $phone_number;
    private string $address;
    private string $sex;
    private string $additional_info;
    private DateTime $created_at;
    private DateTime $updated_at;


    public function __construct(
        int $id_customer = -1,
        string $name = "",
        string $firstname = "",
        string $email = "",
        string $phone_number = "",
        string $address = "",
        string $sex = "",
        string $additional_info = "",
        DateTime $created_at = new DateTime(),
        DateTime $updated_at = new DateTime()
    ) {
        $this->id_customer = $id_customer;
        $this->name = $name;
        $this->firstname = $firstname;
        $this->email = $email;
        $this->phone_number = $phone_number;
        $this->address = $address;
        $this->sex = $sex;
        $this->additional_info = $additional_info;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public function create()
    {
        $conn = Connection::getConnection();

        try {
            $sql = "INSERT INTO customers (name, firstname, email, phone_number, address) VALUES (:name, :firstname, :email, :phone_number, :address);";
            $stmt = $conn->prepare($sql);
            $res = $stmt->execute([
                ":name" => $this->name,
                ":firstname" => $this->firstname,
                ":email" => $this->email,
                ":phone_number" => $this->phone_number,
                ":address" => $this->address
            ]);

            $this->id_customer = (int)$conn->lastInsertId();
        } catch (PDOException $e) {
            echo $e->getMessage();
            return false;
        }

        return $this;
    }

    public function find_by_id(int $id_customer): Customer | null
    {
        $conn = Connection::getConnection();

        $sql = "SELECT * from customers WHERE id_customer=:id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":id", $id_customer);
        $stmt->execute();
        $res = $stmt->fetch();

        if (empty($res))
            return null;

        return $this;
    }
} */
