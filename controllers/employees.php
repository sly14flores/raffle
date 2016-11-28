<?php

require_once '../db.php';

$_POST = json_decode(file_get_contents('php://input'), true);

switch ($_GET['r']) {
	
	case "list":
		
		$con = new pdo_db();
		
		$employees = $con->getData("SELECT * FROM employees");
		
		echo json_encode($employees);
		
	break;
	
	case "collect":
	
		$con = new pdo_db();
		$delete = $con->query("TRUNCATE TABLE employees");	
	
		require_once '../excel.php';		
		echo json_encode(array("status"=>1,"content"=>count($sheet),"employees"=>$sheet));
		
	break;
	
	case "import":

		if ($_POST['empid'] == null) $_POST['empid'] = "";
	
		$con = new pdo_db("employees");
		$employee = $con->insertData($_POST);

		echo "";
		
	break;
	
	case "edit":
	
		$con = new pdo_db();		
		$employee = $con->getData("SELECT * FROM employees WHERE id = $_POST[id]");
		
		echo json_encode($employee[0]);
	
	break;
	
	case "update":

		$con = new pdo_db("employees");		
		$employee = $con->updateData($_POST,'id');
	
	break;
	
	case "delete":
	
		$con = new pdo_db("employees");			
		$con->deleteData(array("id"=>implode(",",$_POST['id'])));
		
		echo "Deletion successful";
	
	break;
	
}

?>