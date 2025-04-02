export class DataTable {
    constructor(headers, data, options = {}) {
        this.headers = headers;
        this.data = data;
        this.options = {
            showActions: true,
            showCopyButton: true,
            ...options
        };
        this.table = this._createTable();
    }

    _createTable() {
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';

        const table = document.createElement('table');
        table.className = 'lesson-table';

        // Add header
        table.appendChild(this._createHeader());
        // Add body
        table.appendChild(this._createBody());

        tableContainer.appendChild(table);

        // Add copy button if enabled
        if (this.options.showCopyButton) {
            const copyButton = this._createCopyButton();
            tableContainer.appendChild(copyButton);
        }

        return tableContainer;
    }

    _createHeader() {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        
        this.headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            tr.appendChild(th);
        });

        if (this.options.showActions) {
            tr.appendChild(document.createElement('th')); // Edit
            tr.appendChild(document.createElement('th')); // Delete
        }

        thead.appendChild(tr);
        return thead;
    }

    _createBody() {
        const tbody = document.createElement('tbody');
        
        this.data.forEach((row, index) => {
            const tr = document.createElement('tr');
            
            // Add data cells
            Object.values(row).forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });

            // Add action buttons if enabled
            if (this.options.showActions) {
                tr.appendChild(this._createActionCell('edit', index));
                tr.appendChild(this._createActionCell('delete', index));
            }

            tbody.appendChild(tr);
        });

        return tbody;
    }

    _createActionCell(type, index) {
        const td = document.createElement('td');
        const button = document.createElement('button');
        button.className = `${type}-btn`;
        button.textContent = type === 'edit' ? 'Edit' : 'Delete';
        button.setAttribute('data-index', index);
        
        button.addEventListener('click', () => {
            if (type === 'edit') {
                this._handleEdit(index);
            } else {
                this._handleDelete(index);
            }
        });

        td.appendChild(button);
        return td;
    }

    _createCopyButton() {
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.textContent = 'Copy Table';
        button.addEventListener('click', () => this._handleCopy());
        return button;
    }

    _handleEdit(index) {
        if (this.options.onEdit) {
            this.options.onEdit(this.data[index], index);
        }
    }

    _handleDelete(index) {
        if (this.options.onDelete) {
            this.options.onDelete(index);
        }
    }

    async _handleCopy() {
        try {
            const tempTable = this.table.querySelector('table').cloneNode(true);
            
            // Remove action columns if present
            if (this.options.showActions) {
                const rows = tempTable.querySelectorAll('tr');
                rows.forEach(row => {
                    if (row.cells.length > 0) {
                        row.deleteCell(-1);
                        row.deleteCell(-1);
                    }
                });
            }

            const range = document.createRange();
            range.selectNode(tempTable);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();

            alert('Table copied to clipboard!');
        } catch (error) {
            console.error('Error copying table:', error);
            alert('Failed to copy table');
        }
    }

    render() {
        return this.table;
    }
} 