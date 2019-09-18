import { Component, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
	selector: 'auto-table',
	templateUrl: './auto-table.component.html',
	styleUrls: ['./auto-table.component.css'],
	providers: [HttpClient]
})
export class AutoTableComponent {

	apiUrl: string;


	@Input() selectMode = false;
	@Input() hiddenColumns = [];

	selection = new SelectionModel<any>(true, []);

	public dataColumns: string[] = [];
	public displayColumns: string[] = [];
	public inProgress = false;
	public isVisible = false;

	private httpHeaders: HttpHeaders;
	public error: string;
	public matTableDatasource = new MatTableDataSource<object>([]);

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) { }

	rowClickCb = (_) => { };
	loadFromServer(uri: string, query: any = null, method: string = 'GET', columns = []) {
		if (this.inProgress !== true) {
			this.inProgress = true;
			this.cdRef.detectChanges();
		}

		this.matTableDatasource.data = [];
		let p = new HttpParams();

		for (const key in query) {
			if (query.hasOwnProperty(key)) {
				if (query[key]) { p = p.append(key, query[key]); }
			}
		}
		if (method === 'GET') {
			this.httpHeaders = new HttpHeaders();
			this.httpHeaders.append('Content-Type', 'application/json');
			this.http.get(this.apiUrl + uri, { headers: this.httpHeaders, params: p }).subscribe(
				r => this.setDatasource(r, columns),
				e => this.showError(e.message),
				() => this.inProgress = false
			);
		} else if (method === 'POST') {
			this.http.post(this.apiUrl + uri, p, {
				headers: new HttpHeaders()
					.set('Content-Type', 'application/x-www-form-urlencoded')
			}).subscribe(
				r => this.setDatasource(r['payload'], columns),
				e => this.showError(e.message),
				() => this.inProgress = false
			);
		}
	}

	rowClicked(row: any) {
		this.rowClickCb(row);
	}


	private showError(message: string) {
		this.error = 'An error occured while loading the data.';
		console.error(message);
		this.inProgress = false;
		this.isVisible = false;
	}

	private setDatasource(data: any, columns = []) {
		this.error = '';
		this.dataColumns = [];
		this.displayColumns = [];
		columns.forEach(item => { this.dataColumns.push(item); });
		if (columns.length === 0 && data && data[0]) {
			Object.keys(data[0]).forEach(k => {
				this.dataColumns.push(k);
			});
		}
		if (this.selectMode) { this.displayColumns.push('select'); }
		this.dataColumns.forEach(item => {
			if (!this.hiddenColumns.includes(item)) {
				this.displayColumns.push(item);
			}
		});

		this.matTableDatasource.data = data;
		this.matTableDatasource.paginator = this.paginator;
		if (this.matTableDatasource.data && this.matTableDatasource.data.length > 0) {
			this.isVisible = true;
		} else {
			this.isVisible = false;
		}
	}

	public applyFilter(filterValue: string) {
		this.matTableDatasource.filter = filterValue.trim().toLocaleLowerCase();
	}



	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.matTableDatasource.data.forEach(row => this.selection.select(row));
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.matTableDatasource.data.length;
		return numSelected === numRows;
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
	}
}
