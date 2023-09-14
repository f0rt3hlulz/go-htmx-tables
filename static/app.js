document.addEventListener("DOMContentLoaded", function() {
    const tableContainer = document.getElementById("table-container");
    const downloadButton = document.getElementById("download-table-button");

    const radioButtons = document.querySelectorAll('input[name="table"]');
    radioButtons.forEach(function(radioButton) {
        radioButton.addEventListener("change", function(event) {
            const selectedTable = event.target.value;
            fetch(`/get-table?value=${selectedTable}`)
                .then(response => response.text())
                .then(data => {
                    tableContainer.innerHTML = data;
                    initializeTable();
                });
        });
    });

    // Обработчик события для кнопки скачивания
    downloadButton.addEventListener("click", function(event) {
        event.preventDefault();
        
        const selectedTable = form.querySelector('input[name="table"]:checked').value;

        const downloadLink = document.createElement("a");
        downloadLink.href = `/download-table?table=${selectedTable}`;
        downloadLink.download = "table.docx";
        downloadLink.style.display = "none";

        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
    });

    function initializeTable() {
        const criteriaCells = document.querySelectorAll(".criteria-cell");
        const totalCell = document.querySelector(".total-cell");

        criteriaCells.forEach(function(cell, index) {
            const radioInputs = cell.querySelectorAll("input[type=radio]");
            const scoreCell = cell.parentElement.querySelector(".score-cell");

            // Присвоим начальное значение из data-атрибутов
            const dataYes = parseInt(cell.getAttribute("data-yes")) || 0;
            const dataNo = parseInt(cell.getAttribute("data-no")) || 0;

            radioInputs.forEach(function(radioInput) {
                radioInput.addEventListener("change", function() {
                    const selectedValue = radioInput.value;

                    if (selectedValue === "Да") {
                        scoreCell.innerText = dataYes.toString();
                    } else if (selectedValue === "Нет") {
                        scoreCell.innerText = dataNo.toString();
                    }

                    // Обновите итоговые баллы
                    updateTotalScore();
                });
            });

            // Добавим возможность ввода значений
            const inputField = document.createElement("input");
            inputField.type = "number";
            inputField.min = 0;
            inputField.addEventListener("input", function() {
                scoreCell.innerText = inputField.value;
                // Обновите итоговые баллы
                updateTotalScore();
            });

            // Добавим поле ввода вместо scoreCell, если оно пустое
            if (!scoreCell.innerText) {
                scoreCell.appendChild(inputField);
            }
        });

        function updateTotalScore() {
            const rows = document.querySelectorAll("tbody tr");
            let totalScore = 0;
        
            rows.forEach(function(row) {
                const scoreCell = row.querySelector(".score-cell");
        
                // Проверка, существует ли элемент .score-cell и не является ли он null
                if (scoreCell) {
                    // Проверка, является ли ячейка пустой (содержит только &nbsp;)
                    const cellText = scoreCell.innerText.trim();
                    if (cellText !== "&nbsp;" && cellText !== "") {
                        totalScore += parseInt(cellText);
                    }
                }
            });
        
            // Обновляем элемент .total-cell с учетом числового значения totalScore
            const totalCell = document.querySelector(".total-cell");
            totalCell.innerText = totalScore;
        }
              
        // Вызовите функцию обновления итоговых баллов при загрузке страницы
        updateTotalScore();
    }

    // Вызовите функцию инициализации таблицы при загрузке страницы
    initializeTable();
});
