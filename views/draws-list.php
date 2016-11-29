<div class="table-header">
	Draws and Winners
</div>
<div>
	<table id="dynamic-table" class="table table-striped table-bordered table-hover">
		<thead>
			<tr>
				<th>Description</th>
				<th>Type</th>
				<th>Winner(s)</th>
				<th>Date</th>
				<th></th>
			</tr>
		</thead>

		<tbody>
			<tr ng-repeat="info in draws">
				<td>{{info.description}}</td>
				<td>{{info.prize_type}}</td>
				<td>
					<table id="simple-table" class="table table-striped table-bordered table-hover blue">
					<thead>
						<tr>
							<th>#</th>
							<th>EmpID</th>
							<th>Fullname</th>
							<th>Office</th>
						</tr>
					</thead>
					<tbody>
						<tr ng-repeat="winner in info.winners">
							<td>{{$index+1}}</td>
							<td>{{winner.empid}}</td>
							<td>{{winner.fullname}}</td>
							<td>{{winner.office}}</td>
						</tr>
					</tbody>
					</table>
				</td>
				<td>{{info.date_drawn}}</td>
				<td>
					<div class="hidden-sm hidden-xs action-buttons">
						<a class="green" href="javascript:;">
							<i class="ace-icon glyphicon glyphicon-print bigger-130"></i>
						</a>
					</div>				
				</td>				
			</tr>													
		</tbody>
	</table>
</div>