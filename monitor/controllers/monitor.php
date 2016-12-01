<?php

require_once '../../db.php';

$_POST = json_decode(file_get_contents('php://input'), true);

switch ($_GET['r']) {
	
	case "draw":
		
		$con_employees = new pdo_db("employees");
		
		
		$con_winners = new pdo_db("winners");
		
		echo $_POST['draw_id'];
		
	break;	
	
}

?>