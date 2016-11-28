<div class="table-header">
	List of Prizes
</div>
<div>
	<table id="dynamic-table" class="table table-striped table-bordered table-hover">
		<thead>
			<tr>
				<th>Description</th>
				<th>Type</th>
				<th>No of Winner(s)</th>
				<th></th>
			</tr>
		</thead>

		<tbody>
			<tr ng-repeat="info in prizes">
				<td>{{info.prize_description}}</td>
				<td>{{info.prize_type}}</td>
				<td>{{info.no_of_winners}}</td>
				<td>
					<div class="hidden-sm hidden-xs action-buttons">
						<a class="green" href="javascript:;" ng-click="editPrize(info.id)">
							<i class="ace-icon fa fa-search bigger-130"></i>
						</a>
						<a class="red" href="javascript:;" ng-click="delPrize(info.id)">
							<i class="ace-icon fa fa-trash-o bigger-130"></i>
						</a>
					</div>														
				</td>				
			</tr>													
		</tbody>
	</table>
</div>