<?php

require_once '../db.php';

$_POST = json_decode(file_get_contents('php://input'), true);

switch ($_GET['r']) {
	
	case "list":
		
		$con = new pdo_db();
		
		$draws = $con->getData("SELECT id, (SELECT prize_description FROM prizes WHERE id = prize_id) description, (SELECT prize_type FROM prizes WHERE id = prize_id) prize_type, DATE_FORMAT(draw_date, '%b %d, %Y') date_drawn FROM draws");
		
		foreach ($draws as $key => $value) {
			$winners = $con->getData("SELECT employees.id, employees.empid, employees.fullname, employees.office FROM winners LEFT JOIN employees ON winners.employee_id = employees.id WHERE draw_id = $value[id]");
			$draws[$key]["winners"] = $winners;
		}

		echo json_encode($draws);
		
	break;
	
	case "prizes":
	
		$con = new pdo_db();
		
		$filter = isset($_POST['prize_type']) ? " WHERE prize_type = '$_POST[prize_type]'" : "";
		$prizes = $con->getData("SELECT id, prize_description, no_of_winners FROM prizes$filter");
		
		echo json_encode($prizes);
	
	break;
	
	case "draw":
		
		$con = new pdo_db("draws");
		$draw = $con->insertData($_POST);
		
	break;
	
}

?>