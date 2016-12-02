<?php

require_once '../../db.php';

$_POST = json_decode(file_get_contents('php://input'), true);

switch ($_GET['r']) {
	
	case "draw":

		$con_employees = new pdo_db("employees");
		$con_winners = new pdo_db("winners");

		$max = $con_employees->getData("SELECT COUNT(*) total FROM employees")[0];

		$valid_pick = false;

		while (!$valid_pick) {

			$employee_is_valid = false;
			$winner_is_valid = false;
			
			$pick = rand(1,$max['total']);
			
			/*
			** if employee is active
			*/
			$employee = $con_employees->getData("SELECT * FROM employees WHERE id = $pick");
			if (sizeof($employee) == 1) $employee_is_valid = true;
			
			/*
			** if employee is not already a winner
			*/
			$winner = $con_winners->getData("SELECT * FROM winners WHERE employee_id = $pick");
			if (sizeof($winner) == 0) $winner_is_valid = true;
				
			$valid_pick = $employee_is_valid && $winner_is_valid;

		}
		
		/*
		** save winner
		*/
		$save = $con_winners->insertData(array("draw_id"=>$_POST['draw_id'],"employee_id"=>$pick));
		
		echo json_encode($employee[0]);

	break;	
	
}

?>