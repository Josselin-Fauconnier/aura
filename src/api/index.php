<?php
require_once "customer.php";

//$customer = new Customer(-1, "Cosmin", "Bilga", "cosmin.bilga@laplateforme.io", "0555334423", "Chez moi", "M", "n'aime pas les chats");

//$customer->create();

//customer_create("Cosmin", "Bilga", "cosmin.bilga@laplateforme.io", "0555334423", "Chez moi", "M", "n'aime pas les chats");

customer_get_by_id(2);
