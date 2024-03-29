# mat-auto-table
Automatically generated Angular Material Table from data: Just need to load JSON data from an API.

# Features
- Pagination, Sort and Filter enabled.
- Row selection.
- Row click events.
- Show/hide columns.
- Shows spinner while the data is loading from the API call.
- Shows error message if the API call is not sucessfull.
- Shows empty table message, if there are no records.

# How to use:
- In html:
```<auto-table selectionMode="true" hiddenColumns="['id']"></auto-table>```

- In .ts:

     1 - Get an instance:
     ``` 	
          /* Get an instance */
          @ViewChild(AutoTableComponent, { static: false }) table!: AutoTableComponent;
     ```
     2 - Initialize:
     ```
           /* Initialize */
           ngAfterViewInit(): void {
               this.table.apiUrl = 'api/Stocks/';
               this.table.rowClickCb = (row => {
                 console.log('clicked:', row);
               });
             }
     ```

     3 - Load from an API call:
     ```
          /* With no query strings: */
          this.table.loadFromServer('GetStock');
     
          /* With query strings:  */
          this.table.loadFromServer('GetStock', { status: 1, name: 'testQuery' });
     ```
        
      
