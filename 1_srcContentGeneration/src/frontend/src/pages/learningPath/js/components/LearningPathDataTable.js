export class LearningPathDataTable {
    constructor(headers, data, options = {}) {
        this.headers = headers;
        this.data = data;
        this.options = options;
        this.table = this._createTable();
    }

    _createTable() {
        const table = document.createElement('table');
        table.className = 'data-table';
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 14px;
            text-align: left;
        `;

        const thead = this._createHeader();
        const tbody = this._createBody();

        table.appendChild(thead);
        table.appendChild(tbody);

        return table;
    }

    _createHeader() {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');

        this.headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.cssText = `
                padding: 12px;
                background-color: #f8f9fa;
                border-bottom: 2px solid #dee2e6;
                font-weight: bold;
            `;
            tr.appendChild(th);
        });

        thead.appendChild(tr);
        return thead;
    }

    _createBody() {
        const tbody = document.createElement('tbody');

        this.data.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            tr.style.cssText = `
                &:nth-child(even) {
                    background-color: #f8f9fa;
                }
                &:hover {
                    background-color: #f2f2f2;
                }
            `;

            this.headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header.toLowerCase()] || '';
                td.style.cssText = `
                    padding: 12px;
                    border-bottom: 1px solid #dee2e6;
                `;
                tr.appendChild(td);
            });

            if (this.options.onEdit || this.options.onDelete) {
                const actionsTd = this._createActionsCell(rowIndex);
                tr.appendChild(actionsTd);
            }

            tbody.appendChild(tr);
        });

        return tbody;
    }

    _createActionsCell(rowIndex) {
        const td = document.createElement('td');
        td.style.cssText = `
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
            text-align: right;
        `;

        if (this.options.onEdit) {
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-btn';
            editButton.style.cssText = `
                margin-right: 8px;
                padding: 6px 12px;
                background-color: #ffc107;
                color: #000;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
            editButton.addEventListener('click', () => {
                this.options.onEdit(this.data[rowIndex]);
            });
            td.appendChild(editButton);
        }

        if (this.options.onDelete) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn';
            deleteButton.style.cssText = `
                padding: 6px 12px;
                background-color: #dc3545;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
            deleteButton.addEventListener('click', () => {
                this.options.onDelete(rowIndex);
            });
            td.appendChild(deleteButton);
        }

        return td;
    }

    render() {
        return this.table;
    }
} 