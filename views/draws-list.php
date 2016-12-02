<div class="table-header">
	Draws and Winners
</div>
<div>
	<table id="dynamic-table" class="table table-striped table-bordered table-hover">
		<thead>
			<tr>
				<th>Toggle</th>
				<th>Description</th>
				<th>Type</th>
				<th>Winner(s)</th>
				<th>No of winner(s)</th>
				<th>Date</th>
				<th></th>
			</tr>
		</thead>

		<tbody>
			<tr ng-repeat="info in draws">
				<td>
				<label class="pull-right inline">
				<input type="checkbox" class="ace ace-switch ace-switch-5" ng-model="views.toggles[info.id]" ng-model="views.toggleRaffle" ng-change="toggle(info)">
				<span class="lbl middle"></span>
				</label>
				</td>
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
							<th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr ng-repeat="winner in info.winners">
							<td>{{$index+1}}</td>
							<td>{{winner.empid}}</td>
							<td>{{winner.fullname}}</td>
							<td>{{winner.office}}</td>
							<td>
							<div class="hidden-sm hidden-xs action-buttons">
								<a class="green" href="javascript:;" ng-click="delWinner(winner.id)">
									<i class="ace-icon glyphicon glyphicon-remove bigger-130"></i>
								</a>						
							</div>							
							</td>
						</tr>
					</tbody>
					</table>
				</td>
				<td>{{info.no_of_winners}}</td>
				<td>{{info.date_drawn}}</td>
				<td>
					<div class="hidden-sm hidden-xs action-buttons">
						<a class="green" href="javascript:;" ng-click="draw(info.id)">
							<i class="ace-icon glyphicon glyphicon-plus bigger-130"></i>
						</a>					
						<a class="green" href="javascript:;">
							<i class="ace-icon glyphicon glyphicon-print bigger-130"></i>
						</a>
						<a class="green" href="javascript:;" ng-click="del(info.id)">
							<i class="ace-icon glyphicon glyphicon-remove bigger-130"></i>
						</a>						
					</div>				
				</td>				
			</tr>													
		</tbody>
	</table>
</div>