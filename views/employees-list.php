<div class="table-header">
	List of Participants
</div>
<div>
	<table id="dynamic-table" class="table table-striped table-bordered table-hover">
		<thead>
			<tr>
				<th>Employee ID</th>
				<th>Fullname</th>
				<th>Office</th>
				<th>Remarks</th>
			</tr>
		</thead>

		<tbody>
			<tr ng-repeat="employee in employees">
				<td>{{employee.emp_id}}</td>
				<td>{{employee.full_name}}</td>
				<td>{{employee.office}}</td>
				<td>{{employee.remarks}}</td>
			</tr>													
		</tbody>
	</table>
</div>