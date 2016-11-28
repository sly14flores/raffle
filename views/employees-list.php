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
				<th></th>
			</tr>
		</thead>

		<tbody>
			<tr ng-repeat="info in employees">
				<td>{{info.empid}}</td>
				<td>{{info.fullname}}</td>
				<td>{{info.office}}</td>
				<td>{{info.remarks}}</td>
				<td>
					<div class="hidden-sm hidden-xs action-buttons">
						<a class="green" href="javascript:;" ng-click="editEmployee(info.id)">
							<i class="ace-icon fa fa-search bigger-130"></i>
						</a>
						<a class="red" href="javascript:;" ng-click="delEmployee(info.id)">
							<i class="ace-icon fa fa-trash-o bigger-130"></i>
						</a>
					</div>														
				</td>				
			</tr>													
		</tbody>
	</table>
</div>