# 1.
```js
            optionalCells.forEach(content => {
                const td = document.createElement('td');
                td.textContent = content || ''; // Dùng textContent thay vì innerHTML để giữ nguyên các thẻ <g>, <r>
                optionalPhraseRow.appendChild(td);
            });

```